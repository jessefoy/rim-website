import { defineField, defineType } from "sanity";

export default defineType({
  name: "volunteerPositions",
  title: "Volunteer Positions",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Position Name",
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
      name: "positionDescription",
      title: "Position Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "visibleOnVolunteerListingPage",
      title: "Visible on Volunteer Listing Page?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isOpen",
      title: "Open / Filled",
      description: "Toggle ON = position is open, OFF = position is filled",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "currentVolunteers",
      title: "Current Volunteers",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "teams" }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      isOpen: "isOpen",
    },
    prepare({ title, isOpen }) {
      return {
        title,
        subtitle: isOpen ? "Open" : "Filled",
      };
    },
  },
});
