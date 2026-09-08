import { defineField, defineType } from "sanity";

export const artistsPage = defineType({
  name: "artistsPage",
  title: "Artists Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Meet Our Artists",
      description: "Main heading for the artists page",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Discover the talented creators behind the artwork",
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
      name: "indigenousSection",
      title: "Indigenous Artists Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Section Heading",
          type: "string",
          initialValue: "Indigenous Artists",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 4,
          initialValue:
            "Straddievarious Gallery proudly supports and showcases local Indigenous artists, including works from Quandamooka Country. We are honored to represent artists with heritage from Yuggera, Wulli Wulli, Iman, Yarowair, and Gungarri peoples.",
        }),
      ],
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
          initialValue: "Interested in exhibiting with us?",
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "text",
          rows: 2,
          initialValue:
            "We are always looking for talented local artists and artisans from North Stradbroke Island, the Bay Islands, and the Redlands Coast area.",
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
      description: "SEO settings for the artists page",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Artists Page",
      };
    },
  },
});
