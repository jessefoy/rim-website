const { createClient } = require("@sanity/client");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../../.env") });

const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("No Sanity token found. Set SANITY_WRITE_TOKEN in .env");
  process.exit(1);
}

module.exports = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});
