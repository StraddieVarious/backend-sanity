/**
 * Moves the site colours from the old theme presets to the four colour
 * pickers. Dry run by default.
 *
 *   node scripts/migrate-colours.mjs              # show the plan
 *   node scripts/migrate-colours.mjs --apply      # stage 1: write siteSettings.colours
 *   node scripts/migrate-colours.mjs --apply --remove-theme
 *                                                 # stage 2: also unset the old theme
 *
 * Stage 1 copies the colours the live site is actually using (the selected
 * preset, or the custom values when "custom" was selected) so nothing on the
 * site changes. Stage 2 removes the old theme object once no code reads it.
 * Patches are pinned to the revision they were planned against, and cover the
 * draft as well as the published document.
 */
const APPLY = process.argv.includes("--apply");
const REMOVE = process.argv.includes("--remove-theme");
const token = process.env.SANITY_WRITE_TOKEN;
const API = "https://amp8e9rk.api.sanity.io/v2024-01-01/data";

const PRESETS = {
  bay: { background: "#f7f9fa", accent: "#075a7d", banner: "#101519", bannerButton: "#35b0e0" },
  eucalypt: { background: "#f6f8f5", accent: "#2d5a3c", banner: "#121a15", bannerButton: "#7cc49a" },
  ochre: { background: "#faf8f4", accent: "#8a4a12", banner: "#1c1712", bannerButton: "#e4a652" },
};
const hex = (v) => typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v.trim());

function liveColours(theme) {
  const preset = theme?.preset ?? "bay";
  if (preset === "custom" && ["paper", "brand", "deep", "brandBright"].every((k) => hex(theme?.[k]))) {
    return { background: theme.paper, accent: theme.brand, banner: theme.deep, bannerButton: theme.brandBright };
  }
  return PRESETS[preset] ?? PRESETS.bay;
}

const q = async (query) =>
  (await (await fetch(`${API}/query/production?perspective=raw&query=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })).json()).result;

const docs = await q(`*[_id in ["siteSettings", "drafts.siteSettings"]]`);
const mutations = [];
for (const doc of docs) {
  const colours = { _type: "siteColours", ...Object.fromEntries(Object.entries(liveColours(doc.theme)).map(([k, v]) => [k, v.toLowerCase()])) };
  const patch = { id: doc._id, ifRevisionID: doc._rev };
  if (JSON.stringify(doc.colours) !== JSON.stringify(colours) && !doc.colours) patch.set = { colours };
  if (REMOVE && doc.theme !== undefined) patch.unset = ["theme"];
  console.log(`${doc._id}  (rev ${doc._rev})`);
  console.log(`  old theme:   ${JSON.stringify(doc.theme)}`);
  console.log(`  colours now: ${JSON.stringify(doc.colours ?? null)}`);
  if (patch.set) console.log(`  will set:    ${JSON.stringify(patch.set.colours)}`);
  if (patch.unset) console.log(`  will remove: theme`);
  if (patch.set || patch.unset) mutations.push({ patch });
}
if (!APPLY) {
  console.log(`\nDry run: ${mutations.length} document(s) would change.`);
  process.exit(0);
}
if (!mutations.length) {
  console.log("\nNothing to change.");
  process.exit(0);
}
const r = await fetch(`${API}/mutate/production`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ mutations }),
});
const body = await r.json();
if (!r.ok) {
  console.error("Write failed, nothing changed:", JSON.stringify(body));
  process.exit(1);
}
console.log(`\nWrote ${mutations.length} document(s), transaction ${body.transactionId}.`);
