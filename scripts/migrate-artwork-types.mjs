#!/usr/bin/env node
/**
 * Seeds the artworkType documents and backfills every artwork with one.
 *
 *   node scripts/migrate-artwork-types.mjs            # dry run, prints the plan
 *   node scripts/migrate-artwork-types.mjs --apply    # writes to the dataset
 *
 * Add --normalise-slugs to also rewrite the 11 slugs that contain spaces and
 * capitals ("Aussie Outlook" -> "aussie-outlook"). This is opt-in because it
 * changes live URLs: run it only alongside the redirects the script prints.
 *
 * Needs a token with write access:
 *   SANITY_WRITE_TOKEN=sk... node scripts/migrate-artwork-types.mjs --apply
 *
 * Safe to re-run. Types are created with deterministic ids via createIfNotExists,
 * and artworks are patched with setIfMissing so a type chosen by hand in the
 * Studio is never overwritten.
 */

const PROJECT_ID = "amp8e9rk";
const DATASET = "production";
const API_VERSION = "2025-01-01";

const APPLY = process.argv.includes("--apply");
const NORMALISE = process.argv.includes("--normalise-slugs");
const TOKEN = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

/** The closed set of types. Order controls the gallery filter sequence. */
const TYPES = [
  { slug: "painting", title: "Painting", order: 10 },
  { slug: "works-on-paper", title: "Works on Paper", order: 20 },
  { slug: "ceramics", title: "Ceramics", order: 30 },
  { slug: "sculpture", title: "Sculpture", order: 40 },
  { slug: "timber-woodwork", title: "Timber & Woodwork", order: 50 },
  { slug: "mixed-media", title: "Mixed Media", order: 60 },
  { slug: "textiles", title: "Textiles", order: 70 },
  { slug: "jewellery", title: "Jewellery", order: 80 },
  { slug: "photography", title: "Photography", order: 90 },
];

/**
 * Ordered rules over the free-text `medium`. First match wins, so the specific
 * cases sit above the general ones: a "Ceramic Sculpture" is filed under
 * Ceramics rather than Sculpture, and "Acrylic on Stonehenge Paper" under
 * Works on Paper rather than Painting.
 */
const RULES = [
  [/mixed\s*media/i, "mixed-media"],
  [/ceramic|stoneware|porcelain|earthenware|terracotta/i, "ceramics"],
  [/paper|pencil|drawing|pastel|watercolou?r|gouache|gauche|charcoal|etching|lino|screen\s*print|giclee/i, "works-on-paper"],
  [/sculpture|carved|carving|bronze|metal|steel|stone/i, "sculpture"],
  [/timber|wood/i, "timber-woodwork"],
  [/acrylic|oil|canvas|linen|board|painting|painted/i, "painting"],
  [/textile|fibre|fiber|weav|woven|fabric|quilt|stitch/i, "textiles"],
  [/jewel|earring|necklace|pendant|brooch|silver|resin/i, "jewellery"],
  [/photograph|photo\b|giclée/i, "photography"],
];

const typeIdFor = (slug) => `artworkType-${slug}`;

function classify(medium) {
  if (!medium) return null;
  for (const [re, slug] of RULES) if (re.test(medium)) return slug;
  return null;
}

function slugify(title) {
  return String(title)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
    .replace(/-+$/g, "");
}

async function query(groq) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });
  if (!res.ok) throw new Error(`Query failed ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
}

async function mutate(mutations) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutate failed ${res.status}: ${await res.text()}`);
  return res.json();
}

async function chunked(mutations, size = 50) {
  for (let i = 0; i < mutations.length; i += size) {
    const batch = mutations.slice(i, i + size);
    await mutate(batch);
    process.stdout.write(`  wrote ${Math.min(i + size, mutations.length)}/${mutations.length}\n`);
  }
}

