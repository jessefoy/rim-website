import { defineField, defineType } from "sanity";

export default defineType({
  name: "magazineArticles",
  title: "Magazine Articles",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Article Title — Internal",
      description: "Used for organizing in the CMS (not shown publicly)",
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
      name: "articleTitleDisplayed",
      title: "Article Title — Displayed",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "articleContent",
      title: "Article Content",
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
  ],
  preview: {
    select: { title: "articleTitleDisplayed", subtitle: "name" },
  },
});
