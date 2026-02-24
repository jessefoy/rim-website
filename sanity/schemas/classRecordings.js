import { defineField, defineType } from "sanity";

export default defineType({
  name: "classRecordings",
  title: "Class Recordings",
  type: "document",
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
    defineField({
      name: "dateRecorded",
      title: "Date Recorded",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "numberInSeries",
      title: "Number in Series",
      type: "number",
    }),
    defineField({
      name: "audioEmbedCode",
      title: "Audio Embed Code",
      description: "Captivate podcast embed code",
      type: "text",
    }),
    defineField({
      name: "videoLink",
      title: "Video Link",
      description: "YouTube or Vimeo URL",
      type: "url",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "reference", to: [{ type: "classRecordingTopics" }] }],
    }),
    defineField({
      name: "teachers",
      title: "Teachers",
      type: "array",
      of: [{ type: "reference", to: [{ type: "teams" }] }],
    }),
    defineField({
      name: "associatedProgram",
      title: "Associated Program",
      type: "reference",
      to: [{ type: "programs" }],
    }),
  ],
  orderings: [
    {
      title: "Date Recorded (Newest First)",
      name: "dateDesc",
      by: [{ field: "dateRecorded", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      date: "dateRecorded",
    },
    prepare({ title, date }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : "",
      };
    },
  },
});
