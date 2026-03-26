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
  const context = [
    `Term: ${entry.term}`,
    entry.category ? `Category: ${entry.category}` : "",
    entry.tags?.length ? `Tags: ${entry.tags.join(", ")}` : "",
    entry.description ? `Description: ${entry.description}` : "",
    ...(entry.body || []).slice(0, 2).map((s) => `${s.heading}: ${s.text}`),
  ]
    .filter(Boolean)
    .join("\n");

  return `
Create a square editorial thumbnail for the Yoruba/Ifá glossary term "${entry.term}".

Requirements:
- culturally respectful
- symbolic, refined, archival, atmospheric
- no text, no letters, no captions
- not cartoonish
- not a generic stock icon
- visually distinct from other glossary entries
- clean composition suitable for a premium cultural knowledge archive
- 1:1 square composition

Glossary context:
${context}
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
