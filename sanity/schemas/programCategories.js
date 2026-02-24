import { defineField, defineType } from "sanity";

export default defineType({
  name: "programCategories",
  title: "Program Categories",
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
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "hideFromProgramsPage",
      title: "Hide from Programs Page",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});
