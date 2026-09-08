# Artwork type migration

Seeds the `artworkType` documents and backfills every artwork with one. Also
fixes the five artworks that have no slug — the reason the gallery was rendering
empty.

## Why it has to be run

`slug` is now required on `artwork`, and five published artworks have none:
Linda, Woman In Red, Enchanted Flight, Mangrove Jar, King of the Bush. The site
filters them out so they cannot take a page down, which means they are invisible
until this runs.

`artworkType` is a soft requirement (a Studio warning, not a publish blocker) so
that editing still works before the backfill. Once this has run and every piece
has a type, you can promote it to a hard requirement in
`schemas/artwork.ts` by changing:

```ts
validation: (rule) =>
  rule.required().warning("Set a type so this piece can be filtered on the gallery"),
```

to `validation: (rule) => rule.required(),`.

## Running it

You need a token with **write** access — create an Editor token at
<https://www.sanity.io/manage/project/amp8e9rk/api#tokens>. A Viewer token will
fail: the script reads fine but every mutation is rejected.

```bash
cd backend-sanity

# 1. See the plan. Writes nothing.
node scripts/migrate-artwork-types.mjs

# 2. Commit it.
SANITY_WRITE_TOKEN=sk... node scripts/migrate-artwork-types.mjs --apply
```

Safe to re-run: types use `createIfNotExists` with fixed ids, and artworks are
patched with `setIfMissing`, so a type you pick by hand in the Studio is never
overwritten.

## What it does

Creates nine types — Painting, Works on Paper, Ceramics, Sculpture,
Timber & Woodwork, Mixed Media, Textiles, Jewellery, Photography — then assigns
one to each artwork by reading the free-text `medium`, first match wins:

| Medium contains | Type |
|---|---|
| mixed media | Mixed Media |
| ceramic, stoneware, porcelain, earthenware | Ceramics |
| paper, pencil, drawing, pastel, watercolour, gouache, charcoal, etching, lino | Works on Paper |
| sculpture, carved, bronze, metal, stone | Sculpture |
| timber, wood | Timber & Woodwork |
| acrylic, oil, canvas, linen, board | Painting |

Ceramics is tested before Sculpture on purpose, so a "Ceramic Sculpture" is
filed by material with the rest of the ceramics rather than with the metal work.

31 artworks have no `medium` at all. For those the script borrows the dominant
type from the artist's other work — Gooniyandi Artists have 23 such pieces and a
clear run of "Acrylic on Canvas" elsewhere. Every inference is printed so you can
check it.

Four cannot be determined either way and are left unset for you to pick in the
Studio: Balancing Boulders, Fish At Play, Tidal Remants (Chris Huber Fine Art)
and Cleveland Point Lighthouse (Grayden Wallace Scott).

## Slug normalisation

`normalise-slugs.mjs` rewrites any artwork or artist slug that is not
lowercase-hyphenated, and writes the matching 301s into
`website-astro/public/_redirects` (preserving any hand-written rules there).

```bash
node scripts/normalise-slugs.mjs                     # dry run
SANITY_WRITE_TOKEN=sk... node scripts/normalise-slugs.mjs --apply
```

Both schemas now use `schemas/lib/slugify.ts`, so the Generate button and any
typed value are forced to that shape and this should not recur. The
`--normalise-slugs` flag on `migrate-artwork-types.mjs` predates this script and
only covers artworks; prefer this one.

## Note on the frontend

`website-astro/src/lib/artwork-type.ts` mirrors these rules and falls back to
reading `medium` when an artwork has no `artworkType` reference yet, so the
gallery filter is complete from the first deploy rather than only after this
runs. Keep the two rule lists in step.
