const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "program" && hideFromProgramPageList != true] | order(sortOrder asc) {
      _id,
      _type,
      name,
      slug,
      sortOrder,
      description,
      shortDescription,
      programCategory-> {
        name,
        slug
      },
      teacherFacilitators[]-> {
        name,
        slug,
        bioPicture {
          asset-> {
            url
          }
        }
      },
      dayOfWeek-> {
        name
      },
      largeProgramImage {
        asset-> {
          url
        }
      }
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn("Could not fetch programs from Sanity:", err.message);
    return [];
  }
};
