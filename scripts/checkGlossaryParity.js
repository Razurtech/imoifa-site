const fs = require("fs");
const path = require("path");

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getDuplicateSlugs(entries) {
  const seen = new Map();
  const duplicates = new Set();

  for (const entry of entries) {
    const slug = entry.slug;
    if (!slug) continue;

    if (seen.has(slug)) {
      duplicates.add(slug);
    } else {
      seen.set(slug, true);
    }
  }

  return Array.from(duplicates).sort();
}

function main() {
  const root = process.cwd();
  const enPath = path.join(root, "src", "content", "en", "glossary.json");
  const yoPath = path.join(root, "src", "content", "yo", "glossary.json");

  if (!fs.existsSync(enPath)) {
    console.error(`Missing file: ${enPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(yoPath)) {
    console.error(`Missing file: ${yoPath}`);
    process.exit(1);
  }

  const enEntries = loadJson(enPath);
  const yoEntries = loadJson(yoPath);

  const enSlugs = enEntries.map((e) => e.slug).filter(Boolean);
  const yoSlugs = yoEntries.map((e) => e.slug).filter(Boolean);

  const enSet = new Set(enSlugs);
  const yoSet = new Set(yoSlugs);

  const onlyInEn = [...enSet].filter((slug) => !yoSet.has(slug)).sort();
  const onlyInYo = [...yoSet].filter((slug) => !enSet.has(slug)).sort();

  const duplicateEn = getDuplicateSlugs(enEntries);
  const duplicateYo = getDuplicateSlugs(yoEntries);

  const result = {
    englishCount: enEntries.length,
    yorubaCount: yoEntries.length,
    englishUniqueSlugs: enSet.size,
    yorubaUniqueSlugs: yoSet.size,
    onlyInEnglish: onlyInEn,
    onlyInYoruba: onlyInYo,
    duplicateEnglishSlugs: duplicateEn,
    duplicateYorubaSlugs: duplicateYo,
  };

  console.log(JSON.stringify(result, null, 2));

  const hasProblems =
    onlyInEn.length > 0 ||
    onlyInYo.length > 0 ||
    duplicateEn.length > 0 ||
    duplicateYo.length > 0;

  if (hasProblems) {
    console.error("\nGlossary parity check found issues.");
    process.exit(1);
  }

  console.log("\nGlossary parity check passed.");
}

main();
