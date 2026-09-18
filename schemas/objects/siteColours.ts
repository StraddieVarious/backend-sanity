import { defineField, defineType } from "sanity";
import { ColourInput } from "../../components/ColourInput";
import { ColoursInput } from "../../components/ColoursInput";
import { ROLE_LABELS } from "../../components/colourRoles";
import { isHex, resolveColours, type ColourRole } from "../lib/colours";

/**
 * A readability note on the field itself. Always a warning, never an error:
 * any colour can be published.
 */
const readable = (role: ColourRole) => (rule: import("sanity").StringRule) =>
  rule
    .custom((value, context) => {
      if (value !== undefined && !isHex(value)) return "This isn't a colour code, so the original colour is used.";
      const check = resolveColours(context.parent as Partial<Record<ColourRole, string>>).checks[role];
      return check.ok ? true : `May be hard to read: ${check.problems.join(", ").toLowerCase()}.`;
    })
    .warning();

const colourField = (role: ColourRole, description: string) =>
  defineField({
    name: role,
    title: ROLE_LABELS[role],
    description,
    type: "string",
    components: { input: ColourInput },
    validation: readable(role),
  });

/** The site's four colours, each chosen with a picker. */
export const siteColours = defineType({
  name: "siteColours",
  title: "Colours",
  type: "object",
  components: { input: ColoursInput },
  fields: [
    colourField(
      "background",
      "Behind everything on every page. The slightly darker shade behind picture mats and the footer is made from it.",
    ),
    colourField(
      "accent",
      "The NEW label on artworks, the open-now dot, links when you point at them, and the gallery filters you have selected.",
    ),
    colourField(
      "banner",
      "The big banner at the top of the home page, and the awards and numbers strip under it. Its text is always white.",
    ),
    colourField("bannerButton", "The 'View the collection' button on the home page banner. Its text is always dark."),
  ],
});
