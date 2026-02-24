/**
 * Import Programs collection into Sanity.
 * Depends on: Weekdays (01), Program Categories (02), Teams (07)
 * Uploads large program images from Webflow CDN.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const {
  readCsv,
  makeSlug,
  parseBool,
  parseKeyedMultiRef,
  uploadImageFromUrl,
  importDocs,
} = require("./utils/helpers");
const { htmlToBlocks } = require("./utils/htmlToBlocks");

async function main() {
  console.log("Importing Programs...");
  const rows = readCsv("programs");
  const docs = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const slug = row["Slug"];
    process.stdout.write(`\r  Processing ${i + 1}/${rows.length}: ${slug}...`);

    const descHtml = row["Information: Program Description"] || "";
    const specialNotesHtml = row["Information: Special Notes"] || "";
    const signedOutHtml = row["Registration: SIGNED-OUT Instructions"] || "";
    const signedInHtml = row["Registration: SIGNED-IN Instructions"] || "";
    const imageUrl = row["Large Program Image"] || "";

    const largeProgramImage = await uploadImageFromUrl(client, imageUrl);

    // Category: single slug — stored as first value in a single-item array ref
    const programCategorySlug = (row["Details: Program Category"] || "").trim();
    const programCategory = programCategorySlug
      ? { _type: "reference", _ref: `category.${programCategorySlug}` }
      : null;

    // Teachers: semicolon-separated slugs
    const teacherFacilitators = parseKeyedMultiRef(
      row["Collection: Teacher/Facilitator(s)"],
      "team"
    );

    // Day of week: array of references (some programs span multiple days)
    const dayOfWeek = parseKeyedMultiRef(
      row["Sorting: Day of the Week"],
      "weekday"
    );

    const doc = {
      _type: "programs",
      _id: `program.${slug}`,
      name: row["Name"],
      slug: makeSlug(slug),

      // Information group
      tagline: row["Information: Tagline"] || undefined,
      quote: row["Information: Quote"] || undefined,
      quoteSource: row["Information: Quote Source"] || undefined,
      programDescription: descHtml ? htmlToBlocks(descHtml) : undefined,
      specialNotes: specialNotesHtml ? htmlToBlocks(specialNotesHtml) : undefined,
      largeProgramImage: largeProgramImage || undefined,

      // Details group
      programCategory: programCategory || undefined,
      teacherFacilitators: teacherFacilitators.length > 0 ? teacherFacilitators : undefined,
      dateText: row["Details: Date Text"] || undefined,
      timeText: row["Details: Time Text"] || undefined,
      listingDayAndTimeText: row["Details: Listing Day and Time Text"] || undefined,
      locationText: row["Details: Location Text"] || undefined,
      locationLink: row["Details: Location Link"] || undefined,
      danaText: row["Details: Dana Text"] || undefined,
      eventTime: row["Event Time"] || undefined,
      zoomLink: row["Zoom Link"] || undefined,
      zoomLinkText: row["Zoom Link Link Text"] || undefined,

      // Registration group
      signedOutInstructions: signedOutHtml ? htmlToBlocks(signedOutHtml) : undefined,
      signedInInstructions: signedInHtml ? htmlToBlocks(signedInHtml) : undefined,
      registrationRequired: parseBool(row["Registration: Required?"]),
      registrationClosed: parseBool(row["Registration Closed"]),
      filloutRegistrationFormId: row["Fillout Registration Form"] || undefined,

      // Dashboard group
      dashboardSpecialAnnouncement: row["Dashboard: Special Announcement"] || undefined,
      dashboardEarlyArrivalMessage: row["Dashboard: Early Arrival Message"] || undefined,
      removeFromProgramList: parseBool(row["Dashboard: Remove From Program List"]),

      // Sorting group
      dayFiltering: row["Day Filtering"] || undefined,
      dayOfWeek: dayOfWeek || undefined,
      sortOrder: row["Sorting: Sort Order"] ? Number(row["Sorting: Sort Order"]) : undefined,
      hideFromProgramPageList: parseBool(row["Hide from Program Page List"]),
    };

    docs.push(doc);
  }

  console.log();
  await importDocs(client, docs, "Programs");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
