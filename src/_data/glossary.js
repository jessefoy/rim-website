const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "glossaryEntry"] | order(name asc) {
      _id,
      _type,
      name,
      slug,
      definition
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn("Could not fetch glossary entries from Sanity:", err.message);
    return [];
  }
};
