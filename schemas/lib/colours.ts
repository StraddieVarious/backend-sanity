/**
 * Site colours: the four the gallery chooses in Sanity, and how readable text
 * is on them.
 *
 * The site uses exactly the colours chosen. Nothing is blocked or swapped.
 * Text colours are fixed, and the gallery's visitors skew older, so each
 * colour is checked against the text that sits on it: body text on the page
 * should clear WCAG AAA, everything else AA. Where a colour falls short, the
 * Studio warns in plain words and offers the nearest shade that passes, which
 * the gallery can apply with one click or ignore.
 *
 * This file exists twice and must stay identical:
 *   backend-sanity/schemas/lib/colours.ts
 *   website-astro/src/lib/colours.ts
 */

export interface Colours {
  background: string;
  accent: string;
  banner: string;
  bannerButton: string;
}

export type ColourRole = keyof Colours;

export const DEFAULT_COLOURS: Colours = {
  background: "#f7f9fa",
  accent: "#075a7d",
  banner: "#101519",
  bannerButton: "#35b0e0",
};

/** Fixed text colours the chosen colours have to keep legible. */
export const TEXT = {
  ink: "#12181c",
  inkMuted: "#4b5053",
  inkFaint: "#686d70",
  invert: "#f2f5f6",
  invertMuted: "#c3ccd1",
  onButton: "#06202b",
  onAccent: "#f2f5f6",
} as const;

const AA = 4.5;
const AAA = 7;

export const isHex = (value: unknown): value is string =>
  typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value.trim());

function channel(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const h = hex.trim().replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => channel(parseInt(h.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colours, 1 to 21. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Blend two colours. t = 0 gives a, t = 1 gives b. */
export function mix(a: string, b: string, t: number): string {
  const pa = a.replace("#", "");
  const pb = b.replace("#", "");
  return (
    "#" +
    [0, 2, 4]
      .map((i) => {
        const va = parseInt(pa.slice(i, i + 2), 16);
        const vb = parseInt(pb.slice(i, i + 2), 16);
        return Math.round(va * (1 - t) + vb * t).toString(16).padStart(2, "0");
      })
      .join("")
  );
}

/**
 * The slightly darker shade behind picture mats and the footer. The default
 * background's shade was chosen by eye, so it is kept exactly; any other
 * background gets one made from it.
 */
export const shadeOf = (background: string): string =>
  background === DEFAULT_COLOURS.background ? "#eceff1" : mix(background, TEXT.ink, 0.04);

interface Check {
  /** Plain-words description of the text that would be hard to read. */
  says: string;
  pass: (c: string, chosen: Colours) => boolean;
}

/** What sits on each colour, and which way to move it to find a readable shade. */
const RULES: Record<ColourRole, { toward: string; checks: Check[] }> = {
  background: {
    toward: "#ffffff",
    checks: [
      { says: "Body text on the page", pass: (c) => contrast(TEXT.ink, c) >= AAA },
      { says: "Small grey text such as opening hours", pass: (c) => contrast(TEXT.inkFaint, c) >= AA },
      { says: "Prices under the artwork pictures", pass: (c) => contrast(TEXT.inkFaint, shadeOf(c)) >= AA },
      { says: "Text in the footer", pass: (c) => contrast(TEXT.inkMuted, shadeOf(c)) >= AAA },
    ],
  },
  accent: {
    toward: "#000000",
    checks: [
      { says: "Links on the page background", pass: (c, p) => contrast(c, p.background) >= AA },
      { says: "The white NEW label", pass: (c) => contrast(TEXT.onAccent, c) >= AA },
    ],
  },
  banner: {
    toward: "#000000",
    checks: [
      { says: "The white banner heading", pass: (c) => contrast(TEXT.invert, c) >= AAA },
      { says: "The light banner text", pass: (c) => contrast(TEXT.invertMuted, c) >= AA },
    ],
  },
  bannerButton: {
    toward: "#ffffff",
    checks: [
      { says: "The dark button label", pass: (c) => contrast(TEXT.onButton, c) >= AA },
      { says: "The button standing out from the banner", pass: (c, p) => contrast(c, p.banner) >= 3 },
    ],
  },
};

export interface ColourCheck {
  /** True when everything on this colour reads clearly. */
  ok: boolean;
  /** What would be hard to read, in plain words. Empty when ok. */
  problems: string[];
  /** The nearest shade of the chosen colour that passes, assuming the colours
      before it take their suggestions too. Equal to it when ok. */
  suggestion: string;
  /** Set when this colour is fine and only fails because of an earlier one:
      fixing that one clears this warning without changing this colour. */
  clearedBy?: ColourRole;
}

/**
 * The colours the site uses, exactly as chosen (a missing or malformed value
 * uses the original), and a readability check for each.
 */
export function resolveColours(chosen?: Partial<Record<ColourRole, string | null>> | null): {
  colours: Colours;
  checks: Record<ColourRole, ColourCheck>;
} {
  const colours = { ...DEFAULT_COLOURS };
  for (const role of Object.keys(colours) as ColourRole[]) {
    const raw = chosen?.[role];
    if (isHex(raw)) colours[role] = raw.trim().toLowerCase();
  }
  /* Checked in this order, so each suggestion can assume the ones before it
     were taken: the accent is judged against a fixed background, the button
     against a fixed banner. Otherwise a button on an unreadable banner is told
     to turn white, which still fails. */
  const order: ColourRole[] = ["background", "accent", "banner", "bannerButton"];
  const dependsOn: Partial<Record<ColourRole, ColourRole>> = { accent: "background", bannerButton: "banner" };
  const fixed = { ...colours };
  const checks = {} as Record<ColourRole, ColourCheck>;
  for (const role of order) {
    const { toward, checks: rules } = RULES[role];
    const failing = (c: string, palette: Colours) => rules.filter((r) => !r.pass(c, palette));
    const problems = failing(colours[role], colours).map((r) => r.says);
    let suggestion = colours[role];
    for (let step = 1; step <= 50 && failing(suggestion, fixed).length; step++) {
      suggestion = mix(colours[role], toward, step / 50);
    }
    fixed[role] = suggestion;
    const clearedBy = problems.length && suggestion === colours[role] ? dependsOn[role] : undefined;
    checks[role] = { ok: problems.length === 0, problems, suggestion, ...(clearedBy ? { clearedBy } : {}) };
  }
  return { colours, checks };
}
