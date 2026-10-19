// Original editorial photos take priority. Unassigned articles have distinct topic images.
const articleImages = {
  "global-export-import-services": "/assets/apart/transport.webp",
  "international-export-import-company": "/assets/services/freight.webp",
  "b2b-food-exporter-international": "/assets/services/import.webp",
  "global-commodity-exporter-in-india": "/assets/services/export.webp",
  "premium-dehydrated-food-manufacturer-in-india": "/assets/blog/photography/fruits.webp",
  "bulk-dehydrated-food-supplier-in-india": "/images/photos/sourcing.webp",
  "dehydrated-vegetable-flakes-exporter": "/assets/blog/photography/vegetables.webp",
  "fruit-powder-exporter-in-india": "/images/photos/banana.webp",
  "organic-dehydrated-powder-exporter": "/images/photos/nutraceuticals.webp",
  "bulk-food-ingredients-supplier": "/assets/blog/photography/seeds.webp",
  "international-spice-exporter": "/assets/blog/photography/spices.webp",
  "dehydrated-ginger-supplier-in-india": "/images/product-spices.webp",
  "dehydrated-ginger-flakes-manufacturer-india": "/images/photos/spices.webp",
  "dehydrated-green-chilli-exporter": "/images/photos/vegetables.webp",
  "global-nut-dry-fruit-supplier": "/assets/blog/photography/nuts.webp",
  "dehydrated-jackfruit-exporter-in-india": "/images/product-fruits.webp"
};

export function getBlogImage(post) {
  return { src: post.image || articleImages[post.slug], alt: post.title };
}
