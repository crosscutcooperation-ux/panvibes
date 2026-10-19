const photos = {
  vegetables: { src: '/images/photos/vegetables.webp', alt: 'Bowls of dehydrated vegetable flakes and granules' },
  fruits: { src: '/images/photos/banana.webp', alt: 'Banana powder with ripe bananas' },
  spices: { src: '/images/photos/spices.webp', alt: 'Chilli, pepper and whole spices' },
  nuts: { src: '/images/photos/nuts.webp', alt: 'Mixed nuts and dry fruits in a bowl' },
  makhana: { src: '/images/photos/makhana.webp', alt: 'Fox nuts, also known as makhana' },
  seeds: { src: '/images/photos/millets.webp', alt: 'Raw millets in ceramic bowls' },
  trade: { src: '/images/photos/transport.webp', alt: 'A container ship and cranes at an international port' },
  export: { src: '/images/photos/logistics.webp', alt: 'Cargo prepared for international export' },
  freight: { src: '/images/photos/logistics.webp', alt: 'Cargo transport and freight operations' },
  documents: { src: '/images/photos/documents.webp', alt: 'International trade documentation' },
  sourcing: { src: '/images/photos/warehouse.webp', alt: 'Goods stored in a distribution warehouse' },
};

const subjects = {
  'global-export-import-services': 'trade',
  'opportunities-challenges-how-to-get-started': 'documents',
  'international-export-import-company': 'freight',
  'b2b-food-exporter-international': 'sourcing',
  'global-commodity-exporter-in-india': 'export',
  'agro-product-exporter-in-india-panvibes-exim-global-supplier': 'vegetables',
  'dehydrated-food-exporter-in-india': 'vegetables',
  'premium-dehydrated-food-manufacturer-in-india': 'fruits',
  'bulk-dehydrated-food-supplier-in-india': 'sourcing',
  'dehydrated-vegetable-flakes-exporter': 'vegetables',
  'dehydrated-vegetables-exporter-in-navi-mumbai': 'vegetables',
  'dehydrated-food-supplier-navi-mumbai-premium-quality-ingredients': 'fruits',
  'fruit-powder-exporter-in-india': 'fruits',
  'organic-dehydrated-powder-exporter': 'vegetables',
  'bulk-food-ingredients-supplier': 'seeds',
  'international-spice-exporter': 'spices',
  'dehydrated-ginger-supplier-in-india': 'spices',
  'dehydrated-ginger-flakes-manufacturer-india': 'spices',
  'dehydrated-green-chilli-exporter': 'spices',
  'global-nut-dry-fruit-supplier': 'nuts',
  'fox-nuts-supplier-navi-mumbai-panvibes-exim': 'makhana',
  'dehydrated-jackfruit-exporter-in-india': 'fruits',
  'dehydrated-fruits-exporter-in-navi-mumbai': 'fruits',
};

export function getBlogImage(post) {
  if (subjects[post.slug]) return photos[subjects[post.slug]];
  if (/ginger|turmeric|chilli|spice/.test(post.slug)) return photos.spices;
  return photos.vegetables;
}
