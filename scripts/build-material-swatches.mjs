#!/usr/bin/env node
/**
 * Copy wood swatch images from Majestic-HQ material library into
 * Majestic-Next/public/materials/wood/{slug}/swatch.jpg, and emit
 * public/materials/index.json mapping the UI finish name → swatch URL.
 *
 * Uses sharp (already transitively installed via Next) to resize + reencode
 * all swatches to 1024×1024 JPG q80 — keeps each ~80KB, total ~3MB.
 *
 * Run: node scripts/build-material-swatches.mjs
 */
import { mkdirSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

const SRC_ROOT = "c:/Users/Admin/Desktop/Majestic-HQ/projects/majestic-3d/03_library/materials/wood";
const DST_ROOT = "c:/Users/Admin/Desktop/Majestic-Next/public/materials/wood";
const TARGET_SIZE = 1024;
const JPG_QUALITY = 82;

// UI finish name (from DESK_TOP_FINISHES) → slug suffix used by the library folder.
// Folders look like "A398-italian-walnut" or "H1133_10-natural-hamilton-oak".
const NAME_TO_SLUG = {
  "Premium White":          "premium-white",
  "Natural Hamilton Oak":   "natural-hamilton-oak",
  "Light Rustic Oak":       "light-rustic-oak",
  "Grey Bardolino Oak":     "grey-bardolino-oak",
  "Natural Hamilton Walnut":"natural-hamilton-walnut",
  "Vicenza Oak":            "vicenza-oak-horizontal",
  "Cashmere Grey":          "cashmere-grey",
  "Light Grey":             "light-grey",
  "Basalt Grey":            "basalt-grey",
  "Platinum Grey":          "platinum-grey",
  "Soft Black":             "soft-black",
  "Graphite Grey":          "graphite-grey",
  "Onyx Grey":              "onyx-grey",
  "Africa Walnut":          "africa-walnut",
  "Anatolia Walnut":        "anatolia-walnut",
  "Italian Walnut":         "italian-walnut",
  "Lefkas Oak":             "lefkas-oak",
  "Antique White":          "antique-white",
  "Ibiza":                  "ibiza",
  "Dakota":                 "dakota",
  "Garda":                  "garda",
  "Amalfi":                 "amalfi",
  "Armada":                 "armada",
  "Acapulco":               "acapulco",
  "Belmonte":               "belmonte",
  "Cabana":                 "cabana",
  "Argos":                  "argos",
  "Alpine":                 "alpine",
  "White Oak":              "white-oak",
  "Cherry":                 "cherry",
  "Aris Anthracite":        "aris-anthracite",
  "Devine Oak":             "devine-oak",
};

function indexFoldersBySuffix() {
  const index = {};
  for (const supplier of ["egger", "kastamonu"]) {
    const dir = join(SRC_ROOT, supplier);
    for (const folder of readdirSync(dir)) {
      const full = join(dir, folder);
      if (!statSync(full).isDirectory()) continue;
      const suffix = folder.replace(/^[^-]+-/, "");
      index[suffix] = full;
    }
  }
  return index;
}

const folderIndex = indexFoldersBySuffix();
const manifest = {};
const missing = [];

mkdirSync(DST_ROOT, { recursive: true });

for (const [name, slug] of Object.entries(NAME_TO_SLUG)) {
  const sourceDir = folderIndex[slug];
  if (!sourceDir) {
    missing.push({ name, slug, reason: "no source folder" });
    continue;
  }
  const candidates = ["swatch.jpg", "swatch.png"];
  let chosen = null;
  for (const f of candidates) {
    const p = join(sourceDir, f);
    if (existsSync(p)) { chosen = p; break; }
  }
  if (!chosen) {
    missing.push({ name, slug, reason: "no swatch.jpg or swatch.png in source" });
    continue;
  }
  const targetDir = join(DST_ROOT, slug);
  const targetFile = join(targetDir, "swatch.jpg");
  mkdirSync(targetDir, { recursive: true });
  try {
    await sharp(chosen)
      .resize(TARGET_SIZE, TARGET_SIZE, { fit: "cover", position: "centre" })
      .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
      .toFile(targetFile);
    const stat = statSync(targetFile);
    manifest[name] = {
      url: `/materials/wood/${slug}/swatch.jpg`,
      bytes: stat.size,
    };
  } catch (err) {
    missing.push({ name, slug, reason: err.message });
  }
}

const indexPath = "c:/Users/Admin/Desktop/Majestic-Next/public/materials/index.json";
writeFileSync(
  indexPath,
  JSON.stringify(
    { generated_at: new Date().toISOString(), source: "Majestic-HQ/majestic-3d/03_library/materials/wood", wood: manifest },
    null,
    2,
  ),
);

const totalBytes = Object.values(manifest).reduce((a, m) => a + m.bytes, 0);
console.log(`processed: ${Object.keys(manifest).length}/${Object.keys(NAME_TO_SLUG).length}`);
console.log(`total size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
if (missing.length) {
  console.log("MISSING:");
  for (const m of missing) console.log(` - ${m.name} (${m.slug}): ${m.reason}`);
}
console.log(`index: ${indexPath}`);
