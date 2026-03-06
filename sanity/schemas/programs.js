import { defineField, defineType } from "sanity";

export default defineType({
  name: "programs",
  title: "Programs",
  type: "document",
  groups: [
    { name: "content",      title: "Content" },
    { name: "schedule",     title: "Schedule & Location" },
    { name: "registration", title: "Registration" },
    { name: "dana",         title: "Dana" },
    { name: "dashboard",    title: "Dashboard" },
    { name: "visibility",   title: "Visibility" },
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

    // ── Content ──────────────────────────────────────────────────────────────
    defineField({
      name: "tagline",
      title: "Tagline",
      description: "Short description shown on program listings",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "largeProgramImage",
      title: "Program Image",
      type: "image",
      options: { hotspot: true },
      group: "content",
    }),
    defineField({
      name: "programDescription",
      title: "Program Description",
      type: "richContent",
      group: "content",
    }),
    defineField({
      name: "quote",
      title: "Pull Quote",
      type: "text",
      group: "content",
    }),
    defineField({
      name: "quoteSource",
      title: "Quote Source",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "specialNotes",
      title: "Special Notes",
      description: "Displayed on the program page below the description",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "teacherFacilitators",
      title: "Teacher / Facilitator(s)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teams" }] }],
      group: "content",
    }),
    defineField({
      name: "linkedCourses",
      title: "Linked Courses (Online Materials)",
      description: "Members who register for this program automatically get access to all listed courses.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "courses" }] }],
      group: "content",
    }),

    // ── Schedule & Location ───────────────────────────────────────────────────
    defineField({
      name: "programCategory",
      title: "Program Category",
      description:
        "Required for this program to appear on the Programs & Events listing page. " +
        "Click the field and start typing to search, or press Backspace to see all categories.",
      type: "reference",
      to: [{ type: "programCategories" }],
      options: {
        disableNew: true,
        filter: "hideFromProgramsPage != true",
      },
      group: "schedule",
    }),
    defineField({
      name: "dateText",
      title: "Date & Time",
      description: 'e.g. "Every Wednesday, 6–7:30pm" or "June 7–9, 2025 · 9am–5pm"',
      type: "string",
      group: "schedule",
    }),
    defineField({
      name: "startDatetime",
      title: "Start Date & Time",
      description:
        "Used to generate Add-to-Calendar links and to create Google Meet rooms. " +
        "Leave blank for recurring or open-ended programs.",
      type: "datetime",
      group: "schedule",
    }),
    defineField({
      name: "endDatetime",
      title: "End Date & Time",
      description:
        "Optional end time for Add-to-Calendar links. " +
        "Defaults to 1 hour after start if left blank.",
      type: "datetime",
      group: "schedule",
    }),
    defineField({
      name: "recurrenceFreq",
      title: "Repeats",
      description: "Leave blank for a single event or a retreat that runs as one continuous block.",
      type: "string",
      group: "schedule",
      options: {
        list: [
          { title: "Daily",   value: "daily" },
          { title: "Weekly",  value: "weekly" },
          { title: "Monthly", value: "monthly" },
        ],
      },
    }),
    defineField({
      name: "recurrenceInterval",
      title: "Every",
      description: 'How often — e.g. "1" = every week, "2" = every other week. Leave blank to default to 1.',
      type: "number",
      group: "schedule",
      hidden: ({ document }) => !document?.recurrenceFreq,
      validation: (Rule) => Rule.integer().min(1).max(52),
    }),
    defineField({
      name: "recurrenceDays",
      title: "On Days",
      description: "Which days of the week (weekly recurrence only).",
      type: "array",
      of: [{ type: "string" }],
      group: "schedule",
      hidden: ({ document }) => document?.recurrenceFreq !== "weekly",
      options: {
        list: [
          { title: "Sunday",    value: "SU" },
          { title: "Monday",    value: "MO" },
          { title: "Tuesday",   value: "TU" },
          { title: "Wednesday", value: "WE" },
          { title: "Thursday",  value: "TH" },
          { title: "Friday",    value: "FR" },
          { title: "Saturday",  value: "SA" },
        ],
        layout: "grid",
      },
    }),
    defineField({
      name: "recurrenceCount",
      title: "Number of Sessions",
      description: "Total sessions including the first. E.g. a 4-week Wednesday course = 4.",
      type: "number",
      group: "schedule",
      hidden: ({ document }) => !document?.recurrenceFreq,
      validation: (Rule) => Rule.integer().min(2).max(365),
    }),
    defineField({
      name: "locationText",
      title: "Location",
      type: "string",
      group: "schedule",
    }),
    defineField({
      name: "locationLink",
      title: "Location Link",
      description: "Google Maps or website URL",
      type: "url",
      group: "schedule",
    }),
    defineField({
      name: "zoomLink",
      title: "Meeting Link",
      description: "Google Meet or Zoom URL. Auto-filled when a Google Meet is created via the /volunteer area.",
      type: "url",
      group: "schedule",
    }),
    defineField({
      name: "meetHostAccount",
      title: "Meet Host Account",
      description: "Set automatically when a Google Meet is created. The host team logs into this account to host the session.",
      type: "string",
      readOnly: true,
      group: "schedule",
    }),

    // ── Registration ─────────────────────────────────────────────────────────
    defineField({
      name: "registrationEnabled",
      title: "Enable Registration",
      description: "Turns on the built-in registration form for this program",
      type: "boolean",
      initialValue: false,
      group: "registration",
    }),
    defineField({
      name: "registrationClosed",
      title: "Registration Closed",
      description: "Manually close registration even if capacity remains and the deadline hasn't passed",
      type: "boolean",
      initialValue: false,
      group: "registration",
    }),
    defineField({
      name: "registrationCapacity",
      title: "Capacity",
      description: "Maximum registrations before waitlist kicks in. Leave blank for unlimited.",
      type: "number",
      group: "registration",
    }),
    defineField({
      name: "registrationDeadline",
      title: "Registration Deadline",
      description: "Form closes automatically at this date/time",
      type: "datetime",
      group: "registration",
    }),
    defineField({
      name: "registrationFields",
      title: "Custom Registration Questions",
      description: "Additional questions shown on the registration form, after the standard fields",
      type: "array",
      group: "registration",
      of: [
        {
          type: "object",
          name: "registrationField",
          title: "Question",
          fields: [
            defineField({
              name: "label",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "fieldType",
              title: "Answer Type",
              type: "string",
              options: {
                list: [
                  { title: "Short Text", value: "shortText" },
                  { title: "Long Text", value: "longText" },
                  { title: "Yes / No", value: "yesNo" },
                  { title: "Multiple Choice", value: "select" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "required",
              title: "Required?",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "options",
              title: "Choices",
              description: "Add each option for Multiple Choice questions",
              type: "array",
              of: [{ type: "string" }],
              hidden: ({ parent }) => parent?.fieldType !== "select",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "fieldType" },
          },
        },
      ],
    }),
    defineField({
      name: "confirmationMessage",
      title: "Confirmation Email Message",
      description:
        "Custom message included in the registration confirmation email. " +
        "Supports bold, italic, links, and bullet lists. " +
        "If blank, no extra message is added.",
      type: "array",
      group: "registration",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [{ title: "Bullet", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "reminderDate",
      title: "Reminder Email Date",
      description: "The system will automatically send a reminder email to all registrants on this date.",
      type: "datetime",
      group: "registration",
    }),
    defineField({
      name: "reminderMessage",
      title: "Reminder Email Message",
      description:
        "Custom message included in the reminder email. " +
        "Supports bold, italic, links, and bullet lists. " +
        "If blank, a standard reminder is sent.",
      type: "array",
      group: "registration",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [{ title: "Bullet", value: "bullet" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [{ name: "href", type: "url", title: "URL" }],
              },
            ],
          },
        },
      ],
    }),

    // ── Dana ──────────────────────────────────────────────────────────────────
    defineField({
      name: "danaMode",
      title: "Dana Mode",
      description: "Controls how the dana/payment step is presented in the registration form",
      type: "string",
      group: "dana",
      options: {
        list: [
          { title: "None — no dana step", value: "none" },
          { title: "Voluntary — suggested amount, freely editable", value: "voluntary" },
          { title: "Base + Dana — fixed base fee plus voluntary dana on top", value: "base_plus_dana" },
          { title: "Fixed — set price, no dana practice", value: "fixed" },
        ],
        layout: "radio",
      },
      initialValue: "none",
    }),
    defineField({
      name: "suggestedDana",
      title: "Suggested Dana Amount ($)",
      description: "For Voluntary / Base + Dana modes: pre-filled starting amount (registrant can change)",
      type: "number",
      group: "dana",
      hidden: ({ document }) =>
        !["voluntary", "base_plus_dana"].includes(document?.danaMode),
    }),
    defineField({
      name: "danaBaseAmount",
      title: "Base Amount ($)",
      description: "For Base + Dana mode: the required fee before voluntary dana",
      type: "number",
      group: "dana",
      hidden: ({ document }) => document?.danaMode !== "base_plus_dana",
    }),
    defineField({
      name: "danaFixedAmount",
      title: "Fixed Price ($)",
      description: "For Fixed mode: the exact amount registrants will pay",
      type: "number",
      group: "dana",
      hidden: ({ document }) => document?.danaMode !== "fixed",
    }),
    defineField({
      name: "danaMessage",
      title: "Dana Step Message",
      description:
        "Optional message shown on the dana step — explain the practice, context, or intention for this program",
      type: "text",
      group: "dana",
      hidden: ({ document }) => !document?.danaMode || document?.danaMode === "none",
    }),
    defineField({
      name: "danaText",
      title: "Dana Info (Program Page)",
      description: "Short dana/donation note shown on the program detail page",
      type: "string",
      group: "dana",
    }),

    // ── Dashboard ─────────────────────────────────────────────────────────────
    defineField({
      name: "dashboardSpecialAnnouncement",
      title: "Special Announcement",
      description: "Appears in red on the member dashboard for this program",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dashboardEarlyArrivalMessage",
      title: "Early Arrival Message",
      description: "Appears in grey on the member dashboard for this program",
      type: "string",
      group: "dashboard",
    }),
    defineField({
      name: "dayOfWeek",
      title: "Day of the Week",
      description: "Controls which day(s) this program appears on the member dashboard",
      type: "array",
      of: [{ type: "reference", to: [{ type: "weekdays" }] }],
      group: "dashboard",
    }),
    defineField({
      name: "removeFromProgramList",
      title: "Hide from Member Dashboard",
      description: "When checked, this program will not appear on the member dashboard drop-in list",
      type: "boolean",
      initialValue: false,
      group: "dashboard",
    }),

    // ── Visibility ────────────────────────────────────────────────────────────
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      description: "Lower numbers appear first on all listing pages",
      type: "number",
      group: "visibility",
    }),
    defineField({
      name: "hideFromProgramPageList",
      title: "Hide from Programs & Events Page",
      description:
        "When checked, this program will NOT appear on the public Programs & Events page. " +
        "The program's own page is still accessible by direct link.",
      type: "boolean",
      initialValue: false,
      group: "visibility",
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
