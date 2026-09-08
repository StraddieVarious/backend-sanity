import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "About Us",
      description: "Main heading for the about page",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Learn about our gallery and mission",
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
      name: "mainContent",
      title: "Main Content",
      type: "array",
      of: [{ type: "block" }],
      description: "Main content for the about page",
    }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
      description: "Images showcasing the gallery space",
    }),
    defineField({
      name: "interiorImages",
      title: "Gallery Interior Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "e.g. 'Main gallery floor', 'Indigenous art section'",
            },
          ],
        },
      ],
      description: "Upload photos of the gallery interior to give visitors a sense of the space. These appear in the 'Inside the Gallery' section.",
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "missionStatement",
      title: "Mission Statement",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          initialValue: "Our Mission",
        }),
        defineField({
          name: "content",
          title: "Content",
          type: "array",
          of: [{ type: "block" }],
        }),
      ],
    }),
    defineField({
      name: "featuredArtwork",
      title: "Featured Artwork",
      type: "object",
      description: "Showcase a specific artwork at the top of the about page.",
      fields: [
        defineField({
          name: "artwork",
          title: "Artwork",
          type: "reference",
          to: [{ type: "artwork" }],
          description: "Select an artwork to feature. The image, title, and artist will be pulled automatically.",
        }),
        defineField({
          name: "description",
          title: "Custom Description",
          type: "text",
          rows: 4,
          description: "Optional: Write a custom description. If left empty, the artwork's own description will be used.",
        }),
      ],
    }),
    defineField({
      name: "awards",
      title: "Awards",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Award Title",
              type: "string",
              description: "e.g. 'Tourism Award', 'Creative Industries Award'",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
              description: "e.g. 'Redlands Coast Business Excellence Awards 2023'",
            }),
            defineField({
              name: "year",
              title: "Year",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        },
      ],
      description: "Awards won by the gallery.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO settings for the about page",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "About Page",
      };
    },
  },
});
