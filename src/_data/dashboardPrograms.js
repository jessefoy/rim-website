const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "programs" && !(_id in path("drafts.**")) && removeFromProgramList != true] | order(sortOrder asc) {
      _id,
      name,
      sortOrder,
      dayOfWeek[]-> {
        name
      },
      dayFiltering,
      listingDayAndTimeText,
      zoomLink,
      dashboardSpecialAnnouncement,
      dashboardEarlyArrivalMessage
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn("Could not fetch dashboard programs from Sanity:", err.message);
    return [];
  }
};
