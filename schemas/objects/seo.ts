import { defineType } from "sanity";

/**
 * Search and sharing fields, used on every page, artwork and artist.
 *
 * What is written here is what the site outputs, exactly: the website reads
 * these before its own defaults. Empty fields fall back to generated values,
 * which is the right choice for artworks and artists, whose titles follow the
 * artwork and artist names. The page documents hold their live values.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      title: "Title in Google",
      type: "string",
      description:
        "Used exactly as written for the browser tab and the blue link in Google. Keep art gallery, Cleveland or Redlands in page titles. Leave empty on artworks and artists to use the artwork or artist name automatically.",
      validation: (rule) =>
        rule
          .max(60)
          .warning("Over 60 characters, Google may cut this off in results. That changes how it looks, not how it ranks."),
    },
    {
      name: "metaDescription",
      title: "Description in Google",
      type: "text",
      rows: 3,
      description:
        "The text under the link in Google results. Leave empty on artworks and artists to build it from the artwork's details.",
      validation: (rule) =>
        rule.max(160).warning("Over 160 characters, Google will cut this off in results."),
    },
    {
      name: "ogImage",
      title: "Picture when shared",
      type: "image",
      description:
        "Shown when this page is shared on Facebook, Messenger and similar. 1200 x 630 works best. Leave empty to use the gallery's default picture.",
      options: {
        hotspot: true,
      },
    },
  ],
});
