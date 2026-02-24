import { defineField, defineType } from "sanity";

export default defineType({
  name: "courses",
  title: "Courses",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Course Title",
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
      name: "subheading",
      title: "Subheading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainContentDescription",
      title: "Main Content / Description",
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
      name: "lessons",
      title: "Lessons",
      description: "Ordered list of lessons in this course",
      type: "array",
      of: [{ type: "reference", to: [{ type: "lessons" }] }],
    }),
    defineField({
      name: "hideFromMemberProfilePage",
      title: "Hide From Member Profile Page",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "subheading" },
  },
});
