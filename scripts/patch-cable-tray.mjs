import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";

const TOKEN =
  "skXuI4bWmHcEdyNAH29At7WcJFvCEQA8whKPCCY3qxhPTHpnF04TV8WDdAOchnJEI7WFMFWO5SD4EEAQV";

const client = createClient({
  projectId: "usb9r63v",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: TOKEN,
  useCdn: false,
});

const FILE =
  "c:/Users/Admin/Desktop/Majestic-HQ/projects/marketing/03-output/_drafts/made-sustainable-v1/03-cable-tray-v2.png";

const buf = await readFile(FILE);
const asset = await client.assets.upload("image", buf, {
  filename: "03-cable-tray-v2.png",
});
await client
  .patch("craftsmanship-img-3")
  .set({
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    },
  })
  .commit();
console.log(`ok  craftsmanship-img-3  <-  ${asset._id}`);
