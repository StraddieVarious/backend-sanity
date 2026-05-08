import { defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Recommended: 50-60 characters",
      validation: (rule) =>
        rule.max(60).warning("Meta titles over 60 characters may be truncated"),
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Recommended: 120-155 characters",
      validation: (rule) =>
        rule
          .max(155)
          .warning("Meta descriptions over 155 characters may be truncated"),
    },
    {
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description: "Recommended: 1200x630px. Used when sharing on social media",
      options: {
        hotspot: true,
      },
    },
    {
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
  ],
});
