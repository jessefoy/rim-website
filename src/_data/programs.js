const client = require("./sanityClient");
if (!client) { module.exports = async function() { return []; }; return; }

module.exports = async function () {
  try {
    const query = `*[_type == "programs" && !(_id in path("drafts.**")) && hideFromProgramPageList != true] | order(sortOrder asc) {
      _id,
      name,
      slug,
      tagline,
      listingDayAndTimeText,
      dateText,
      timeText,
      locationText,
      danaText,
      sortOrder,
      dashboardSpecialAnnouncement,
      registrationRequired,
      registrationClosed,
      filloutRegistrationFormId,
      zoomLink,
      zoomLinkText,
      programCategory-> {
        name,
        slug
      },
      teacherFacilitators[]-> {
        name,
        slug,
        title,
        bioPicture {
          asset-> { url }
        }
      },
      dayOfWeek[]-> {
        name,
        slug
      },
      largeProgramImage {
        asset-> { url }
      }
    }`;

    return await client.fetch(query);
  } catch (err) {
    console.warn("Could not fetch programs from Sanity:", err.message);
    return [];
  }
};
