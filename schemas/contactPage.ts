import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Contact Us",
      description: "Main heading for the contact page",
    }),
    defineField({
      name: "eyebrow",
      title: "Small label above the title",
      type: "string",
      initialValue: "Raby Bay Harbour · Cleveland",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Please use the form below to get in touch",
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
      name: "formHeading",
      title: "Contact Form Heading",
      type: "string",
      initialValue: "Send us a message",
      description: "Heading above the contact form",
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "text",
      rows: 6,
      description: 'Enter opening hours (one per line, format: "Day HH:MM-HH:MM")',
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (rule) =>
        rule.custom((email: string | undefined) => {
          if (!email) return true;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email) || "Please enter a valid email address";
        }),
    }),
    defineField({
      name: "address",
      title: "Physical Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps Embed URL",
      type: "url",
      description:
        "Google Maps embed URL (get from Google Maps → Share → Embed a map)",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO settings for the contact page",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Contact Page",
      };
    },
  },
});
