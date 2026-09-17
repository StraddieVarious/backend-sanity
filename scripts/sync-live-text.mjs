/**
 * Copies text the website shows, but Sanity did not hold, into Sanity so the
 * Studio matches the live site. Dry run by default; pass --apply to write.
 *
 *   node scripts/sync-live-text.mjs            # show what would change
 *   node scripts/sync-live-text.mjs --apply    # write it
 *
 * Every patch is pinned to the document revision it was planned against, so an
 * edit made in the Studio in the meantime makes the write fail rather than be
 * overwritten. Previous SEO values are saved to backups/ before anything runs.
 */
import fs from "node:fs";

const APPLY = process.argv.includes("--apply");
const token = process.env.SANITY_WRITE_TOKEN;
const API = "https://amp8e9rk.api.sanity.io/v2024-01-01/data";
const live = JSON.parse(fs.readFileSync(process.env.LIVE_TEXT, "utf8"));

const q = async (query) => {
  const r = await fetch(`${API}/query/production?query=${encodeURIComponent(query)}&perspective=raw`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return (await r.json()).result;
};

const key = () => Math.random().toString(36).slice(2, 14);
const block = (text) => ({
  _type: "block", _key: key(), style: "normal", markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

// The About story as the site shows it when Sanity has none (src/pages/about.astro).
const story = [
  "Straddievarious Gallery began on North Stradbroke Island (Minjerribah) in 2018, to help local artists and artisans show and sell their work. The name was dreamt up more than 25 years earlier, walking Home Beach and imagining a future on the island spent making art.",
  "Deb McCann, gallery owner and curator, and Jacquie Holmes, gallery manager, met at the Point Lookout markets, where each was selling their own work. The markets ran only in holiday periods, so local makers had few chances to sell. The two set up a permanent space for the island's creative community at the Point Lookout Bowls Club.",
  "Twelve months later, family health needs brought a move to the mainland at Cleveland, and a new gallery opened at Raby Bay Harbourside, showing and selling on behalf of artists and artisans from North Stradbroke Island, the Bay Islands and the mainland Redlands.",
  "Everyone involved has been struck by the depth of talent across the Redlands Coast, and the gallery exists to support as much of it as it can.",
];

const ids = ["homePage", "galleryPage", "artistsPage", "aboutPage", "contactPage", "siteSettings"];
const docs = await q(`*[_id in ${JSON.stringify([...ids, ...ids.map((i) => `drafts.${i}`)])}]`);
const byId = Object.fromEntries(docs.map((d) => [d._id, d]));
const drafts = docs.filter((d) => d._id.startsWith("drafts.")).map((d) => d._id);
if (drafts.length) console.log(`Drafts exist and will be patched too: ${drafts.join(", ")}`);

const plan = [];
const previous = {};
for (const id of ids) {
  for (const target of [id, `drafts.${id}`]) {
    const doc = byId[target];
    if (!doc) continue;
    const set = {};
    const setIfMissing = {};
    if (live[id]) {
      previous[target] = doc.seo ?? null;
      setIfMissing.seo = { _type: "seo" };
      set["seo.metaTitle"] = live[id].metaTitle;
      set["seo.metaDescription"] = live[id].metaDescription;
    }
    if (id === "siteSettings") {
      setIfMissing.footer = {};
      if (!doc.footer?.description) set["footer.description"] = live.footer_description;
      if (!doc.footer?.acknowledgment) set["footer.acknowledgment"] = live.acknowledgment;
      if (doc.footer?.showAcknowledgment == null) set["footer.showAcknowledgment"] = true;
    }
    if (id === "aboutPage" && !(doc.mainContent?.length)) set.mainContent = story.map(block);
    const changes = Object.entries(set).filter(([path, value]) => {
      const cur = path.split(".").reduce((o, k) => o?.[k], doc);
      return JSON.stringify(cur) !== JSON.stringify(value);
    });
    if (!changes.length) continue;
    plan.push({ patch: { id: target, ifRevisionID: doc._rev, setIfMissing, set: Object.fromEntries(changes) } });
    console.log(`\n${target}  (rev ${doc._rev})`);
    for (const [path, value] of changes) {
      const cur = path.split(".").reduce((o, k) => o?.[k], doc);
      const show = (v) => (Array.isArray(v) ? `[${v.length} paragraphs]` : JSON.stringify(v));
      console.log(`  ${path}\n    was: ${show(cur)}\n    now: ${show(value)}`);
    }
  }
}

if (!APPLY) {
  console.log(`\nDry run: ${plan.length} document(s) would change. Re-run with --apply to write.`);
  process.exit(0);
}
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.writeFileSync(`backups/seo-before-sync-${stamp}.json`, JSON.stringify(previous, null, 2));
const r = await fetch(`${API}/mutate/production?returnIds=true`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ mutations: plan }),
});
const body = await r.json();
if (!r.ok) {
  console.error("Write failed, nothing changed:", JSON.stringify(body));
  process.exit(1);
}
console.log(`\nWrote ${plan.length} document(s) in one transaction ${body.transactionId}. Previous SEO values: backups/seo-before-sync-${stamp}.json`);
