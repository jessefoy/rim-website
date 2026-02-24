import { defineField, defineType } from "sanity";

export default defineType({
  name: "programs",
  title: "Programs",
  type: "document",
  groups: [
    { name: "information", title: "Information" },
    { name: "details", title: "Details" },
    { name: "registration", title: "Registration" },
    { name: "dashboard", title: "Dashboard" },
    { name: "sorting", title: "Sorting & Visibility" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),

    // Information
    defineField({
      name: "tagline",
      title: "Tagline",
      description: "Short description shown on program listings",
      type: "string",
      group: "information",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      group: "information",
    }),
    defineField({
      name: "quoteSource",
      title: "Quote Source",
      type: "string",
      group: "information",
    }),
    defineField({
      name: "programDescription",
      title: "Program Description",
      type: "array",
      group: "information",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  { name: "href", type: "url", title: "URL" },
                  {
                    name: "openInNewTab",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "specialNotes",
      title: "Special Notes",
      type: "array",
      group: "information",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "largeProgramImage",
      title: "Large Program Image",
      type: "image",
      options: { hotspot: true },
      group: "information",
    }),

    // Details
    defineField({
      name: "programCategory",
      title: "Program Category",
      type: "reference",
      to: [{ type: "programCategories" }],
      group: "details",
    }),
    defineField({
      name: "teacherFacilitators",
      title: "Teacher / Facilitator(s)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teams" }] }],
      group: "details",
    }),
    defineField({
      name: "dateText",
      title: "Date Text",
      description: 'e.g. "Every Wednesday"',
      type: "string",
      group: "details",
    }),
    defineField({
      name: "timeText",
      title: "Time Text",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "listingDayAndTimeText",
      title: "Listing Day and Time Text",
      description: "Concise version for program listings",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "locationText",
      title: "Location Text",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "locationLink",
      title: "Location Link",
      description: "Google Maps or website URL",
      type: "url",
      group: "details",
    }),
    defineField({
      name: "danaText",
      title: "Dana Text",
      description: "Donation/dana information",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "eventTime",
      title: "Event Time",
      description: "Start time used for Zoom link timing (e.g. 7:00 PM)",
      type: "string",
      group: "details",
    }),
    defineField({
      name: "zoomLink",
      title: "Zoom Link",
      type: "url",
      group: "details",
    }),
    defineField({
      name: "zoomLinkText",
      title: "Zoom Link Button Text",
      type: "string",
      group: "details",
    }),

    // Registration
    defineField({
      name: "signedOutInstructions",
      title: "Signed-Out Instructions",
      description: "Shown to visitors who are not logged in",
      type: "array",
      group: "registration",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "signedInInstructions",
      title: "Signed-In Instructions",
      description: "Shown to logged-in members",
      type: "array",
      group: "registration",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "registrationRequired",
      title: "Registration Required?",
      type: "boolean",
      initialValue: false,
      group: "registration",
    }),
    defineField({
      name: "registrationClosed",
      title: "Registration Closed",
      type: "boolean",
      initialValue: false,
      group: "registration",
    }),
    defineField({
      name: "filloutRegistrationFormId",
      title: "Fillout Registration Form ID",
      description: "The Fillout form ID for embedded registration",
      type: "string",
      group: "registration",
    }),

    // Dashboard
    defineField({
      name: "dashboardSpecialAnnouncement",
      title: "Dashboard: Special Announcement",
      description: "Appears in red on member dashboard",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardEarlyArrivalMessage",
      title: "Dashboard: Early Arrival Message",
      description: "Appears in grey on member dashboard",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "removeFromProgramList",
      title: "Remove From Program List (Dashboard)",
      type: "boolean",
      initialValue: false,
      group: "dashboard",
    }),
    defineField({
      name: "dayFiltering",
      title: "Day Filtering",
      description: "Controls dashboard visibility by day",
      type: "string",
      group: "dashboard",
    }),

    // Sorting & Visibility
    defineField({
      name: "dayOfWeek",
      title: "Day of the Week",
      type: "array",
      of: [{ type: "reference", to: [{ type: "weekdays" }] }],
      group: "sorting",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      group: "sorting",
    }),
    defineField({
      name: "hideFromProgramPageList",
      title: "Hide from Program Page List",
      type: "boolean",
      initialValue: false,
      group: "sorting",
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Name A–Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tagline",
      media: "largeProgramImage",
    },
  },
});
