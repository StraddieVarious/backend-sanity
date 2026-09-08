/**
 * Slug rule for the whole Studio: lowercase, words joined by single hyphens,
 * nothing else.
 *
 * Sanity's default slugifier keeps whatever case and spacing it is given, so a
 * title typed straight into the field produced slugs like "Aussie Outlook" —
 * which serve as /gallery/Aussie%20Outlook/ and land in sitemap.xml as an
 * invalid <loc> containing a raw space.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    // strip combining accents so "Véronique" becomes "veronique"
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    // possessives and contractions close up rather than splitting the word
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
    .replace(/-+$/g, "");
}

/** Drop-in `options` for a slug field. */
export const slugOptions = (source: string) => ({
  source,
  maxLength: 96,
  slugify,
});
