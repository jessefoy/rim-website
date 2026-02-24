/**
 * Import Volunteer Positions collection into Sanity.
 * Depends on: Teams (07)
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const {
  readCsv,
  makeSlug,
  parseBool,
  parseKeyedMultiRef,
  importDocs,
} = require("./utils/helpers");
const { htmlToBlocks } = require("./utils/htmlToBlocks");

async function main() {
  console.log("Importing Volunteer Positions...");
  const rows = readCsv("volunteerPositions");

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    const descHtml = row["Position Description"] || "";

    return {
      _type: "volunteerPositions",
      _id: `volunteer.${slug}`,
      name: row["Name"],
      slug: makeSlug(slug),
      positionDescription: descHtml ? htmlToBlocks(descHtml) : undefined,
      visibleOnVolunteerListingPage: parseBool(
        row["Visible On Volunteer Listing Page?"]
      ),
      isOpen: parseBool(row["Open <> Filled Switch"]),
      // "Current Volunteers" references team members by slug
      currentVolunteers: parseKeyedMultiRef(
        row["Current Volunteers"],
        "team"
      ),
    };
  });

  await importDocs(client, docs, "Volunteer Positions");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
