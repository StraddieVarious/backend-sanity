import { defineField, defineType } from "sanity";

export const artworkType = defineType({
  name: "artworkType",
  title: "Artwork Type",
  type: "document",
  description:
    "The categories artworks are grouped by on the gallery. Add or rename a type here and it appears in the site's filters automatically.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Ceramics". Shown as the filter label on the gallery.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      description: "Used in the gallery URL, e.g. /gallery?type=ceramics",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "Optional. Shown above the grid when a visitor filters to this type.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description:
        "Controls where this type sits in the gallery filter. Lower numbers first.",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Gallery order",
      name: "orderAsc",
      by: [
        { field: "order", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
    {
      title: "Title A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      order: "order",
      slug: "slug.current",
    },
    prepare({ title, order, slug }) {
      return {
        title,
        subtitle: [order != null ? `#${order}` : null, slug].filter(Boolean).join("  ·  "),
      };
    },
  },
});
