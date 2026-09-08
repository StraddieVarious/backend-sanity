#!/usr/bin/env node
/**
 * Rewrites every artwork and artist slug that is not lowercase-hyphenated, and
 * writes the 301s the change needs so no existing link breaks.
 *
 *   node scripts/normalise-slugs.mjs                     # dry run
 *   SANITY_WRITE_TOKEN=sk... node scripts/normalise-slugs.mjs --apply
 *
 * Slugs typed by hand kept their spacing and capitals, so they served as
 * /gallery/Aussie%20Outlook/ and appeared in sitemap.xml as a <loc> containing
 * a raw space, which is invalid per the sitemap spec.
 *
 * Redirects are written to website-astro/public/_redirects. Existing hand-written
 * rules in that file are preserved; only the generated block is replaced.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REDIRECTS = resolve(HERE, "../../website-astro/public/_redirects");

const PROJECT_ID = "amp8e9rk";
const DATASET = "production";
const API_VERSION = "2025-01-01";

const APPLY = process.argv.includes("--apply");
const TOKEN = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

const START = "# BEGIN generated slug redirects";
const END = "# END generated slug redirects";

/** Must stay identical to backend-sanity/schemas/lib/slugify.ts. */
function slugify(input) {
  return String(input)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96)
    .replace(/-+$/g, "");
}

const isClean = (v) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v);

async function query(groq) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, { headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {} });
  if (!res.ok) throw new Error(`Query failed ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
}

async function mutate(mutations) {
  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ mutations }),
    }
  );
  if (!res.ok) throw new Error(`Mutate failed ${res.status}: ${await res.text()}`);
  return res.json();
}

function plan(rows, base, labelField) {
  const taken = new Set(rows.map((r) => r.slug).filter(Boolean));
  const out = [];
  for (const row of rows) {
    if (!row.slug || isClean(row.slug)) continue;
    let candidate = slugify(row[labelField] || row.slug) || slugify(row.slug);
    if (!candidate) continue;
    // Never collide with a slug already in use by a different document.
    let n = 2;
    let unique = candidate;
    while (taken.has(unique) && unique !== row.slug) unique = `${candidate}-${n++}`;
    taken.add(unique);
    out.push({
      id: row._id,
      label: row[labelField],
      from: row.slug,
      to: unique,
      fromUrl: `${base}/${encodeURIComponent(row.slug)}/`,
      toUrl: `${base}/${unique}/`,
    });
  }
  return out;
}

function writeRedirects(entries) {
  const block = [
    START,
    "# Slugs rewritten to lowercase-hyphen form. Do not edit by hand —",
    "# regenerate with backend-sanity/scripts/normalise-slugs.mjs.",
    ...entries.map((e) => `${e.fromUrl} ${e.toUrl} 301`),
    END,
  ].join("\n");

  let existing = existsSync(REDIRECTS) ? readFileSync(REDIRECTS, "utf8") : "";
  if (existing.includes(START)) {
    existing = existing.replace(
      new RegExp(`${START}[\\s\\S]*?${END}`),
      block
    );
  } else {
    existing = existing.trim() ? `${existing.trim()}\n\n${block}\n` : `${block}\n`;
  }
  mkdirSync(dirname(REDIRECTS), { recursive: true });
  writeFileSync(REDIRECTS, existing.endsWith("\n") ? existing : `${existing}\n`);
}

async function main() {
  if (APPLY && !TOKEN) {
    console.error("--apply needs SANITY_WRITE_TOKEN with write access.");
    process.exit(1);
  }

  const [artworks, artists] = await Promise.all([
    query(`*[_type == "artwork" && defined(slug.current)]{_id, title, "slug": slug.current}`),
    query(`*[_type == "artist"  && defined(slug.current)]{_id, name,  "slug": slug.current}`),
  ]);

  const artworkPlan = plan(artworks, "/gallery", "title");
  const artistPlan = plan(artists, "/artists", "name");
  const all = [...artworkPlan, ...artistPlan];

  console.log(`Artworks: ${artworks.length} checked, ${artworkPlan.length} to rewrite.`);
  console.log(`Artists:  ${artists.length} checked, ${artistPlan.length} to rewrite.\n`);

  if (!all.length) {
    console.log("Every slug is already lowercase-hyphenated. Nothing to do.");
    return;
  }

  for (const e of all) {
    console.log(`  ${e.from}`);
    console.log(`    -> ${e.to}`);
  }

  console.log(`\n${all.length} redirect(s) -> ${REDIRECTS}`);

  if (!APPLY) {
    console.log("\nDry run — nothing written. Re-run with --apply to commit.");
    return;
  }

  const mutations = all.map((e) => ({
    patch: { id: e.id, set: { slug: { _type: "slug", current: e.to } } },
  }));

  for (let i = 0; i < mutations.length; i += 50) {
    await mutate(mutations.slice(i, i + 50));
    console.log(`  wrote ${Math.min(i + 50, mutations.length)}/${mutations.length}`);
  }

  writeRedirects(all);
  console.log(`\nWrote ${all.length} redirects to ${REDIRECTS}`);
  console.log("Done. Commit the _redirects file and redeploy.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
