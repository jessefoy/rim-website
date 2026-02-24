const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "courses" && !(_id in path("drafts.**")) && hideFromMemberProfilePage != true] {
      _id,
      _type,
      name,
      slug,
      description,
      lessons[]-> {
        lessonTitleDisplayed,
        slug,
        isSectionTitle,
        includesAudio
      }
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn("Could not fetch courses from Sanity:", err.message);
    return [];
  }
};
