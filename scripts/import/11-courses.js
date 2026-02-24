/**
 * Import Courses collection into Sanity.
 * Depends on: Lessons (09)
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const {
  readCsv,
  makeSlug,
  parseBool,
  parseKeyedMultiRef,
  importDocs,
  randomKey,
} = require("./utils/helpers");
const { htmlToBlocks } = require("./utils/htmlToBlocks");

// Load lesson slugs that were actually imported (non-archived, non-draft)
const importedLessons = new Set(
  readCsv("lessons").map((r) => r["Slug"])
);

async function main() {
  console.log("Importing Courses...");
  const rows = readCsv("courses");

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    const contentHtml = row["Main Content / Description"] || "";

    // Only reference lessons that were actually imported (skip archived ones)
    const lessonsRaw = (row["Lessons"] || "")
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s && importedLessons.has(s));

    const lessons = lessonsRaw.map((lessonSlug) => ({
      _key: randomKey(),
      _type: "reference",
      _ref: `lesson.${lessonSlug}`,
    }));

    return {
      _type: "courses",
      _id: `course.${slug}`,
      name: row["Course Title"],
      slug: makeSlug(slug),
      subheading: row["Subheading"] || undefined,
      mainContentDescription: contentHtml ? htmlToBlocks(contentHtml) : undefined,
      lessons: lessons.length > 0 ? lessons : undefined,
      hideFromMemberProfilePage: parseBool(row["Hide From Member Profile Page"]),
    };
  });

  await importDocs(client, docs, "Courses");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
