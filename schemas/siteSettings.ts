import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      description: "Used as a fallback in meta titles",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default Open Graph Image",
      type: "image",
      description: "Fallback image for social media sharing (1200x630px recommended)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook URL",
          type: "url",
        }),
        defineField({
          name: "instagram",
          title: "Instagram URL",
          type: "url",
        }),
      ],
    }),
    defineField({
      name: "structuredData",
      title: "Local SEO / Structured Data",
      type: "object",
      description: "Used for Google structured data (rich results & local search)",
      fields: [
        defineField({
          name: "description",
          title: "Business Description",
          type: "text",
          rows: 3,
          description:
            "Short description for search engines (include key phrases like 'Cleveland art gallery')",
        }),
        defineField({
          name: "streetAddress",
          title: "Street Address",
          type: "string",
        }),
        defineField({
          name: "locality",
          title: "City / Suburb",
          type: "string",
          description: "e.g. Cleveland",
        }),
        defineField({
          name: "region",
          title: "State",
          type: "string",
          description: "e.g. QLD",
        }),
        defineField({
          name: "postalCode",
          title: "Postal Code",
          type: "string",
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
        }),
        defineField({
          name: "email",
          title: "Email",
          type: "string",
        }),
        defineField({
          name: "openingHours",
          title: "Opening Hours",
          type: "array",
          of: [{ type: "string" }],
          description:
            "Each entry in schema.org format, e.g. 'Mo-Fr 09:00-17:00', 'Sa 09:00-15:00'",
        }),
        defineField({
          name: "latitude",
          title: "Latitude",
          type: "number",
        }),
        defineField({
          name: "longitude",
          title: "Longitude",
          type: "number",
        }),
      ],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        defineField({
          name: "description",
          title: "Footer Description",
          type: "text",
          rows: 3,
          description: "Short description shown below the logo. Include SEO keywords naturally.",
        }),
        defineField({
          name: "showAcknowledgment",
          title: "Show Acknowledgment of Country",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "acknowledgment",
          title: "Acknowledgment of Country",
          type: "text",
          rows: 3,
          description: "Displayed above the copyright line in the footer",
        }),
        defineField({
          name: "designCredit",
          title: "Design Credit Text",
          type: "string",
          description: 'e.g. "Designed for speed by"',
        }),
        defineField({
          name: "designCreditName",
          title: "Design Credit Name",
          type: "string",
          description: 'e.g. "Spherify Pty Ltd"',
        }),
        defineField({
          name: "designCreditUrl",
          title: "Design Credit URL",
          type: "url",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
      };
    },
  },
});
