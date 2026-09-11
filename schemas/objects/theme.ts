import { defineField, defineType } from "sanity";
import { AA, AAA, TEXT, contrast, deriveSunk, fmt, isHex } from "../lib/contrast";

/**
 * Site colours, editable by the gallery.
 *
 * Choose a preset for a safe, pre-checked theme. Choose Custom to set the four
 * colours directly; each is checked against what it sits on, and a colour that
 * would make text unreadable cannot be published. Text colours themselves are
 * fixed, because they carry the site's legibility guarantees.
 */

type Parent = { preset?: string; paper?: string; deep?: string; brand?: string; brandBright?: string };

const customOnly = (value: unknown, parent: Parent | undefined) =>
  parent?.preset !== "custom" ? true : isHex(value) ? null : "Enter a colour as a six digit hex code, e.g. #075a7d";

export const theme = defineType({
  name: "theme",
  title: "Theme",
  type: "object",
  fields: [
    defineField({
      name: "preset",
      title: "Theme",
      type: "string",
      description:
        "Presets are checked for readability already. Choose Custom to set your own colours.",
      options: {
        list: [
          { title: "Bay: blue from the logo (default)", value: "bay" },
          { title: "Eucalypt: deep green", value: "eucalypt" },
          { title: "Ochre: warm earth", value: "ochre" },
          { title: "Custom", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "bay",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "paper",
      title: "Page background",
      type: "string",
      description: "The main background. Must keep body text readable. Default #f7f9fa.",
      hidden: ({ parent }) => parent?.preset !== "custom",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as Parent | undefined;
          const shape = customOnly(value, parent);
          if (shape !== null) return shape;
          const body = contrast(TEXT.ink, value as string);
          const faint = contrast(TEXT.inkFaint, value as string);
          if (body < AAA) return `Body text on this background is ${fmt(body)}. It needs at least ${AAA}:1. Try a lighter colour.`;
          if (faint < AA) return `Small text on this background is ${fmt(faint)}. It needs at least ${AA}:1. Try a lighter colour.`;
          const onMat = contrast(TEXT.inkFaint, deriveSunk(value as string));
          if (onMat < AA) return `Prices on the image mats would be ${fmt(onMat)}. They need at least ${AA}:1. Try a slightly lighter colour.`;
          const bodyOnMat = contrast(TEXT.inkMuted, deriveSunk(value as string));
          if (bodyOnMat < AAA) return `Body text in the footer would be ${fmt(bodyOnMat)}. It needs at least ${AAA}:1. Try a slightly lighter colour.`;
          return true;
        }),
    }),

    defineField({
      name: "brand",
      title: "Brand colour",
      type: "string",
      description:
        "Links, the New label and the open-now dot. Must be readable on the page background. Default #075a7d.",
      hidden: ({ parent }) => parent?.preset !== "custom",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as Parent | undefined;
          const shape = customOnly(value, parent);
          if (shape !== null) return shape;
          if (!isHex(parent?.paper)) return true;
          const onPaper = contrast(value as string, parent!.paper!);
          const labelText = contrast(TEXT.onBrand, value as string);
          if (onPaper < AA) return `On the page background this is ${fmt(onPaper)}. Links need at least ${AA}:1. Try a darker colour.`;
          if (labelText < AA) return `White label text on this colour is ${fmt(labelText)}. It needs at least ${AA}:1. Try a darker colour.`;
          return true;
        }),
    }),

    defineField({
      name: "deep",
      title: "Banner background",
      type: "string",
      description: "The dark band behind the home page banner. Default #101519.",
      hidden: ({ parent }) => parent?.preset !== "custom",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as Parent | undefined;
          const shape = customOnly(value, parent);
          if (shape !== null) return shape;
          const heading = contrast(TEXT.invert, value as string);
          const muted = contrast(TEXT.invertMuted, value as string);
          if (heading < AAA) return `Banner headings are ${fmt(heading)} on this. They need at least ${AAA}:1. Try a darker colour.`;
          if (muted < AA) return `Banner body text is ${fmt(muted)} on this. It needs at least ${AA}:1. Try a darker colour.`;
          return true;
        }),
    }),

    defineField({
      name: "brandBright",
      title: "Banner button colour",
      type: "string",
      description: "The main button on the dark banner. Default #35b0e0.",
      hidden: ({ parent }) => parent?.preset !== "custom",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as Parent | undefined;
          const shape = customOnly(value, parent);
          if (shape !== null) return shape;
          const label = contrast(TEXT.onBright, value as string);
          if (label < AA) return `The button's label is ${fmt(label)} on this colour. It needs at least ${AA}:1. Try a lighter colour.`;
          if (isHex(parent?.deep)) {
            const onDeep = contrast(value as string, parent!.deep!);
            if (onDeep < 3) return `This button is ${fmt(onDeep)} against the banner background and will not stand out. Try a brighter colour.`;
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: { preset: "preset" },
    prepare: ({ preset }) => ({ title: `Theme: ${preset ?? "bay"}` }),
  },
});
