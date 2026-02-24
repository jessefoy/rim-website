const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "volunteerPositions" && !(_id in path("drafts.**")) && visibleOnVolunteerListingPage == true] {
      _id,
      _type,
      name,
      slug,
      description,
      currentVolunteers[]-> {
        name,
        slug
      }
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn(
      "Could not fetch volunteer positions from Sanity:",
      err.message
    );
    return [];
  }
};
