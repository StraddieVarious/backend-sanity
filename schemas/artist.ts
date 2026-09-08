import { defineField, defineType } from "sanity";
import { slugOptions } from "./lib/slugify";

export const artist = defineType({
  name: "artist",
  title: "Artist",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: slugOptions("name"),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      title: "Bio PDF",
      type: "file",
      options: {
        accept: ".pdf,.docx",
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "isIndigenous",
      title: "Indigenous Artist",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      initialValue: false,
      description: "Check to completely hide this artist and their artworks from the website",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO settings for this artist's profile page",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
