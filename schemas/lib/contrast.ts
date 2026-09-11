/**
 * WCAG 2.x contrast, used to validate theme colours in the Studio.
 *
 * The gallery's visitors skew older, and the site was rebuilt so every text
 * colour clears AA and the two carrying body copy clear AAA. Letting the owner
 * pick any colour would quietly undo that, so theme fields are checked against
 * the colours they sit on or under before they can be published.
 */

const HEX = /^#([0-9a-f]{6})$/i;

export function isHex(value: unknown): value is string {
  return typeof value === "string" && HEX.test(value.trim());
}

function channel(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const h = hex.trim().replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two hex colours, 1 to 21. */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export const fmt = (ratio: number) => `${ratio.toFixed(2)}:1`;

/** Fixed text colours the theme has to keep legible. Not owner editable. */
export const TEXT = {
  ink: "#12181c",
  inkMuted: "#4b5053",
  inkFaint: "#686d70",
  invert: "#f2f5f6",
  invertMuted: "#c3ccd1",
  onBright: "#06202b",
  onBrand: "#f2f5f6",
} as const;

export const AA = 4.5;
export const AAA = 7;

/** Blend two hex colours. t = 0 gives a, t = 1 gives b. */
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
 * The recessed ground behind image mats, derived from the page background for
 * custom themes. Keep in step with website-astro/src/lib/theme.ts.
 */
export const deriveSunk = (paper: string) => mix(paper, TEXT.ink, 0.04);
