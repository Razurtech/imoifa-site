/**
 * =============================================================================
 * Imoifa — Knowledge Notes → Bilingual Glossary Pipeline
 * =============================================================================
 *
 * Reads markdown notes from knowledge/, sends them to Claude, and upserts
 * the resulting bilingual entry into BOTH en/glossary.json and yo/glossary.json.
 *
 * ENVIRONMENT VARIABLES:
 *   ANTHROPIC_API_KEY   — Required
 *   ANTHROPIC_MODEL     — Optional, defaults to claude-opus-4-5
 *
 * MARKDOWN FILE FORMAT (knowledge/<slug>.md):
 *   ---
 *   term: Àṣẹ
 *   slug: ase
 *   category: Core Concepts
 *   tags: [philosophy, energy]
 *   ---
 *
 *   Your raw research notes here…
 *
 * USAGE:
 *   npx tsx scripts/processKnowledgeNotes.ts           # all files
 *   npx tsx scripts/processKnowledgeNotes.ts knowledge/ase.md  # single file
 * =============================================================================
 */

import fs from "fs/promises";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

// ─── Config ───────────────────────────────────────────────────────────────────

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-5";
const ROOT = path.resolve(__dirname, "..");
const KNOWLEDGE_DIR = path.join(ROOT, "knowledge");
const EN_FILE = path.join(ROOT, "src/content/en/glossary.json");
const YO_FILE = path.join(ROOT, "src/content/yo/glossary.json");

// ─── Types ────────────────────────────────────────────────────────────────────

interface BodySection {
    heading: string;
    text: string;
}

interface GlossaryEntry {
    slug: string;
    language: string;
    term: string;
    pronunciation?: string;
    partOfSpeech?: string;
    category?: string;
    thumbnail: string | null;
    definition: string;
    body?: BodySection[];
    tags: string[];
    related?: string[];
}

interface Frontmatter {
    term?: string;
    slug?: string;
    category?: string;
    tags?: string[];
}

interface LangBlock {
    term: string;
    pronunciation: string;
    partOfSpeech: string;
    definition: string;
    body: BodySection[];
}

interface ClaudePayload {
    slug: string;
    category: string;
    tags: string[];
    en: LangBlock;
    yo: LangBlock;
}

// ─── Frontmatter Parser ───────────────────────────────────────────────────────

