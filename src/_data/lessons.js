const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "lessons"] | order(name asc) {
      _id,
      name,
      slug,
      lessonTitleDisplayed,
      isSectionTitle,
      includesAudio,
      podcastId,
      videoLessonLink,
      headerQuote,
      quoteSource,
      lessonContent,
      teachers[]-> {
        name,
        slug
      },
      downloadableResources[]-> {
        name,
        description,
        resourceType,
        resourceFile { asset-> { url } }
      }
    }`;
    return await client.fetch(query);
  } catch (err) {
    console.warn("[_data/lessons.js] Sanity fetch failed:", err.message);
    return [];
  }
};
