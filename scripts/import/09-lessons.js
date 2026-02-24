/**
 * Import Lessons collection into Sanity.
 * Depends on: Teams (07), Lesson Resources (04)
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
  console.log("Importing Lessons...");
  const rows = readCsv("lessons");

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    const contentHtml = row["Lesson Content"] || "";
    const includesAudio = parseBool(row["Includes Audio?"]);
    const isSectionTitle = parseBool(row["Section Title?"]);

    return {
      _type: "lessons",
      _id: `lesson.${slug}`,
      name: row["Lesson Title - INTERNAL"],
      slug: makeSlug(slug),
      lessonTitleDisplayed: row["Lesson Title - DISPLAYED"] || undefined,
      isSectionTitle,
      includesAudio,
      podcastId: includesAudio ? (row["Podcast ID"] || undefined) : undefined,
      videoLessonLink: row["Video Lesson Link"] || undefined,
      headerQuote: !includesAudio ? (row["Header Quote"] || undefined) : undefined,
      quoteSource: row["Quote Source"] || undefined,
      lessonContent: contentHtml ? htmlToBlocks(contentHtml) : undefined,
      // Multi-ref: semicolon-separated team slugs
      teachers: parseKeyedMultiRef(row["Teachers"], "team"),
      // Multi-ref: semicolon-separated resource slugs
      downloadableResources: parseKeyedMultiRef(
        row["Downloadable Resources"],
        "resource"
      ),
    };
  });

  await importDocs(client, docs, "Lessons");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
