import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const outRoot = "C:\\Users\\Admin\\Desktop\\Majestic-HQ\\tmp\\davinci-max-only-site-export";
const familyDir = path.join(outRoot, "3d-parts", "davinci");
const tsvPath = path.join(familyDir, "parts.tsv");
const sourceFile = "02_source/max/davinci/davinci collections.max";

function parseTsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split("\t");
  return lines
    .filter((line) => line && !line.startsWith("EXPORT_ERROR") && !line.startsWith("EMPTY"))
    .map((line) => {
      const cells = line.split("\t");
      return Object.fromEntries(headers.map((header, i) => [header, cells[i] ?? ""]));
    });
}

function hashFile(absPath) {
  return crypto.createHash("sha1").update(fs.readFileSync(absPath)).digest("hex").slice(0, 12);
}

if (!fs.existsSync(tsvPath)) {
  throw new Error(`Missing Max export table: ${tsvPath}`);
}

const rows = parseTsv(fs.readFileSync(tsvPath, "utf8"));
const manifest = {
  family: "davinci",
  generated_at: new Date().toISOString(),
  source_file: sourceFile,
  source_policy: "original_max_file_only",
  configs: {},
};

for (const row of rows) {
  const absPath = path.join(outRoot, row.url.replace(/^\//, ""));
  if (!fs.existsSync(absPath)) {
    throw new Error(`Missing exported GLB for ${row.config}/${row.role}: ${absPath}`);
  }

  manifest.configs[row.config] ??= {
    parts: {},
    baseSize: row.base_size || null,
    unknowns: [],
  };

  const sourceObjects = row.source_objects ? row.source_objects.split(" | ").filter(Boolean) : [];
  const roleKey = row.role;
  manifest.configs[row.config].parts[roleKey] = {
    glb: row.url,
    anchor: [0, 0, 0],
    bbox: [
      Number.parseFloat(row.bbox_x),
      Number.parseFloat(row.bbox_y),
      Number.parseFloat(row.bbox_z),
    ],
    bytes: fs.statSync(absPath).size,
    hash: hashFile(absPath),
    source_file: sourceFile,
    source_objects: sourceObjects,
  };
}

fs.writeFileSync(
  path.join(familyDir, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

console.log(`Wrote ${path.join(familyDir, "manifest.json")}`);
console.log(Object.entries(manifest.configs).map(([config, entry]) => {
  return `${config}: ${Object.keys(entry.parts).join(", ")}`;
}).join("\n"));
