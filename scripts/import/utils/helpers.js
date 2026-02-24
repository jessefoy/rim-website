/**
 * Shared helpers for Sanity CSV import scripts.
 */
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const CSV_DIR = path.resolve(
  __dirname,
  "../../../webflow-export/rim.cms-export"
);

// Webflow collection IDs → human-readable names (for error messages)
const COLLECTION_IDS = {
  weekdays: "61b954e3cf42f03dbdb1f30f",
  programCategories: "5f0e1e83f002b1da59e1f617",
  classRecordingTopics: "6945a35e8085e068ad5228b7",
  lessonResources: "688a7acb887670e400b8bde5",
  glossary: "66634eed9601e559555f45f7",
  magazineArticles: "659f21c4946fccd4ae9db106",
  teams: "5f0e1e83f002b163e8e1f61a",
  volunteerPositions: "6104394ccabf7e321aaf0efb",
  lessons: "5fb2f823dd801635b9416eaf",
  programs: "5fa08aefda60b60f4d84b62a",
  courses: "5fb2f705f2fe9abb60afe68f",
  classRecordings: "6945a7700716f04f329be4bd",
};

/**
 * Read and parse a CSV file by collection name.
 * Skips archived and draft rows.
 */
function readCsv(collectionName) {
  const collectionId = COLLECTION_IDS[collectionName];
  if (!collectionId) throw new Error(`Unknown collection: ${collectionName}`);

  const files = fs.readdirSync(CSV_DIR);
  const file = files.find((f) => f.includes(collectionId));
  if (!file)
    throw new Error(`CSV not found for collection: ${collectionName}`);

  const content = fs.readFileSync(path.join(CSV_DIR, file), "utf8");
  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
  });

  // Filter out archived and draft rows
  return rows.filter(
    (r) =>
      r["Archived"] !== "true" &&
      r["Draft"] !== "true"
  );
}

/**
 * Parse a boolean string from CSV ("true"/"false").
 */
function parseBool(val, defaultVal = false) {
  if (val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return defaultVal;
}

/**
 * Parse a multi-reference field (semicolon-separated slugs).
 * Returns an array of Sanity reference objects.
 * idPrefix: e.g. "team" → looks up team.{slug}
 */
function parseMultiRef(val, idPrefix) {
  if (!val || !val.trim()) return [];
  return val
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((slug) => makeRef(`${idPrefix}.${slug}`));
}

/**
 * Parse a single reference field (one slug).
 * Returns a Sanity reference object or null.
 */
function parseSingleRef(val, idPrefix) {
  if (!val || !val.trim()) return null;
  const slug = val.trim();
  return makeRef(`${idPrefix}.${slug}`);
}

/**
 * Create a Sanity reference object.
 */
function makeRef(id) {
  return { _type: "reference", _ref: id };
}

/**
 * Create a keyed reference (for arrays of references).
 */
function makeKeyedRef(id) {
  return { _key: randomKey(), _type: "reference", _ref: id };
}

/**
 * Parse multi-refs into keyed array (for array-of-reference fields).
 */
function parseKeyedMultiRef(val, idPrefix) {
  if (!val || !val.trim()) return [];
  return val
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((slug) => makeKeyedRef(`${idPrefix}.${slug}`));
}

/**
 * Build a Sanity slug object.
 */
function makeSlug(current) {
  return { _type: "slug", current };
}

/**
 * Random key for Portable Text blocks.
 */
function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Upload an image from URL to Sanity and return a Sanity image object.
 * Returns null if URL is empty or upload fails.
 */
async function uploadImageFromUrl(client, url) {
  if (!url || !url.trim()) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ⚠ Image fetch failed (${res.status}): ${url.slice(0, 70)}`);
      return null;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const rawName = url.split("/").pop().split("?")[0] || "image.jpg";
    const fileName = decodeURIComponent(rawName);
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const asset = await client.assets.upload("image", buffer, {
      filename: fileName,
      contentType,
    });
    return {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    };
  } catch (e) {
    console.warn(`  ⚠ Image upload error: ${e.message} — ${url.slice(0, 70)}`);
    return null;
  }
}

/**
 * Run a batch of Sanity mutations.
 * Uses createOrReplace so the script is idempotent.
 */
async function importDocs(client, docs, collectionName) {
  let created = 0;
  let failed = 0;

  for (const doc of docs) {
    try {
      await client.createOrReplace(doc);
      created++;
      process.stdout.write(`\r  Imported ${created}/${docs.length}...`);
    } catch (e) {
      failed++;
      console.error(`\n  ✗ Failed to import "${doc.name || doc._id}": ${e.message}`);
    }
  }

  console.log(`\n✓ ${collectionName}: ${created} imported, ${failed} failed`);
}

module.exports = {
  readCsv,
  parseBool,
  parseMultiRef,
  parseSingleRef,
  parseKeyedMultiRef,
  makeRef,
  makeKeyedRef,
  makeSlug,
  randomKey,
  uploadImageFromUrl,
  importDocs,
};
