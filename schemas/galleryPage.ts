import { defineField, defineType } from "sanity";

export const galleryPage = defineType({
  name: "galleryPage",
  title: "Gallery Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Gallery",
      description: "Main heading for the gallery page",
    }),
    defineField({
      name: "eyebrow",
      title: "Small label above the title",
      type: "string",
      initialValue: "The Collection",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Please come and see the beautiful artwork in our gallery",
      description: "Subtitle text below the hero title",
    }),
    defineField({
      name: "heroBackgroundImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional: Upload a custom hero background image. If not set, uses the default teal gradient.",
    }),
    defineField({
      name: "introText",
      title: "Introduction Text",
      type: "array",
      of: [{ type: "block" }],
      description: "Optional introduction text displayed above the gallery grid",
    }),
    defineField({
      name: "ctaSection",
      title: "Call to Action Section",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Small label", type: "string", initialValue: "Enquiries" }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          initialValue: "Interested in a piece?",
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "text",
          rows: 2,
          initialValue:
            "Visit us at Raby Bay Harbour or contact us for more information about any artwork in our collection.",
        }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
          initialValue: "Get in Touch",
        }),
      ],
    }),
    defineField({
      name: "artworkPage",
      title: "Artwork page buttons",
      type: "object",
      description: "Buttons shown beside the price on every artwork's own page.",
      fields: [
        defineField({ name: "enquireLabel", title: "Enquire button", type: "string", initialValue: "Enquire about this work" }),
        defineField({ name: "callLabel", title: "Call button", type: "string", initialValue: "Call the gallery" }),
        defineField({ name: "soldLabel", title: "Button on a sold work", type: "string", initialValue: "See available work" }),
        defineField({ name: "moreLabel", title: "Link to the artist's other work", type: "string", initialValue: "All work" }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO settings for the gallery page",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Gallery Page",
      };
    },
  },
});
