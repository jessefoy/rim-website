/**
 * Import Class Recording Topics collection into Sanity.
 * No dependencies. CSV is currently empty (no topics yet).
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const { readCsv, makeSlug, importDocs } = require("./utils/helpers");

async function main() {
  console.log("Importing Class Recording Topics...");
  const rows = readCsv("classRecordingTopics");

  if (rows.length === 0) {
    console.log("  (No topics in CSV — skipping)");
    return;
  }

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    return {
      _type: "classRecordingTopics",
      _id: `topic.${slug}`,
      name: row["Name"],
      slug: makeSlug(slug),
    };
  });

  await importDocs(client, docs, "Class Recording Topics");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
