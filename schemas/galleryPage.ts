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
