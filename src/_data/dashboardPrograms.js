const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "program"] | order(sortOrder asc) {
      _id,
      name,
      sortOrder,
      dayOfWeek-> {
        name
      },
      dayAndTimeText,
      zoomLink,
      specialAnnouncement,
      earlyArrivalMessage
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn("Could not fetch dashboard programs from Sanity:", err.message);
    return [];
  }
};
