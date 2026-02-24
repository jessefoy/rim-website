const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "magazineArticle"] {
      _id,
      _type,
      title,
      slug,
      publishedAt,
      excerpt,
      body,
      author,
      coverImage {
        asset-> {
          url
        }
      }
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn(
      "Could not fetch magazine articles from Sanity:",
      err.message
    );
    return [];
  }
};
