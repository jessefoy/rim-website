import { defineField, defineType } from "sanity";

/**
 * richContent — shared rich text array type
 *
 * Used by: lessonContent (lessons), programDescription (programs)
 * Any future page type that needs the same editorial toolkit can
 * reference `type: "richContent"` instead of duplicating this list.
 *
 * Block names (stored as _type in JSON) are permanent — do NOT rename
 * them once content exists. Display titles can be changed freely.
 */
export default defineType({
  name: "richContent",
  title: "Rich Content",
  type: "array",
  of: [
    // ─── Standard prose block ───────────────────────────────────────────
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

    // ─── Inline image ────────────────────────────────────────────────────
    { type: "image", options: { hotspot: true } },

    // ─── Practice Suggestion ─────────────────────────────────────────────
    // name: "practiceCallout" — DO NOT RENAME (stored in DB)
    {
      type: "object",
      name: "practiceCallout",
      title: "Practice Suggestion",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          description: "e.g. 'Practice Suggestion' or 'Try This'",
          type: "string",
          initialValue: "Practice Suggestion",
        }),
        defineField({
          name: "content",
          title: "Content",
          description:
            "The practice instructions. Supports bold, italic, and bullet or numbered lists.",
          type: "array",
          of: [
            {
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [
                { title: "Bullet", value: "bullet" },
                { title: "Numbered", value: "number" },
              ],
              marks: {
                decorators: [
                  { title: "Bold", value: "strong" },
                  { title: "Italic", value: "em" },
                ],
              },
            },
          ],
        }),
      ],
      preview: {
        select: { title: "title" },
        prepare({ title }) {
          return { title: `📦 ${title || "Practice Suggestion"}` };
        },
      },
    },

    // ─── Quote (verse) ────────────────────────────────────────────────────
    // name: "verseQuote" — DO NOT RENAME (stored in DB)
    // Renders: centered, ~ decoration above/below, italic Baskerville
    {
      type: "object",
      name: "verseQuote",
      title: "Quote (verse)",
      fields: [
        defineField({
          name: "quote",
          title: "Quote",
          description:
            "A short attributed quote from a teacher, text, or the tradition — for moments of pause and reflection. Keep to 1–3 lines. Displayed centered with a decorative ~ above and below. Do not add quotation marks.",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "attribution",
          title: "Attribution",
          description:
            "Optional. Who said it — e.g. 'Thich Nhat Hanh' or 'The Dhammapada'",
          type: "string",
        }),
      ],
      preview: {
        select: { title: "quote", subtitle: "attribution" },
        prepare({ title, subtitle }) {
          return { title: `✦ ${title}`, subtitle };
        },
      },
    },

    // ─── Quote (box) ──────────────────────────────────────────────────────
    // name: "bodyQuote" — DO NOT RENAME (stored in DB)
    // Renders: warm box, clearly set apart from body prose
    {
      type: "object",
      name: "bodyQuote",
      title: "Quote (box)",
      fields: [
        defineField({
          name: "quote",
          title: "Quote",
          description:
            "A longer attributed quote from an external source — a teacher, book, or text. Displayed in a warm box, clearly set apart from the body. Use when citing a specific source inline. Do not add quotation marks.",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "attribution",
          title: "Attribution",
          description:
            "Optional. Who said it — e.g. 'Thich Nhat Hanh' or 'The Buddha'",
          type: "string",
        }),
      ],
      preview: {
        select: { title: "quote", subtitle: "attribution" },
        prepare({ title, subtitle }) {
          return { title: `❝ ${title}`, subtitle };
        },
      },
    },

    // ─── Callout Text ─────────────────────────────────────────────────────
    // name: "calloutText" — DO NOT RENAME (stored in DB)
    // Renders: slightly larger, extends left of body column
    {
      type: "object",
      name: "calloutText",
      title: "Callout Text",
      fields: [
        defineField({
          name: "text",
          title: "Text",
          description:
            "A key insight or phrase from the content itself — not a quote from someone else. Displayed slightly larger and wider than body text. Use sparingly.",
          type: "text",
          rows: 3,
        }),
      ],
      preview: {
        select: { title: "text" },
        prepare({ title }) {
          return { title: `◆ ${title}` };
        },
      },
    },
  ],
});
