import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const glossary = JSON.parse(
  fs.readFileSync("src/content/en/glossary.json", "utf-8")
);

const imgDir = "public/images/glossary";

const hashMap: Record<string, string[]> = {};
const missing: string[] = [];

for (const entry of glossary) {
  const filePath = path.join(imgDir, `${entry.slug}.jpg`);

  if (!fs.existsSync(filePath)) {
    missing.push(entry.slug);
    continue;
  }

  const buffer = fs.readFileSync(filePath);
  const hash = crypto.createHash("md5").update(buffer).digest("hex");

  if (!hashMap[hash]) hashMap[hash] = [];
  hashMap[hash].push(entry.slug);
}

// find duplicates
const duplicates: string[] = [];
for (const slugs of Object.values(hashMap)) {
  if (slugs.length > 1) {
    duplicates.push(...slugs);
  }
}

// combine targets
const targets = Array.from(new Set([...missing, ...duplicates]));

console.log(`\n🔥 Regenerating ${targets.length} images...\n`);

for (const slug of targets) {
  try {
    console.log(`→ ${slug}`);
    execSync(`npx tsx scripts/generateGlossaryThumbnail.ts ${slug}`, {
      stdio: "inherit",
    });
  } catch (err) {
    console.error(`❌ Failed: ${slug}`);
  }
}

console.log("\n✅ Done.");
