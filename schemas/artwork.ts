import { defineField, defineType } from "sanity";

export const artwork = defineType({
  name: "artwork",
  title: "Artwork",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
    }),
    defineField({
      name: "artist",
      title: "Artist",
      type: "reference",
      to: [{ type: "artist" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.custom((value, context) => {
        const doc = context.document as { hidden?: boolean } | undefined;
        if (!doc?.hidden && !value) return "Image is required for visible artworks";
        return true;
      }),
    }),
    defineField({
      name: "additionalImages",
      title: "Additional Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      description: "Additional views, detail shots, or alternative angles of the artwork",
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      description: 'e.g. "70cm x 80cm"',
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
      description: 'e.g. "Acrylic on Canvas"',
    }),
    defineField({
      name: "price",
      title: "Price ($)",
      type: "number",
    }),
    defineField({
      name: "sold",
      title: "Sold",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
      description: "Show this artwork in the featured section on the homepage",
    }),
    defineField({
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      initialValue: false,
      description: "Check to completely hide this artwork from the website",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO settings for this artwork's detail page",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "artist.name",
      media: "image",
    },
  },
});