async function main() {
  if (APPLY && !TOKEN) {
    console.error("--apply needs SANITY_WRITE_TOKEN (or SANITY_API_TOKEN) with write access.");
    process.exit(1);
  }

  const artworks = await query(`*[_type == "artwork"]{
    _id, title, "slug": slug.current, medium, hidden,
    "artistId": artist._ref, "artistName": artist->name,
    "existingType": artworkType->slug.current
  } | order(title asc)`);

  console.log(`Loaded ${artworks.length} artworks.\n`);

  // Pass 1 — classify on medium.
  const byMedium = new Map();
  for (const a of artworks) byMedium.set(a._id, classify(a.medium));

  // Pass 2 — for artworks with no usable medium, borrow the artist's dominant
  // type from their other works. Gooniyandi Artists, for instance, have 23
  // pieces with no medium and a clear run of "Acrylic on Canvas" elsewhere.
  const artistTally = new Map();
  for (const a of artworks) {
    const t = byMedium.get(a._id);
    if (!t || !a.artistId) continue;
    if (!artistTally.has(a.artistId)) artistTally.set(a.artistId, new Map());
    const m = artistTally.get(a.artistId);
    m.set(t, (m.get(t) || 0) + 1);
  }
  const dominant = new Map();
  for (const [artistId, tally] of artistTally) {
    const [best] = [...tally.entries()].sort((x, y) => y[1] - x[1]);
    dominant.set(artistId, best[0]);
  }

  const resolved = new Map();
  const inferred = [];
  const unresolved = [];
  for (const a of artworks) {
    let t = byMedium.get(a._id);
    let how = "medium";
    if (!t && a.artistId && dominant.has(a.artistId)) {
      t = dominant.get(a.artistId);
      how = "artist";
    }
    if (!t) {
      unresolved.push(a);
      continue;
    }
    resolved.set(a._id, t);
    if (how === "artist") inferred.push({ ...a, type: t });
  }

  // ── Report ────────────────────────────────────────────────────────────────
  const counts = new Map();
  for (const t of resolved.values()) counts.set(t, (counts.get(t) || 0) + 1);
  console.log("Type assignment:");
  for (const t of TYPES) {
    const n = counts.get(t.slug) || 0;
    console.log(`  ${String(n).padStart(4)}  ${t.title}`);
  }
  console.log(`  ${String(unresolved.length).padStart(4)}  (could not determine — left unset)\n`);

  if (inferred.length) {
    console.log(`Inferred from the artist's other work (${inferred.length}) — check these:`);
    const g = new Map();
    for (const a of inferred) {
      const k = `${a.artistName} → ${a.type}`;
      g.set(k, (g.get(k) || 0) + 1);
    }
    for (const [k, n] of [...g.entries()].sort((x, y) => y[1] - x[1])) {
      console.log(`  ${String(n).padStart(4)}  ${k}`);
    }
    console.log("");
  }

  if (unresolved.length) {
    console.log(`Need a type set by hand in the Studio (${unresolved.length}):`);
    for (const a of unresolved) console.log(`  · ${a.title} — ${a.artistName || "no artist"}`);
    console.log("");
  }

  // ── Slug backfill ─────────────────────────────────────────────────────────
  const taken = new Set(artworks.map((a) => a.slug).filter(Boolean));
  const missingSlug = artworks.filter((a) => !a.slug);
  const slugFixes = [];
  for (const a of missingSlug) {
    let base = slugify(a.title) || `artwork-${a._id.slice(0, 8)}`;
    let candidate = base;
    let n = 2;
    while (taken.has(candidate)) candidate = `${base}-${n++}`;
    taken.add(candidate);
    slugFixes.push({ id: a._id, title: a.title, slug: candidate });
  }
  if (slugFixes.length) {
    console.log(`Missing slugs to backfill (${slugFixes.length}) — these are why the gallery is empty:`);
    for (const f of slugFixes) console.log(`  · ${f.title}  →  /gallery/${f.slug}`);
    console.log("");
  }

  // ── Untidy slugs ──────────────────────────────────────────────────────────
  // Spaces and capitals survive in a slug if it was typed rather than
  // generated. They resolve, but as percent-encoded URLs.
  const isClean = (value) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
  const untidy = artworks
    .filter((a) => a.slug && !isClean(a.slug))
    .map((a) => {
      let base = slugify(a.title);
      let candidate = base;
      let n = 2;
      while (taken.has(candidate)) candidate = `${base}-${n++}`;
      taken.add(candidate);
      return { id: a._id, title: a.title, from: a.slug, to: candidate };
    });

  if (untidy.length) {
    console.log(
      `Slugs with spaces or capitals (${untidy.length})` +
        (NORMALISE ? " — will be rewritten:" : " — pass --normalise-slugs to rewrite:")
    );
    for (const u of untidy) console.log(`  · "${u.from}"  →  "${u.to}"`);
    console.log("");
    console.log("  Redirects for public/_redirects, needed if you rewrite them:");
    for (const u of untidy) {
      console.log(`    /gallery/${encodeURIComponent(u.from)}/ /gallery/${u.to}/ 301`);
    }
    console.log("");
  }

  // ── Mutations ─────────────────────────────────────────────────────────────
  const typeMutations = TYPES.map((t) => ({
    createIfNotExists: {
      _id: typeIdFor(t.slug),
      _type: "artworkType",
      title: t.title,
      slug: { _type: "slug", current: t.slug },
      order: t.order,
    },
  }));

  const artworkMutations = [];
  for (const a of artworks) {
    const t = resolved.get(a._id);
    if (!t || a.existingType) continue;
    artworkMutations.push({
      patch: {
        id: a._id,
        setIfMissing: {
          artworkType: { _type: "reference", _ref: typeIdFor(t) },
        },
      },
    });
  }
  for (const f of slugFixes) {
    artworkMutations.push({
      patch: { id: f.id, set: { slug: { _type: "slug", current: f.slug } } },
    });
  }
  if (NORMALISE) {
    for (const u of untidy) {
      artworkMutations.push({
        patch: { id: u.id, set: { slug: { _type: "slug", current: u.to } } },
      });
    }
  }

  console.log(
    `Plan: ${typeMutations.length} type documents, ` +
      `${artworkMutations.length} artwork patches ` +
      `(${artworkMutations.length - slugFixes.length} type, ${slugFixes.length} slug).`
  );

  if (!APPLY) {
    console.log("\nDry run — nothing written. Re-run with --apply to commit.");
    return;
  }

  console.log("\nWriting types…");
  await chunked(typeMutations);
  console.log("Writing artworks…");
  await chunked(artworkMutations);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
