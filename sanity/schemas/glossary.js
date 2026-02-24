import { defineField, defineType } from "sanity";

export default defineType({
  name: "glossary",
  title: "Glossary",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "English Name",
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
      name: "pali",
      title: "Pali",
      type: "string",
    }),
    defineField({
      name: "sanskrit",
      title: "Sanskrit",
      type: "string",
    }),
    defineField({
      name: "synonyms",
      title: "Synonyms",
      description: "Comma-separated English synonyms",
      type: "string",
    }),
  ],
  orderings: [
    {
      title: "English Name A–Z",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "pali" },
  },
});
