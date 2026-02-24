/**
 * Import Class Recordings collection into Sanity.
 * Depends on: Teams (07), Class Recording Topics (03), Programs (10)
 *
 * NOTE: The current CSV contains placeholder/test data (5 rows unrelated to
 * mindfulness). These will be imported as-is. Replace with real data later.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const {
  readCsv,
  makeSlug,
  parseSingleRef,
  parseKeyedMultiRef,
  importDocs,
} = require("./utils/helpers");
const { htmlToBlocks } = require("./utils/htmlToBlocks");

async function main() {
  console.log("Importing Class Recordings...");
  const rows = readCsv("classRecordings");

  if (rows.length === 0) {
    console.log("  (No recordings in CSV — skipping)");
    return;
  }

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    const descHtml = row["Description"] || "";

    // Parse date — Webflow exports as "Tue Oct 10 2023 09:00:00 GMT+0000 ..."
    let dateRecorded;
    if (row["Date Recorded"]) {
      const d = new Date(row["Date Recorded"]);
      if (!isNaN(d.getTime())) {
        dateRecorded = d.toISOString().split("T")[0]; // YYYY-MM-DD
      }
    }

    const associatedProgram = parseSingleRef(
      row["Associated Program"],
      "program"
    );

    return {
      _type: "classRecordings",
      _id: `recording.${slug}`,
      name: row["Name"],
      slug: makeSlug(slug),
      dateRecorded: dateRecorded || undefined,
      numberInSeries: row["Number in series."]
        ? Number(row["Number in series."])
        : undefined,
      audioEmbedCode: row["Audio Embed Code"] || undefined,
      videoLink: row["Video Link"] || undefined,
      description: descHtml ? htmlToBlocks(descHtml) : undefined,
      topics: parseKeyedMultiRef(row["Topics"], "topic"),
      teachers: parseKeyedMultiRef(row["Teachers"], "team"),
      associatedProgram: associatedProgram || undefined,
    };
  });

  await importDocs(client, docs, "Class Recordings");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
