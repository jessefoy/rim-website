import { defineField, defineType } from "sanity";

export default defineType({
  name: "lessonResources",
  title: "Lesson Resources",
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
      name: "resourceFile",
      title: "Resource File",
      type: "file",
      options: {
        accept: ".pdf,.jpg,.jpeg,.png,.mp3,.mp4,.doc,.docx",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "resourceType",
      title: "Resource Type",
      type: "string",
      options: {
        list: [
          { title: "PDF", value: "pdf" },
          { title: "Image", value: "image" },
          { title: "Audio", value: "audio" },
          { title: "Worksheet", value: "worksheet" },
          { title: "Guide", value: "guide" },
          { title: "Other", value: "other" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "resourceType" },
  },
});