function parseFrontmatter(raw: string): { fm: Frontmatter; notes: string } {
    const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return { fm: {}, notes: raw.trim() };

    const fm: Frontmatter = {};
    for (const line of match[1].split("\n")) {
        const colon = line.indexOf(":");
        if (colon === -1) continue;
        const key = line.slice(0, colon).trim();
        const value = line.slice(colon + 1).trim();
        if (key === "term") fm.term = value;
        if (key === "slug") fm.slug = value;
        if (key === "category") fm.category = value;
        if (key === "tags") {
            fm.tags = value
                .replace(/^\[|\]$/g, "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);
        }
    }
    return { fm, notes: match[2].trim() };
}

// ─── Claude Call ──────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an academic archivist for the Imoifa Ifá and Yorùbá cultural knowledge archive.
Your task: turn raw research notes into a bilingual (English + Yorùbá) glossary entry.

Tone: educational, respectful, concise, culturally grounded, non-sensationalized.
- definition: 1–2 sentences
- body: minimum 2 sections, 2–4 sentences each

Yorùbá guidance:
- Sacred or canonical terms usually stay in Yorùbá in the "term" field
- Write the Yorùbá definition and body in Yorùbá if possible; otherwise write in respectful, clear English
- Do not over-translate sacred terminology; preserve cultural integrity

ALWAYS return a single raw JSON object — no markdown, no code fences, no extra text.`;

async function callClaude(
    client: Anthropic,
    notes: string,
    fm: Frontmatter,
    slug: string
): Promise<ClaudePayload> {
    // Pin category and tags from frontmatter so Claude doesn't invent or translate them
    const category = fm.category ?? "Uncategorized";
    const tagHint = fm.tags?.length ? fm.tags.join(", ") : "";

    const prompt = `Generate a bilingual glossary entry for the term: "${fm.term ?? slug}"

Use this exact category (do not translate or change it): "${category}"
Use these tags (reuse as-is, or refine slightly): [${tagHint}]

Return exactly this JSON structure — raw JSON only, no code fences, no extra text:
{
  "slug": "${slug}",
  "category": "${category}",
  "tags": ["<tag1>", "<tag2>"],
  "en": {
    "term": "<English term with correct diacritics>",
    "pronunciation": "<phonetic, e.g. 'ee-FAH'>",
    "partOfSpeech": "<noun|verb|adjective|etc>",
    "definition": "<1-2 sentence English definition>",
    "body": [
      { "heading": "<heading>", "text": "<2-4 sentences>" },
      { "heading": "<heading>", "text": "<2-4 sentences>" }
    ]
  },
  "yo": {
    "term": "<Yorùbá term with diacritics>",
    "pronunciation": "<phonetic>",
    "partOfSpeech": "<Yorùbá grammatical label, e.g. orúkọ>",
    "definition": "<Yorùbá definition>",
    "body": [
      { "heading": "<Yorùbá heading>", "text": "<Yorùbá body text>" },
      { "heading": "<Yorùbá heading>", "text": "<Yorùbá body text>" }
    ]
  }
}

Research notes:
${notes}`;

    const resp = await client.messages.create({
        model: MODEL,
        max_tokens: 1800,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
    });

    let raw = (resp.content[0] as Anthropic.TextBlock).text.trim();
    // Strip code fences if model ignores instructions
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Claude returned non-JSON output.");
    return JSON.parse(jsonMatch[0]) as ClaudePayload;
}

// ─── Glossary I/O ─────────────────────────────────────────────────────────────

async function loadGlossary(filePath: string): Promise<GlossaryEntry[]> {
    try {
        return JSON.parse(await fs.readFile(filePath, "utf-8")) as GlossaryEntry[];
    } catch {
        return [];
    }
}

async function saveGlossary(
    filePath: string,
    entries: GlossaryEntry[],
    indent: number
): Promise<void> {
    await fs.writeFile(filePath, JSON.stringify(entries, null, indent) + "\n", "utf-8");
}

// ─── Upsert Logic ─────────────────────────────────────────────────────────────

/**
 * Applies the Claude payload to a specific locale's glossary array.
 * Updates existing entry or creates a new one.
 * Returns a label for logging: "updated" | "created"
 */
function upsertEntry(
    entries: GlossaryEntry[],
    payload: ClaudePayload,
    lang: "en" | "yo",
    slug: string
): "updated" | "created" {
    const block = payload[lang];
    const idx = entries.findIndex((e) => e.slug === slug);

    // Fields that are always updated from Claude's output
    const patch: Partial<GlossaryEntry> = {
        term: block.term,
        pronunciation: block.pronunciation,
        partOfSpeech: block.partOfSpeech,
        definition: block.definition,
        body: block.body,
        // category and tags are identical across both locales (canonical)
        category: payload.category,
        tags: payload.tags,
    };

    if (idx !== -1) {
        // Update — spread patch over existing entry.
        // thumbnail, related, language, and any future fields are preserved.
        entries[idx] = { ...entries[idx], ...patch };
        return "updated";
    } else {
        // Create — build a complete entry matching the project schema exactly.
        const newEntry: GlossaryEntry = {
            slug,
            language: lang,
            term: block.term,
            pronunciation: block.pronunciation,
            partOfSpeech: block.partOfSpeech,
            category: payload.category,
            thumbnail: null,
            definition: block.definition,
            body: block.body,
            tags: payload.tags,
            related: [],
        };
        entries.push(newEntry);
        return "created";
    }
}

// ─── Process One File ─────────────────────────────────────────────────────────

async function processFile(filePath: string, client: Anthropic): Promise<void> {
    const filename = path.basename(filePath);
    console.log(`\n📄  ${filename}`);

    const raw = await fs.readFile(filePath, "utf-8");
    const { fm, notes } = parseFrontmatter(raw);
    const slug = fm.slug ?? path.basename(filePath, ".md");

    if (!notes.trim()) {
        console.warn(`  ⚠️   No notes body — skipping.`);
        return;
    }

    console.log(`  🤖  Calling Claude (${MODEL})…`);
    let payload: ClaudePayload;
    try {
        payload = await callClaude(client, notes, fm, slug);
    } catch (err) {
        console.error(`  ❌  Claude failed:`, err);
        return;
    }

    // Load both glossary files
    const [enEntries, yoEntries] = await Promise.all([
        loadGlossary(EN_FILE),
        loadGlossary(YO_FILE),
    ]);

    const enAction = upsertEntry(enEntries, payload, "en", slug);
    const yoAction = upsertEntry(yoEntries, payload, "yo", slug);

    // Save both files — EN uses 2-space indent, YO uses 4-space
    await Promise.all([
        saveGlossary(EN_FILE, enEntries, 2),
        saveGlossary(YO_FILE, yoEntries, 4),
    ]);

    const icon = (a: string) => (a === "created" ? "✨" : "✅");
    console.log(`  ${icon(enAction)}  EN slug "${slug}" — ${enAction}`);
    console.log(`  ${icon(yoAction)}  YO slug "${slug}" — ${yoAction}`);
}

// ─── CLI Entry Point ──────────────────────────────────────────────────────────

async function main(): Promise<void> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.error("❌  ANTHROPIC_API_KEY is not set.");
        process.exit(1);
    }
    const client = new Anthropic({ apiKey });

    const arg = process.argv[2];
    if (arg) {
        await processFile(path.resolve(arg), client);
        console.log("\n🏁  Done.");
        return;
    }

    let files: string[];
    try {
        files = await fs.readdir(KNOWLEDGE_DIR);
    } catch {
        console.error(`❌  knowledge/ directory not found at ${KNOWLEDGE_DIR}.`);
        process.exit(1);
    }

    const mdFiles = files.filter((f) => f.endsWith(".md"));
    if (mdFiles.length === 0) {
        console.log("ℹ️   No .md files found in knowledge/.");
        return;
    }

    console.log(`📋  ${mdFiles.length} note file(s) to process.`);
    for (const file of mdFiles) {
        await processFile(path.join(KNOWLEDGE_DIR, file), client);
    }
    console.log("\n🏁  Done.");
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});