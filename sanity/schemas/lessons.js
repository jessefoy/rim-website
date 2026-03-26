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
      name: "heroImage",
      title: "Hero Image",
      description: "Optional. A full-width editorial image displayed below the lesson title. Landscape or square images work best. If no image is added, the page simply starts with the audio player or content — nothing is missing. Always fill in the Alt Text field below when you upload an image.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          description: "Required if you upload an image. Briefly describe what's in the image for screen readers and search engines. Example: 'A lotus flower floating on still water at dawn.'",
          type: "string",
        }),
      ],
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
      name: "audioFile",
      title: "Audio File",
      description: "Upload the MP3 recording here. Appears when 'Includes Audio?' is turned on.",
      type: "file",
      options: { accept: "audio/mpeg,audio/mp4,audio/wav,audio/*" },
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
      type: "richContent",
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
