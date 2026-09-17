import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "top", title: "Banner", default: true },
    { name: "sections", title: "Page sections" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      group: "top",
      title: "Banner heading",
      type: "string",
      initialValue: "Welcome",
    }),
    defineField({
      name: "heroSubtitle",
      group: "top",
      title: "Banner text",
      type: "text",
      rows: 2,
      initialValue:
        "Straddievarious Showcases Redlands & Indigenous Artists & Artisans creations & artworks.",
    }),
    defineField({
      name: "heroBackgroundImage",
      group: "top",
      title: "Banner fallback image",
      type: "image",
      options: { hotspot: true },
      description:
        "Only used if the banner has no artwork to show, which would mean the gallery has no artwork on the site at all. Normally leave this alone.",
    }),
    defineField({
      name: "banner",
      group: "top",
      title: "Banner",
      type: "object",
      description: "Buttons and wording on the banner. Choose which artwork it shows below.",
      fields: [
        defineField({ name: "eyebrow", title: "Small label above the title", type: "string", initialValue: "Raby Bay Harbour · Cleveland" }),
        defineField({
          name: "artwork",
          title: "Artwork in the banner",
          type: "reference",
          to: [{ type: "artwork" }],
          description:
            "Choose which work fills the banner. Leave empty and it always shows the most recently added work.",
        }),
        defineField({
          name: "image",
          title: "Use a different picture instead",
          type: "image",
          options: { hotspot: true },
          description:
            "Optional. Overrides the artwork's own picture, for example a photo of the gallery. The caption and link still point at the chosen work.",
        }),
        defineField({ name: "primaryLabel", title: "Main button", type: "string", initialValue: "View the collection" }),
        defineField({ name: "secondaryLabel", title: "Second button", type: "string", initialValue: "Plan your visit" }),
        defineField({ name: "newestLabel", title: "Label on the artwork", type: "string", initialValue: "Just arrived" }),
      ],
    }),
    defineField({
      name: "standing",
      group: "sections",
      title: "Awards and numbers band",
      type: "object",
      description: "The dark band under the banner. The numbers are counted automatically; awards come from the About page.",
      fields: [
        defineField({ name: "show", title: "Show this band", type: "boolean", initialValue: true }),
        defineField({ name: "worksLabel", title: "Label for the number of works", type: "string", initialValue: "Works" }),
        defineField({ name: "artistsLabel", title: "Label for the number of artists", type: "string", initialValue: "Artists" }),
      ],
    }),
    defineField({
      name: "aboutPreview",
      group: "sections",
      title: "About Preview Section",
      type: "object",
      description: "The 'About the Gallery' section shown on the homepage.",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          initialValue: "About the Gallery",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "string",
          initialValue: "Raby Bay Harbour, Cleveland",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 6,
          initialValue: "Step into Straddievarious Gallery and experience the heart of Redlands creativity. Located at Raby Bay Harbourside, the gallery showcases a diverse and ever-changing collection of works by artists and artisans from North Stradbroke Island (Minjerrabah), the Bay Islands, and the mainland Redlands Coast.",
        }),
        defineField({
          name: "image",
          title: "Section Image",
          type: "image",
          options: { hotspot: true },
          description: "Image displayed alongside the about text.",
        }),
        defineField({ name: "hoursHeading", title: "Opening hours label", type: "string", initialValue: "Opening hours" }),
        defineField({ name: "primaryLabel", title: "Main button", type: "string", initialValue: "Plan your visit" }),
        defineField({ name: "secondaryLabel", title: "Second button", type: "string", initialValue: "About the gallery" }),
      ],
    }),
    defineField({
      name: "featuredSection",
      group: "sections",
      title: "Featured Artworks Section",
      type: "object",
      description: "Customise the heading and subtitle for the featured artworks grid.",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          initialValue: "Featured Artworks",
        }),
        defineField({
          name: "subtitle",
          title: "Subtitle",
          type: "string",
          initialValue: "A glimpse into our curated collection",
        }),
        defineField({
          name: "buttonLabel",
          title: "Button",
          type: "string",
          description: "Use {count} where the number of works should appear. It is filled in automatically.",
          initialValue: "All {count} works",
        }),
      ],
    }),
    defineField({
      name: "makersSection",
      group: "sections",
      title: "Artists Section",
      type: "object",
      description: "The row of artists on the home page.",
      fields: [
        defineField({ name: "eyebrow", title: "Small label", type: "string", initialValue: "Represented" }),
        defineField({ name: "heading", title: "Heading", type: "string", initialValue: "The people behind the work" }),
        defineField({ name: "buttonLabel", title: "Button", type: "string", description: "Use {count} where the number of artists should appear. It is filled in automatically.", initialValue: "All {count} artists" }),
        defineField({
          name: "count",
          title: "How many artists to show",
          type: "number",
          description: "Kept to whole rows so no artist is left on a line by themselves.",
          options: { list: [4, 8, 12, 16] },
          initialValue: 8,
        }),
      ],
    }),
    defineField({
      name: "whatsNew",
      group: "sections",
      title: "What's New Section",
      type: "object",
      description: "Feature an artwork on the homepage. Select an artwork and it will automatically pull through the image, title, and artist with a link to the full artwork page.",
      fields: [
        defineField({
          name: "artwork",
          title: "Featured Artwork",
          type: "reference",
          to: [{ type: "artwork" }],
          description: "Select the artwork to feature in the What's New section. The image, title, artist, and details will be pulled automatically.",
        }),
        defineField({
          name: "content",
          title: "Custom Description",
          type: "array",
          of: [{ type: "block" }],
          description: "Optional: Write a custom description. If left empty, the artwork's own description will be used.",
        }),
        defineField({
          name: "image",
          title: "Override Image",
          type: "image",
          options: { hotspot: true },
          description: "Optional: Upload a different image to display instead of the artwork's main image.",
        }),
        defineField({ name: "eyebrow", title: "Small label", type: "string", initialValue: "In the gallery now" }),
        defineField({ name: "buttonLabel", title: "Button", type: "string", initialValue: "View this work" }),
      ],
    }),
    defineField({
      name: "seo",
      group: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO settings for the homepage",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Home Page",
      };
    },
  },
});
