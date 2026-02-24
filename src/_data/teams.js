const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "teamMember"] | order(sortOrder asc) {
      _id,
      _type,
      name,
      slug,
      sortOrder,
      title,
      bio,
      bioPicture {
        asset-> {
          url
        }
      }
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn("Could not fetch team members from Sanity:", err.message);
    return [];
  }
};
