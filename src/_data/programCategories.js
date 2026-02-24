const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "programCategories" && !(_id in path("drafts.**")) && hideFromProgramsPage != true] {
      _id,
      _type,
      name,
      slug,
      description
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn(
      "Could not fetch program categories from Sanity:",
      err.message
    );
    return [];
  }
};
