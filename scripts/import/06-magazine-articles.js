/**
 * Import Magazine Articles collection into Sanity.
 * No dependencies.
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const client = require("./utils/sanityClient");
const { readCsv, makeSlug, importDocs } = require("./utils/helpers");
const { htmlToBlocks } = require("./utils/htmlToBlocks");

async function main() {
  console.log("Importing Magazine Articles...");
  const rows = readCsv("magazineArticles");

  const docs = rows.map((row) => {
    const slug = row["Slug"];
    const contentHtml = row["Article Content"] || "";
    return {
      _type: "magazineArticles",
      _id: `article.${slug}`,
      name: row["Lesson Title - INTERNAL"],
      slug: makeSlug(slug),
      articleTitleDisplayed: row["Article Title - DISPLAYED"] || undefined,
      articleContent:
        contentHtml ? htmlToBlocks(contentHtml) : undefined,
    };
  });

  await importDocs(client, docs, "Magazine Articles");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
