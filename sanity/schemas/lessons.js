import { defineField, defineType } from "sanity";

export default defineType({
  name: "lessons",
  title: "Lessons",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Lesson Title — Internal",
      description: "Used for organizing in the CMS (slug basis)",
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
    defineField({
      name: "lessonTitleDisplayed",
      title: "Lesson Title — Displayed",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isSectionTitle",
      title: "Section Title?",
      description: "If ON, this item is treated as a section header within a course",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "includesAudio",
      title: "Includes Audio?",
      description: "If ON, shows audio player instead of quote",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "podcastId",
      title: "Podcast ID",
      description: "Captivate podcast episode ID",
      type: "string",
      hidden: ({ document }) => !document?.includesAudio,
    }),
    defineField({
      name: "videoLessonLink",
      title: "Video Lesson Link",
      description: "YouTube or Vimeo URL",
      type: "url",
    }),
    defineField({
      name: "headerQuote",
      title: "Header Quote",
      description: "Shown when there is no audio",
      type: "text",
      hidden: ({ document }) => document?.includesAudio,
    }),
    defineField({
      name: "quoteSource",
      title: "Quote Source",
      type: "string",
      hidden: ({ document }) => document?.includesAudio,
    }),
    defineField({
      name: "lessonContent",
      title: "Lesson Content",
      type: "array",
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
      name: "teachers",
      title: "Teachers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teams" }] }],
    }),
    defineField({
      name: "downloadableResources",
      title: "Downloadable Resources",
      type: "array",
      of: [{ type: "reference", to: [{ type: "lessonResources" }] }],
    }),
  ],
  preview: {
    select: { title: "lessonTitleDisplayed", subtitle: "name" },
  },
});
