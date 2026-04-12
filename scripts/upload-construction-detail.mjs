import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const TOKEN = process.env.SANITY_TOKEN;
if (!TOKEN) {
  console.error("Missing SANITY_TOKEN env variable. Run with:\n  SANITY_TOKEN=sk... node scripts/upload-construction-detail.mjs");
  process.exit(1);
}

const client = createClient({
  projectId: "usb9r63v",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

const LIB =
  "c:/Users/Admin/Desktop/approved-for-website/05-Construction-Detail-Strip";

const MAP = [
  { id: "craftsmanship-img-1", file: `${LIB}/s3-a-desk-edge-new.png` },
  { id: "craftsmanship-img-2", file: `${LIB}/s3-b-height-mechanism-new.png` },
  { id: "craftsmanship-img-3", file: `${LIB}/s3-c-leather-armrest-new.png` },
  { id: "craftsmanship-img-4", file: `${LIB}/s3-d-table-joinery-new.png` },
  { id: "craftsmanship-img-5", file: `${LIB}/s3-e-acoustic-fabric-new.png` },
];

for (const entry of MAP) {
  const buf = await readFile(entry.file);
  const asset = await client.assets.upload("image", buf, {
    filename: basename(entry.file),
  });
  await client
    .patch(entry.id)
    .set({
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();
  console.log(`ok  ${entry.id}  <-  ${basename(entry.file)}  (${asset._id})`);
}

console.log("done");
