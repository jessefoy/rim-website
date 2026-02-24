/**
 * Import Program Categories collection into Sanity.
 * No dependencies.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const { readCsv, makeSlug, parseBool, importDocs } = require("./utils/helpers");

async function main() {
  console.log("Importing Program Categories...");
  const rows = readCsv("programCategories");

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    return {
      _type: "programCategories",
      _id: `category.${slug}`,
      name: row["Name"],
      slug: makeSlug(slug),
      description: row["Description"] || undefined,
      hideFromProgramsPage: parseBool(row["Hide from Programs Page"]),
    };
  });

  await importDocs(client, docs, "Program Categories");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
