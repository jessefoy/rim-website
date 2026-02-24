/**
 * Import Weekdays collection into Sanity.
 * No dependencies.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const { readCsv, makeSlug, importDocs } = require("./utils/helpers");

async function main() {
  console.log("Importing Weekdays...");
  const rows = readCsv("weekdays");

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    return {
      _type: "weekdays",
      _id: `weekday.${slug}`,
      name: row["Name"],
      slug: makeSlug(slug),
    };
  });

  await importDocs(client, docs, "Weekdays");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
