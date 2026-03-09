import { defineField, defineType } from "sanity";

export default defineType({
  name: "programs",
  title: "Programs",
  type: "document",
  groups: [
    { name: "basics",       title: "1 — Basics" },
    { name: "schedule",     title: "2 — When & Where" },
    { name: "registration", title: "3 — Registration" },
    { name: "emails",       title: "4 — Emails" },
    { name: "dana",         title: "5 — Dana" },
    { name: "settings",     title: "6 — Settings" },
  ],
  fields: [
    // ── Step 1: Basics ────────────────────────────────────────────────────────
    // What is this program? Identity, content, and who leads it.

    defineField({
      name: "name",
      title: "Name",
      description:
        "The program's full name as it appears on the website, in emails, and on registration confirmations. " +
        "Use the official name — avoid abbreviations unless they are widely understood.",
      type: "string",
      group: "basics",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description:
        "The URL path for this program — e.g. 'wednesday-drop-in' becomes /programs/wednesday-drop-in. " +
        "Auto-generated from the name. ⚠ Don't change this after the program is live — existing links and bookmarks will break.",
      type: "slug",
      options: { source: "name" },
      group: "basics",
      validation: (Rule) => Rule.required(),
    }),

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
      group: "basics",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description:
        "One or two sentences shown on the programs listing page beneath the name — " +
        "often the first thing someone reads when deciding whether to learn more. " +
        "Capture the spirit and purpose of the program concisely.",
      type: "string",
      group: "basics",
    }),
    defineField({
      name: "largeProgramImage",
      title: "Program Image",
      description:
        "Hero image displayed at the top of the program page. " +
        "Use a high-quality landscape photo (at least 1200px wide). " +
        "If left blank, the page shows a plain colored header.",
      type: "image",
      options: { hotspot: true },
      group: "basics",
    }),
    defineField({
      name: "programDescription",
      title: "Program Description",
      description:
        "The main body of the program page. Describe what the program is, what participants can expect, " +
        "and why it exists — write for someone who knows nothing about RIM. " +
        "Supports headings, pull quotes, callout boxes, and other rich content.",
      type: "richContent",
      group: "basics",
    }),
    defineField({
      name: "quote",
      title: "Pull Quote",
      description:
        "An inspirational quote shown prominently on the program page — a teaching, a line of poetry, " +
        "or a phrase that captures the essence of this practice. Displayed in large italic text.",
      type: "text",
      group: "basics",
    }),
    defineField({
      name: "quoteSource",
      title: "Quote Source",
      description:
        "Attribution for the pull quote — teacher's name, book title, or tradition. " +
        "E.g. 'Ajahn Chah' or 'Bhagavad Gita'.",
      type: "string",
      group: "basics",
    }),
    defineField({
      name: "specialNotes",
      title: "Special Notes",
      description:
        "Logistical notices or temporary information that don't belong in the main description — " +
        "e.g. 'This program will be held on Zoom during building renovations.' " +
        "Shown below the description on the program page. Clear it once it's no longer relevant.",
      type: "array",
      group: "basics",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "teacherFacilitators",
      title: "Teacher / Facilitator(s)",
      description:
        "The teacher(s) or facilitator(s) who lead this program. Their name, photo, and bio will appear on the program page. " +
        "Select from existing team profiles — if someone is missing, add them in the Teams section first.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teams" }] }],
      group: "basics",
    }),

    // ── Step 2: When & Where ──────────────────────────────────────────────────
    // Date, time, recurrence, and where it meets (in-person or virtual).

    defineField({
      name: "dateText",
      title: "Date & Time Label",
      description: 'Display text shown on the program page — e.g. "Every Wednesday, 6–7:30pm" or "June 7–9 · 9am–5pm"',
      type: "string",
      group: "schedule",
    }),
    defineField({
      name: "startDatetime",
      title: "Start Date & Time",
      description:
        "The date and time the program begins. This field drives two things: " +
        "(1) Add-to-Calendar links on the program page, and " +
        "(2) reminder email scheduling (reminder sends at 9am Central on the date you set in Step 4). " +
        "For virtual and hybrid programs, set this before creating a Google Meet in the Registrar Area — " +
        "it determines the room booking time slot. " +
        "Leave blank only for open-ended or ongoing drop-in programs with no fixed start date.",
      type: "datetime",
      group: "schedule",
    }),
    defineField({
      name: "endDatetime",
      title: "End Date & Time",
      description:
        "Optional. Defaults to 1 hour after start if left blank.",
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
      name: "programFormat",
      title: "Format",
      description:
        "How does this program meet? " +
        "In-person — everyone attends at RIM. " +
        "Virtual — the session is online only via Google Meet. " +
        "Hybrid — some participants are at RIM, others join via Google Meet. " +
        "Virtual and Hybrid programs show a Google Meet section in the Registrar Area where a Meet link can be created and managed.",
      type: "string",
      group: "schedule",
      options: {
        list: [
          { title: "In-person", value: "in-person" },
          { title: "Virtual",   value: "virtual" },
          { title: "Hybrid",    value: "hybrid" },
        ],
        layout: "radio",
      },
      initialValue: "in-person",
    }),

    // Venue — shown for in-person and hybrid; drives location display on program page + emails
    defineField({
      name: "venue",
      title: "Venue",
      description:
        "Where does this program meet in person? " +
        "'At RIM' automatically fills in the address and Google Maps link — no extra steps. " +
        "Choose 'Other location' for retreats or off-site events, then fill in the custom location fields below.",
      type: "string",
      group: "schedule",
      options: {
        list: [
          { title: "At RIM (16905 W. Bluemound Rd., Brookfield)", value: "at-rim" },
          { title: "Other location", value: "other" },
        ],
        layout: "radio",
      },
      initialValue: "at-rim",
      hidden: ({ document }) => document?.programFormat === "virtual",
    }),

    // Custom location fields — only shown for "other" venue
    defineField({
      name: "locationText",
      title: "Location Name",
      description:
        "The venue name and/or address for off-site programs — shown on the program page and in reminder emails. " +
        "E.g. 'Forest Refuge, 99 Woodland St., Barre, MA'. " +
        "Only shown when Venue is set to 'Other location'.",
      type: "string",
      group: "schedule",
      hidden: ({ document }) => document?.programFormat === "virtual" || document?.venue !== "other",
    }),
    defineField({
      name: "locationLink",
      title: "Location Link",
      description:
        "A Google Maps link or venue website URL. When set, the location name on the program page becomes a clickable link. " +
        "Paste the full URL including https://. Only shown when Venue is set to 'Other location'.",
      type: "url",
      group: "schedule",
      hidden: ({ document }) => document?.programFormat === "virtual" || document?.venue !== "other",
    }),

    // Meet fields — shown for virtual and hybrid
    defineField({
      name: "zoomLink",
      title: "Meeting Link",
      description:
        "The URL members use to join the online session. " +
        "Use the Create Google Meet button in the Registrar Area to generate this automatically. " +
        "Or paste a full URL here manually if you prefer to use a different link.",
      type: "url",
      group: "schedule",
      hidden: ({ document }) => !document?.programFormat || document?.programFormat === "in-person",
    }),
    defineField({
      name: "meetHostAccount",
      title: "Meet Host Account",
      description:
        "Set automatically when a Google Meet is created — shows which shared Google account (e.g. meet1@rootedinmindfulness.org) was assigned to host this session. " +
        "The volunteer host signs into this Google account before the session starts to act as the meeting host. " +
        "Read-only; managed by the system.",
      type: "string",
      readOnly: true,
      group: "schedule",
      hidden: ({ document }) => !document?.programFormat || document?.programFormat === "in-person",
    }),
    // ── Step 3: Registration ──────────────────────────────────────────────────
    // Who can sign up, how many, and what questions to ask them.

    defineField({
      name: "registrationEnabled",
      title: "Enable Registration",
      description:
        "Turns on the built-in registration form for this program. " +
        "When enabled, a 'Register' button appears on the program page and registrants are tracked in the Volunteer Area. " +
        "Leave off for drop-in programs, public events, or programs using an external registration link.",
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
      description:
        "The registration form closes automatically at this date and time — useful for courses that require preparation, " +
        "ordering materials, or confirming attendance in advance. " +
        "After this point, the 'Register' button is hidden and late registrations require staff assistance. " +
        "Leave blank for programs with open registration.",
      type: "datetime",
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
      name: "linkedCourses",
      title: "Linked Courses (Online Materials)",
      description:
        "Members who register for this program automatically get access to all listed courses.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "courses" }] }],
      group: "registration",
    }),

    // ── Step 4: Emails ────────────────────────────────────────────────────────
    // What registrants receive after signing up and before the program.

    defineField({
      name: "confirmationMessage",
      title: "Confirmation Email Message",
      description:
        "Custom message included in the registration confirmation email. " +
        "Supports bold, italic, links, and bullet lists. " +
        "If blank, no extra message is added.",
      type: "array",
      group: "emails",
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
      description:
        "The system sends a reminder email to all active registrants at 9:00 AM Central on this date. " +
        "Set it 1–3 days before the program start — enough notice to prepare, not so early it's forgotten. " +
        "⚠ For virtual programs: make sure the Meeting Link (Step 2) is set before this date — " +
        "the reminder email includes the link and registrants use it to join.",
      type: "datetime",
      group: "emails",
    }),
    defineField({
      name: "reminderMessage",
      title: "Reminder Email Message",
      description:
        "Custom message included in the reminder email. " +
        "Supports bold, italic, links, and bullet lists. " +
        "If blank, a standard reminder is sent.",
      type: "array",
      group: "emails",
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

    // ── Step 5: Dana ──────────────────────────────────────────────────────────
    // How dana or payment is handled for this program.

    defineField({
      name: "danaMode",
      title: "Dana Mode",
      description:
        "Controls how the dana/payment step works in the registration form. " +
        "None — no payment collected (use for free drop-ins or programs where dana is collected in person). " +
        "Voluntary — registrant chooses their own amount, starting from a suggested value (good for ongoing classes). " +
        "Base + Dana — a required base fee plus optional additional dana (retreats, multi-session courses). " +
        "Fixed — a set price with no flexibility (workshops with hard costs).",
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
      description:
        "A short note about dana shown on the public program page — below the registration button, visible to everyone. " +
        "Use it to set the tone and explain the practice. " +
        "E.g. 'This program is offered on a dana basis — pay what you can.' or 'A $20 registration fee applies; additional dana is welcome.'",
      type: "string",
      group: "dana",
    }),

    // ── Step 6: Settings ──────────────────────────────────────────────────────
    // How this program appears on the member dashboard and public listings.

    defineField({
      name: "dayOfWeek",
      title: "Day of the Week",
      description:
        "Controls which day-column(s) this program appears under on the member dashboard. " +
        "The dashboard groups programs by day so members can see what's happening on any given day of the week. " +
        "For a program that always meets Wednesdays, select Wednesday. " +
        "For a program that varies or has no fixed day, leave blank — it won't appear in any day column.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "weekdays" }] }],
      group: "settings",
    }),
    defineField({
      name: "dashboardSpecialAnnouncement",
      title: "Special Announcement",
      description:
        "Displayed in bold red on the member dashboard, directly on this program's card — visible to all logged-in members. " +
        "Use only for important, time-sensitive notices: 'Cancelled this week', 'Location change — see email', 'No session on July 4th'. " +
        "Keep it short (one sentence). Clear it as soon as it's no longer relevant so it doesn't lose its urgency.",
      type: "string",
      group: "settings",
    }),
    defineField({
      name: "dashboardEarlyArrivalMessage",
      title: "Early Arrival Message",
      description:
        "A quiet, standing note shown in muted text on the member dashboard card — typically about arrival or setup. " +
        "Use for stable, recurring guidance that applies week to week: 'Doors open at 6:45pm for settling in' or 'Arrive 5 minutes early to find a seat.' " +
        "This is not for urgent announcements — use Special Announcement (above) for those.",
      type: "string",
      group: "settings",
    }),
    defineField({
      name: "removeFromProgramList",
      title: "Hide from Member Dashboard",
      description: "When checked, this program will not appear on the member dashboard drop-in list",
      type: "boolean",
      initialValue: false,
      group: "settings",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      description: "Lower numbers appear first on all listing pages",
      type: "number",
      group: "settings",
    }),
    defineField({
      name: "hideFromProgramPageList",
      title: "Hide from Programs & Events Page",
      description:
        "When checked, this program will NOT appear on the public Programs & Events page. " +
        "The program's own page is still accessible by direct link.",
      type: "boolean",
      initialValue: false,
      group: "settings",
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
