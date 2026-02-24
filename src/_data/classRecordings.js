const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "classRecording"] | order(dateRecorded desc) {
      _id,
      _type,
      title,
      slug,
      dateRecorded,
      description,
      teachers[]-> {
        name,
        slug
      },
      topics[]-> {
        name,
        slug
      }
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn(
      "Could not fetch class recordings from Sanity:",
      err.message
    );
    return [];
  }
};
