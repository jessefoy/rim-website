const { createClient } = require("@sanity/client");
require("dotenv").config();

const projectId = process.env.SANITY_PROJECT_ID;

// Return null if no project ID is configured yet — data files will return []
if (!projectId || projectId === "your_project_id_here") {
  module.exports = null;
} else {
  module.exports = createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    useCdn: process.env.NODE_ENV === "production",
    token: process.env.SANITY_API_TOKEN,
  });
}
