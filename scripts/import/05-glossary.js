/**
 * Import Glossary (Handful of Leaves) collection into Sanity.
 * No dependencies.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const { readCsv, makeSlug, importDocs } = require("./utils/helpers");

async function main() {
  console.log("Importing Glossary...");
  const rows = readCsv("glossary");

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    return {
      _type: "glossary",
      _id: `glossary.${slug}`,
      name: row["English Name"],
      slug: makeSlug(slug),
      pali: row["Pali"] || undefined,
      sanskrit: row["Sanskrit"] || undefined,
      synonyms: row["Synonyms"] || undefined,
    };
  });

  await importDocs(client, docs, "Glossary");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
