import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

const TOKEN =
  "skXuI4bWmHcEdyNAH29At7WcJFvCEQA8whKPCCY3qxhPTHpnF04TV8WDdAOchnJEI7WFMFWO5SD4EEAQV";

const client = createClient({
  projectId: "usb9r63v",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

const LIB =
  "c:/Users/Admin/Desktop/Majestic-HQ/projects/marketing/03-output/_drafts/made-sustainable-v3";

const TILES = [
  { id: "craftsmanship-img-1", file: `${LIB}/01-millwork.png` },
  { id: "craftsmanship-img-2", file: `${LIB}/02-metal-frame.png` },
  { id: "craftsmanship-img-3", file: `${LIB}/03-cable-tray.png` },
  { id: "craftsmanship-img-4", file: `${LIB}/04-spine-beam.png` },
  { id: "craftsmanship-img-5", file: `${LIB}/05-chair-mechanism.png` },
  { id: "craftsmanship-img-6", file: `${LIB}/06-lounge-upholstery.png` },
  { id: "craftsmanship-img-7", file: `${LIB}/07-contract-textile.png` },
];

for (const tile of TILES) {
  const buf = await readFile(tile.file);
  const asset = await client.assets.upload("image", buf, {
    filename: basename(tile.file),
  });
  await client
    .patch(tile.id)
    .set({
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();
  console.log(`ok  ${tile.id}  <-  ${basename(tile.file)}  (${asset._id})`);
}

console.log("done");
