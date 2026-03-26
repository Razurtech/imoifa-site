/**
 * =============================================================================
 * Imoifa Glossary Generation Pipeline
 * =============================================================================
 *
 * Generates bilingual (English + Yorùbá) glossary entries using Claude,
 * then appends them safely to the project's JSON content files.
 *
 * ENVIRONMENT VARIABLES:
 *   ANTHROPIC_API_KEY   — Your Anthropic API key (required)
 *
 * USAGE:
 *   # Single term
 *   npx tsx scripts/generateGlossaryEntry.ts --term "Esu"
 *
 *   # Batch from a plain-text file (one term per line)
 *   npx tsx scripts/generateGlossaryEntry.ts --batch terms.txt
 *
 *   # Batch from a JSON array file (["Term1", "Term2"])
 *   npx tsx scripts/generateGlossaryEntry.ts --batch terms.json
 *
 * OUTPUT FILES:
 *   src/content/en/glossary.json
 *   src/content/yo/glossary.json
 *
 * PLACEHOLDER IMAGES:
 *   If public/images/glossary/<slug>.jpg does not exist,
 *   public/images/glossary/ifa.jpg is duplicated as a placeholder.
 * =============================================================================
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BodySection {
    heading: string;
    text: string;
}

interface GlossaryEntry {
    slug: string;
    language: string;
    term: string;
    pronunciation: string;
    partOfSpeech: string;
    category: string;
    thumbnail: string | null;
    definition: string;
    body: BodySection[];
    tags: string[];
    related: string[];
}

interface BilingualResult {
    en: GlossaryEntry;
    yo: GlossaryEntry;
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const EN_FILE = path.join(ROOT, "src/content/en/glossary.json");
const YO_FILE = path.join(ROOT, "src/content/yo/glossary.json");
const IMG_DIR = path.join(ROOT, "public/images/glossary");
const PLACEHOLDER_IMG = path.join(IMG_DIR, "ifa.jpg");

// ─── Provider Interface ───────────────────────────────────────────────────────

interface AIProvider {
    generateBilingualEntry(term: string): Promise<BilingualResult>;
}

// ─── Claude Provider ──────────────────────────────────────────────────────────

function createClaudeProvider(): AIProvider {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.error("❌  ANTHROPIC_API_KEY environment variable is not set.");
        process.exit(1);
    }

    const client = new Anthropic({ apiKey });

    const SYSTEM_PROMPT = `You are an expert academic archivist specializing in Yorùbá culture, language, and the Ifá tradition. 
You write glossary entries for the Imoifa cultural archive — a scholarly, dark-aesthetic digital archive.

Tone requirements:
- Educational and respectful
- Concise but substantive (definitions 1–3 sentences; body sections 2–4 sentences each)
- Culturally grounded, never sensationalized
- Never trivializing or exoticizing sacred topics
- Use diacritical marks correctly for Yorùbá terms when known

You will always respond with a single valid raw JSON object — no markdown, no code fences, no extra text.
The JSON must match the exact schema provided in the user message.`;

    const buildUserPrompt = (term: string, slug: string): string => `Generate bilingual Yorùbá glossary entries for the term: "${term}"

Return exactly this JSON structure (raw JSON, no code blocks):
{
  "en": {
    "slug": "${slug}",
    "language": "en",
    "term": "<Properly formatted term with diacritics if applicable>",
    "pronunciation": "<phonetic pronunciation, e.g. 'ee-FAH'>",
    "partOfSpeech": "<noun|verb|adjective|etc>",
    "category": "<one of: Core Concepts | Roles & Practice | Deities & Spirits | Texts & Literature | Rituals & Ceremony | Uncategorized>",
    "thumbnail": "/images/glossary/${slug}.jpg",
    "definition": "<Concise 1–2 sentence definition>",
    "body": [
      { "heading": "<Section heading>", "text": "<2–4 sentence body text>" },
      { "heading": "<Section heading>", "text": "<2–4 sentence body text>" }
    ],
    "tags": ["<tag1>", "<tag2>", "<tag3>"],
    "related": []
  },
  "yo": {
    "slug": "${slug}",
    "language": "yo",
    "term": "<Yorùbá name for the term, with diacritics>",
    "pronunciation": "<phonetic>",
    "partOfSpeech": "<Yorùbá grammatical term, e.g. 'orúkọ'>",
    "category": "<Yorùbá category label, e.g. 'Àwọn Èrọ Pàtàkì'>",
    "thumbnail": "/images/glossary/${slug}.jpg",
    "definition": "<Concise Yorùbá definition>",
    "body": [
      { "heading": "<Yorùbá heading>", "text": "<Yorùbá body text>" },
      { "heading": "<Yorùbá heading>", "text": "<Yorùbá body text>" }
    ],
    "tags": ["<yoruba-tag1>", "<yoruba-tag2>"],
    "related": []
  }
}`;

    return {
        async generateBilingualEntry(term: string): Promise<BilingualResult> {
            const slug = slugifyTerm(term);
            const message = await client.messages.create({
                model: "claude-opus-4-5",
                max_tokens: 2000,
                system: SYSTEM_PROMPT,
                messages: [
                    { role: "user", content: buildUserPrompt(term, slug) },
                ],
            });

            const rawText = (message.content[0] as Anthropic.TextBlock).text.trim();

            let parsed: BilingualResult;
            try {
                parsed = JSON.parse(rawText);
            } catch {
                // Attempt to extract JSON if model added extra text
                const match = rawText.match(/\{[\s\S]*\}/);
                if (!match) throw new Error("Claude returned non-JSON output.");
                parsed = JSON.parse(match[0]);
            }

            if (!parsed.en || !parsed.yo) {
                throw new Error("Claude response missing 'en' or 'yo' entries.");
            }

            return parsed;
        },
    };
}

// ─── Utility Functions ────────────────────────────────────────────────────────

/**
 * Converts a glossary term to a URL-safe ASCII slug.
 * Strips diacritics before slugifying to ensure consistent ASCII output.
 */
