/**
 * Import Lesson Resources collection into Sanity.
 * No dependencies.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const { readCsv, makeSlug, importDocs } = require("./utils/helpers");

async function main() {
  console.log("Importing Lesson Resources...");
  const rows = readCsv("lessonResources");

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    return {
      _type: "lessonResources",
      _id: `resource.${slug}`,
      name: row["Name"],
      slug: makeSlug(slug),
      // Resource file is a Webflow CDN URL — store as external URL string
      resourceFile: row["Resource File"] || undefined,
      description: row["Description"] || undefined,
      resourceType: row["Resource Type"] || undefined,
    };
  });

  await importDocs(client, docs, "Lesson Resources");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
