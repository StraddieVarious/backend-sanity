import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "top", title: "Top of the page", default: true },
    { name: "sections", title: "Contact details" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      group: "top",
      title: "Page heading",
      type: "string",
      initialValue: "Contact Us",
      description: "Main heading for the contact page",
    }),
    defineField({
      name: "eyebrow",
      group: "top",
      title: "Small label above the title",
      type: "string",
      initialValue: "Raby Bay Harbour · Cleveland",
    }),
    defineField({
      name: "heroSubtitle",
      group: "top",
      title: "Intro text",
      type: "text",
      rows: 2,
      initialValue: "Please use the form below to get in touch",
      description: "Subtitle text below the hero title",
    }),
    defineField({
      name: "heroBackgroundImage",
      group: "top",
      title: "Background picture",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional: Upload a custom hero background image. If not set, uses the default teal gradient.",
    }),
    defineField({
      name: "formHeading",
      group: "sections",
      title: "Contact Form Heading",
      type: "string",
      initialValue: "Send us a message",
      description: "Heading above the contact form",
    }),
    defineField({
      name: "openingHours",
      group: "sections",
      title: "Opening Hours",
      type: "text",
      rows: 6,
      description: 'Enter opening hours (one per line, format: "Day HH:MM-HH:MM")',
    }),
    defineField({
      name: "phone",
      group: "sections",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "email",
      group: "sections",
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
      group: "sections",
      title: "Physical Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "googleMapsUrl",
      group: "sections",
      title: "Google Maps Embed URL",
      type: "url",
      description:
        "Google Maps embed URL (get from Google Maps → Share → Embed a map)",
    }),
    defineField({
      name: "seo",
      group: "seo",
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