function slugifyTerm(term: string): string {
    return term
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // strip diacritics
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/** Reads a glossary JSON file and returns its parsed entries. */
function loadGlossary(filePath: string): GlossaryEntry[] {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as GlossaryEntry[];
}

/** Returns true if a slug already exists in the given glossary array. */
function entryExists(entries: GlossaryEntry[], slug: string): boolean {
    return entries.some((e) => e.slug === slug);
}

/**
 * Appends new entries to the en and yo JSON files, preserving existing indentation.
 * EN file uses 2-space indentation; YO file uses 4-space indentation.
 */
function appendEntries(enEntry: GlossaryEntry, yoEntry: GlossaryEntry): void {
    const enEntries = loadGlossary(EN_FILE);
    const yoEntries = loadGlossary(YO_FILE);

    enEntries.push(enEntry);
    yoEntries.push(yoEntry);

    fs.writeFileSync(EN_FILE, JSON.stringify(enEntries, null, 2) + "\n", "utf-8");
    fs.writeFileSync(YO_FILE, JSON.stringify(yoEntries, null, 4) + "\n", "utf-8");
}

/**
 * Copies public/images/glossary/ifa.jpg as a placeholder if the target image
 * doesn't already exist. Safe to call even if ifa.jpg is also missing.
 */
function ensurePlaceholderImage(slug: string): void {
    const target = path.join(IMG_DIR, `${slug}.jpg`);
    if (fs.existsSync(target)) return;

    if (!fs.existsSync(IMG_DIR)) {
        fs.mkdirSync(IMG_DIR, { recursive: true });
    }

    if (fs.existsSync(PLACEHOLDER_IMG)) {
        fs.copyFileSync(PLACEHOLDER_IMG, target);
        console.log(`  📷  Placeholder image created: public/images/glossary/${slug}.jpg`);
    } else {
        console.warn(`  ⚠️  No placeholder image found at public/images/glossary/ifa.jpg — skipping image copy.`);
    }
}

/** Parses a batch file (plain-text or JSON array) and returns a list of terms. */
function parseBatchFile(filePath: string): string[] {
    const abs = path.resolve(filePath);
    if (!fs.existsSync(abs)) {
        console.error(`❌  Batch file not found: ${abs}`);
        process.exit(1);
    }

    const content = fs.readFileSync(abs, "utf-8").trim();

    if (filePath.endsWith(".json")) {
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
            console.error("❌  Batch JSON file must be an array of strings.");
            process.exit(1);
        }
        return parsed.filter((t: unknown) => typeof t === "string" && t.trim());
    }

    // Plain-text: one term per line
    return content.split("\n").map((l) => l.trim()).filter(Boolean);
}

// ─── Core Pipeline ────────────────────────────────────────────────────────────

async function processTerm(term: string, provider: AIProvider): Promise<void> {
    const slug = slugifyTerm(term);
    console.log(`\n🔄  Processing: "${term}" (slug: ${slug})`);

    const enEntries = loadGlossary(EN_FILE);
    if (entryExists(enEntries, slug)) {
        console.log(`  ⏭️  Skipped — slug "${slug}" already exists in en/glossary.json.`);
        return;
    }

    let result: BilingualResult;
    try {
        console.log(`  🤖  Generating bilingual entry via Claude...`);
        result = await provider.generateBilingualEntry(term);
    } catch (err) {
        console.error(`  ❌  Generation failed for "${term}":`, err);
        return;
    }

    ensurePlaceholderImage(slug);
    appendEntries(result.en, result.yo);

    console.log(`  ✅  Added "${result.en.term}" (${slug}) to en and yo glossaries.`);
}

function runPublishPipeline(): void {
    console.log("\n🧪  Running glossary parity check...");
    execSync("npm run check:glossary", { stdio: "inherit" });
    console.log("\n🏗️  Building Next.js app...");
    execSync("npm run build", { stdio: "inherit" });
    console.log("\n🚢  Rebuilding and starting containers...");
//    execSync("docker compose up -d --build", { stdio: "inherit" });
}

// ─── CLI Entry Point ──────────────────────────────────────────────────────────

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const termIndex = args.indexOf("--term");
    const batchIndex = args.indexOf("--batch");

    if (termIndex === -1 && batchIndex === -1) {
        console.error(
            [
                "Usage:",
                "  npx tsx scripts/generateGlossaryEntry.ts --term \"Esu\"",
                "  npx tsx scripts/generateGlossaryEntry.ts --batch terms.txt",
                "  npx tsx scripts/generateGlossaryEntry.ts --batch terms.json",
            ].join("\n")
        );
        process.exit(1);
    }

    const provider = createClaudeProvider();

    if (termIndex !== -1) {
        const term = args[termIndex + 1];
        if (!term) {
            console.error("❌  --term requires a value.");
            process.exit(1);
        }
        await processTerm(term, provider);
        runPublishPipeline();
        return;
    }

    if (batchIndex !== -1) {
        const batchFile = args[batchIndex + 1];
        if (!batchFile) {
            console.error("❌  --batch requires a file path.");
            process.exit(1);
        }

        const terms = parseBatchFile(batchFile);
        console.log(`📋  Batch mode: ${terms.length} term(s) to process.`);

        for (const term of terms) {
            await processTerm(term, provider);
        }

        runPublishPipeline();
        console.log("\n🏁  Batch complete.");
    }
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
