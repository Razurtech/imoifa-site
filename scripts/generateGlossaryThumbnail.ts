import fs from "fs";
import path from "path";
import sharp from "sharp";
import { GoogleGenAI, Modality } from "@google/genai";

type BodySection = {
  heading: string;
  text: string;
};

type GlossaryEntry = {
  slug: string;
  term: string;
  category?: string;
  tags?: string[];
  description?: string;
  body?: BodySection[];
  image?: string;
};

const repoRoot = process.cwd();
const enPath = path.join(repoRoot, "src/content/en/glossary.json");
const outDir = path.join(repoRoot, "public/images/glossary");

const primaryModel =
  process.env.GLOSSARY_IMAGE_MODEL || "imagen-4.0-generate-001";
const fallbackModel =
  process.env.GLOSSARY_IMAGE_FALLBACK_MODEL || "gemini-3-pro-image-preview";

function loadEnglishGlossary(): GlossaryEntry[] {
  return JSON.parse(fs.readFileSync(enPath, "utf8"));
}

function getEntry(slug: string): GlossaryEntry {
  const entries = loadEnglishGlossary();
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) throw new Error(`Slug not found: ${slug}`);
  return entry;
}

function buildPrompt(entry: GlossaryEntry): string {
  const slug = entry.slug.toLowerCase();
  const category = (entry.category || "").toLowerCase();
  const tags = (entry.tags || []).map((t) => t.toLowerCase());

  const context = [
    `Term: ${entry.term}`,
    entry.category ? `Category: ${entry.category}` : "",
    entry.tags?.length ? `Tags: ${entry.tags.join(", ")}` : "",
    entry.description ? `Description: ${entry.description}` : "",
    ...(entry.body || []).slice(0, 2).map((s) => `${s.heading}: ${s.text}`),
  ]
    .filter(Boolean)
    .join("\n");

  let visualDirection =
    `Create a square editorial image for a serious Yoruba / Ifá cultural glossary archive.`;

  if (
    category.includes("orisha") ||
    category.includes("òrìṣà") ||
    tags.includes("orisha") ||
    tags.includes("òrìṣà")
  ) {
    visualDirection =
      `Create a square editorial image for a serious Yoruba / Ifá cultural glossary archive. 
Use a respectful symbolic scene rather than a fantasy character portrait. 
Show sacred atmosphere through objects, materials, shrine context, environment, or ritual symbolism.`;
  } else if (
    category.includes("ritual") ||
    category.includes("tool") ||
    tags.includes("ritual") ||
    tags.includes("tool") ||
    tags.includes("divination")
  ) {
    visualDirection =
      `Create a square museum-quality documentary image for a Yoruba / Ifá glossary archive.
Focus on a realistic handcrafted ritual object or divination context with authentic materials and subtle atmosphere.`;
  } else if (
    category.includes("concept") ||
    category.includes("philosophy") ||
    category.includes("virtue") ||
    tags.includes("concept") ||
    tags.includes("philosophy")
  ) {
    visualDirection =
      `Create a square symbolic editorial image for a Yoruba / Ifá glossary archive.
Express the meaning through natural materials, light, texture, and atmosphere rather than literal character depiction.`;
  }

  const termSpecificHints: Record<string, string> = {
    ogun: "forged iron, blacksmith tools, anvil, strength, earth tones, disciplined atmosphere",
    "ose-sango": "thunder symbolism, carved wood, sacred staff symbolism, royal energy, deep reds, storm atmosphere",
    sango: "thunder symbolism, carved wood, sacred staff symbolism, royal energy, deep reds, storm atmosphere",
    obaluaye: "raffia texture, earth, healing symbolism, sacred stillness, humility, muted natural tones",
    esu: "crossroads, pathway symbolism, messenger energy, balance, red and black accents, sacred ambiguity",
    orunmila: "wisdom, divination, palm nuts, opon ifa, iyerosun powder, calm sacred atmosphere",
    ifa: "divination tray, palm nuts, iyerosun, woven mat, carved wood, sacred order",
    osugbo: "aged wood, earth tones, solemn ritual atmosphere, seniority, dignity, ancestral gravitas",
  };

  const hint = termSpecificHints[slug];

  return `
${visualDirection}

Glossary context:
${context}

Visual requirements:
- culturally respectful
- grounded in Yoruba / Ifá visual symbolism
- archival, refined, atmospheric, and natural
- realistic materials such as wood, brass, cloth, beads, calabash, raffia, carved surfaces, woven mat, earth textures
- soft natural light or subtle dramatic daylight
- elegant 1:1 square composition
- visually distinct from other glossary entries
- suitable for a premium cultural knowledge archive

Strongly avoid:
- text, letters, captions, symbols rendered as typography
- cartoon style
- generic stock icon look
- glossy 3D render look
- plastic-looking faces or objects
- neon glow
- fantasy magic effects
- superhero poster style
- random modern objects
- overly saturated colors

${hint ? `Term-specific emphasis:\n- ${hint}` : ""}

The result should feel like a serious museum or editorial cultural archive image, not generic AI art.
`.trim();
}

async function saveAsJpeg(buffer: Buffer, outputPath: string) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await sharp(buffer)
    .resize(1024, 1024, { fit: "cover" })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outputPath);
}

async function generateWithImagen(ai: GoogleGenAI, prompt: string): Promise<Buffer> {
  const response = await ai.models.generateImages({
    model: primaryModel,
    prompt,
    config: {
      numberOfImages: 1,
    },
  });

  const imgBytes = response.generatedImages?.[0]?.image?.imageBytes;
  if (!imgBytes) throw new Error(`No image returned from ${primaryModel}`);
  return Buffer.from(imgBytes, "base64");
}

async function generateWithGeminiFallback(
  ai: GoogleGenAI,
  prompt: string
): Promise<Buffer> {
  const response = await ai.models.generateContent({
    model: fallbackModel,
    contents: prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  for (const candidate of response.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (part.inlineData?.data) {
        return Buffer.from(part.inlineData.data, "base64");
      }
    }
  }

  throw new Error(`No image returned from ${fallbackModel}`);
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: npx tsx scripts/generateGlossaryThumbnail.ts <slug>");
    process.exit(1);
  }

  const entry = getEntry(slug);
  const prompt = buildPrompt(entry);
  const outputPath = path.join(outDir, `${slug}.jpg`);

  const ai = new GoogleGenAI({
    vertexai: true,
    project: process.env.GOOGLE_CLOUD_PROJECT!,
    location: process.env.GOOGLE_CLOUD_LOCATION || "global",
  });

  let buffer: Buffer;
  try {
    buffer = await generateWithImagen(ai, prompt);
    console.log(`Primary succeeded: ${primaryModel}`);
  } catch (err) {
    console.warn(`Primary failed: ${primaryModel}`);
    console.warn(`Falling back to: ${fallbackModel}`);
    buffer = await generateWithGeminiFallback(ai, prompt);
  }

  await saveAsJpeg(buffer, outputPath);
  console.log(`Saved ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
