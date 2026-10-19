import { shippingMarkets } from './shipping';

// Company content with shipping coverage updated by the owner on 18 October 2026.
export const company = {
  name: "PanVibes Exim",
  legalName: "PanVibes Exim Pvt Ltd",
  copyrightYear: 2025,
  email: "info@panvibesexim.com",
  location: "Navi Mumbai, Maharashtra, India",
  address:
    "Akshar Business Park, W-2106, Janta Market Road, Sector 25, Vashi, Navi Mumbai, Maharashtra 400703",
  phones: [
    "+91 2245686161",
    "+91 9967653143",
    "+91 8655481884",
  ],
  heroTitle: "Your Vision, Our Expert Execution",
  heroDescription:
    "Dehydrated vegetables, spices, moringa, makhana and fruit powders for international B2B buyers.",
  tagline: "Faster. Reliable. Global.",
  overview: [
    "PanVibes Exim connects Indian suppliers with buyers in India, the UK, the USA, Europe and the UAE, supporting food, nutrition, wellness and sustainable agriculture businesses.",
    "Our portfolio spans dehydrated agro products, nutraceutical ingredients, organic commodities, specialty chemicals and spices. We work with certified farms, manufacturing partners and formulation facilities, with a focus on purity, traceability and consistent quality.",
    "From sourcing to shipment, our approach combines innovation and integrity with timely delivery, regulatory compliance and lasting business relationships.",
  ],
  industryIntroduction: "A partner in global maritime transport, supporting the industries and products in our portfolio.",
  brochure: "/documents/PanVibes-Exim-Premium-Brochure-Short.pdf",
  profile: "/documents/PanVibes-Exim-Premium-Company-Profile.pdf",
};
export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
// Descriptions paraphrase the service.php data-description attributes.
export const services = [
  {
    title: ["Export", "solutions"],
    image: "photos/logistics.webp",
    overview: "Global trade support combining sourcing, logistics and quality-focused distribution.",
    description:
      "Documentation, customs clearance, logistics coordination, and delivery support for international exports.",
    features: "Customs clearance / Documentation / Logistics coordination",
  },
  {
    title: ["Import", "solutions"],
    image: "photos/warehouse.webp",
    overview: "Warehousing facilities supported by inventory management and distribution capabilities.",
    description:
      "Import support covering port operations, customs requirements, and inland transport.",
    features: "Port handling / Customs compliance / Inland transport",
  },
  {
    title: ["Transport", "solutions"],
    image: "photos/transport.webp",
    overview: "Transportation services focused on timely, secure delivery across destinations.",
    description:
      "Road, rail, and multimodal transport with shipment tracking and delivery coordination.",
    features: "Road / Rail / Multimodal transport",
  },
  {
    title: ["Document", "verification"],
    image: "photos/documents.webp",
    overview: "Container handling and consolidation support for import and export operations.",
    description:
      "Verification and processing of shipping documents, including bills of lading, origin certificates, and commercial invoices.",
    features: "Bills of lading / Origin certificates / Commercial invoices",
  },
  {
    title: ["Freight", "forwarding"],
    image: "photos/logistics.webp",
    overview: "Specialized storage for temperature-sensitive goods and bulk liquid cargo.",
    description:
      "Air, sea, and land freight, with cargo insurance and supply chain management.",
    features: "Air freight / Sea freight / Land transport",
  },
];
export const stats = [
  { value: 10, suffix: "+", label: "Product categories", description: "A portfolio of agro products, food, nutraceutical ingredients and specialty chemicals." },
  { value: 25, suffix: "+", label: "Subproduct categories", description: "Explore dehydrated produce, spices, dry fruits, snacks and more in our catalogue." },
  { value: shippingMarkets.length, suffix: "", label: "Shipping markets", description: "Shipping only to India, the UK, the USA, Europe and the UAE." },
  { value: 5, suffix: "+", label: "Services provided", description: "Export, import, transport, document verification and freight forwarding support." },
];
export const industries = [
  { name: "Agriculture", image: "photos/vegetables.webp", description: "Banana powder, dehydrated vegetables, millets, makhana and dry fruits." },
  { name: "Chemicals", image: "photos/chemicals.webp", description: "Specialty chemicals and construction admixtures from the PanVibes catalogue." },
  { name: "Indian Spices", image: "photos/spices.webp", description: "Indian spices supplied as part of our international product portfolio." },
  { name: "Nutraceutical", image: "photos/nutraceuticals.webp", description: "Moringa powder and ashwagandha for B2B ingredient sourcing enquiries." },
];
export const benefits = [
  {
    title: "Responsible trade",
    description:
      "Raising standards for ethical and responsible international trade.",
    icon: "shield",
  },
  {
    title: "Healthier products",
    description:
      "Supporting the transition to healthier, cleaner, and more sustainable products.",
    icon: "globe",
  },
  {
    title: "Intelligent sourcing",
    description:
      "Creating value through informed sourcing and an understanding of market needs.",
    icon: "contact",
  },
];
export const products: {name:string;image:string;sector:'food'|'industrial'}[] = [
  { name: "Makhana & Healthy Food Snacks", image: "photos/makhana.webp", sector:'food' },
  { name: "Dairy Products", image: "photos/dairy-v2.webp", sector:'food' },
  { name: "Dehydrated Vegetables", image: "photos/vegetables.webp", sector:'food' },
  { name: "Dehydrated Fruits", image: "photos/banana.webp", sector:'food' },
  { name: "Cashew & Other Dry Fruits", image: "photos/nuts.webp", sector:'food' },
  { name: "Spices", image: "photos/spices.webp", sector:'food' },
  { name: "Chemicals", image: "photos/chemicals.webp", sector:'industrial' },
  { name: "Nutraceuticals", image: "photos/nutraceuticals.webp", sector:'food' },
  { name: "Millets", image: "photos/millets.webp", sector:'food' },
  { name: "Aggregate", image: "photos/aggregate.webp", sector:'industrial' },
  { name: "Construction Admixtures", image: "photos/admixtures.webp", sector:'industrial' },
];
export const destinations: [string, number, number][] = shippingMarkets.map(market => [market.name.toUpperCase(), market.latitude, market.longitude]);
// The source site supplies no customer quotations or FAQ section.
export const testimonials: {
  quote: string;
  name: string;
  role: string;
  company: string;
}[] = [];
export const faqs: { question: string; answer: string }[] = [];
