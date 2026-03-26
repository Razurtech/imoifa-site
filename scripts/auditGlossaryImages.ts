import fs from "fs";
import path from "path";
import crypto from "crypto";

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

console.log("\n❌ Missing Images:");
console.log(missing);

console.log("\n♻️ Duplicate Images:");
for (const [hash, slugs] of Object.entries(hashMap)) {
  if (slugs.length > 1) {
    console.log(slugs);
  }
}
