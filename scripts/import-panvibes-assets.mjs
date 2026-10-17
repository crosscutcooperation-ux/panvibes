import fs from "node:fs/promises";
import path from "node:path";
const origin = "https://www.panvibesexim.com/";
const assets = [
  ["panvibes-logo.jpg", "assets/logo55.jpg"],
  ["industry-agriculture.jpg", "assets/images/services/service1.jpg"],
  ["industry-chemicals.jpg", "assets/images/services/service7.jpg"],
  ["industry-spices.jpg", "assets/images/services/service4.jpg"],
  ["industry-nutraceutical.jpg", "assets/images/services/service5.jpg"],
  ["product-makhana.jpg", "assets/images/product/p9.jpg"],
  ["product-dairy.jpg", "assets/images/product/spp3.jpg"],
  ["product-vegetables.jpg", "assets/images/product/spp1.jpg"],
  ["product-fruits.jpg", "assets/images/product/spp2.jpg"],
  ["product-sprouts.jpg", "assets/images/product/p3.jpg"],
  ["product-cashew.jpg", "assets/images/product/p5.jpg"],
  ["product-spices.jpg", "assets/images/product/p4.jpg"],
  ["product-chemicals.jpg", "assets/images/product/p6.jpg"],
  ["product-nutraceuticals.jpg", "assets/images/product/p7.jpg"],
  ["product-ready-meals.jpg", "assets/images/product/p8.jpg"],
  ["product-millets.jpg", "assets/images/product/p12.jpg"],
  ["product-aggregate.jpg", "assets/images/product/sp46.jpg"],
  ["product-admixtures.jpg", "assets/images/product/p13.jpg"],
];
await Promise.all(
  assets.map(async ([name, resource]) => {
    const response = await fetch(new URL(resource, origin));
    if (!response.ok) throw new Error(name + ": " + response.status);
    await fs.writeFile(
      path.join("public", "images", name),
      new Uint8Array(await response.arrayBuffer()),
    );
    console.log(name);
  }),
);
const manifestPath = path.join("public", "images", "asset-sources.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
for (const [name, resource] of assets) {
  const entry = { name, url: new URL(resource, origin).href };
  const index = manifest.findIndex((item) => item.name === name);
  if (index < 0) manifest.push(entry);
  else manifest[index] = entry;
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
