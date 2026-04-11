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
  "c:/Users/Admin/Desktop/Majestic-HQ/projects/marketing/03-output/_drafts/made-sustainable-v1";

const TILES = [
  {
    id: "craftsmanship-img-1",
    order: 1,
    file: `${LIB}/01-millwork.png`,
    altEn: "Bookmatched walnut millwork",
    altAr: "خشب الجوز المُقَرَّن",
  },
  {
    id: "craftsmanship-img-2",
    order: 2,
    file: `${LIB}/02-metal-frame.png`,
    altEn: "Structural metal frame joint",
    altAr: "وصلة الهيكل المعدني",
  },
  {
    id: "craftsmanship-img-3",
    order: 3,
    file: `${LIB}/03-cable-tray.png`,
    altEn: "Concealed cable management tray",
    altAr: "مسار الكابلات المخفي",
  },
  {
    id: "craftsmanship-img-4",
    order: 4,
    file: `${LIB}/04-spine-beam.png`,
    altEn: "Architectural spine beam",
    altAr: "العمود المركزي المعماري",
  },
  {
    id: "craftsmanship-img-5",
    order: 5,
    file: `${LIB}/05-chair-mechanism.png`,
    altEn: "Ergonomic chair mechanism",
    altAr: "آلية الكرسي الحركية",
  },
  {
    id: "craftsmanship-img-6",
    order: 6,
    file: `${LIB}/06-lounge-upholstery.png`,
    altEn: "Lounge leather upholstery",
    altAr: "تنجيد جلد الجلوس",
  },
  {
    id: "craftsmanship-img-7",
    order: 7,
    file: `${LIB}/07-contract-textile.png`,
    altEn: "Natural-fibre contract textile",
    altAr: "النسيج الطبيعي",
  },
];

for (const tile of TILES) {
  const buf = await readFile(tile.file);
  const asset = await client.assets.upload("image", buf, {
    filename: basename(tile.file),
  });
  await client.createOrReplace({
    _id: tile.id,
    _type: "craftsmanshipImage",
    order: tile.order,
    altEn: tile.altEn,
    altAr: tile.altAr,
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    },
  });
  console.log(`ok  ${tile.id}  <-  ${basename(tile.file)}  (${asset._id})`);
}

console.log("done");
