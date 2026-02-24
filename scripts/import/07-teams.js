/**
 * Import Teams (teachers/staff) collection into Sanity.
 * No dependencies. Uploads bio pictures from Webflow CDN.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const {
  readCsv,
  makeSlug,
  parseBool,
  uploadImageFromUrl,
  importDocs,
} = require("./utils/helpers");
const { htmlToBlocks } = require("./utils/htmlToBlocks");

async function main() {
  console.log("Importing Teams...");
  const rows = readCsv("teams");
  const docs = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const slug = row["Slug"];
    process.stdout.write(`\r  Processing ${i + 1}/${rows.length}: ${slug}...`);

    const bioHtml = row["Bio"] || "";
    const imageUrl = row["Bio Picture"] || "";

    // Upload bio picture to Sanity assets
    const bioPicture = await uploadImageFromUrl(client, imageUrl);

    const doc = {
      _type: "teams",
      _id: `team.${slug}`,
      name: row["Name"],
      slug: makeSlug(slug),
      title: row["Title"] || undefined,
      bio: bioHtml ? htmlToBlocks(bioHtml) : undefined,
      bioPicture: bioPicture || undefined,
      isOnTeachingCouncil: parseBool(row["Is on Teaching Council"]),
      sortOrder: row["Sort Order"] ? Number(row["Sort Order"]) : undefined,
    };

    // Note: Donorbox Link is omitted — Donorbox is no longer used

    docs.push(doc);
  }

  console.log();
  await importDocs(client, docs, "Teams");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
