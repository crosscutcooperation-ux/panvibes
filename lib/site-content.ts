// Verified against panvibesexim.com on 14 October 2026. See content-sources.json.
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
    "+91 9987587873",
    "+91 9967653143",
    "+91 8655481884",
  ],
  heroTitle: "Your Vision, Our Expert Execution",
  heroDescription:
    "Comprehensive logistics solutions tailored to meet your business needs",
  tagline: "Faster. Reliable. Global.",
  overview: [
    "PanVibes Exim connects Indian suppliers with international markets, supporting food, nutrition, wellness and sustainable agriculture businesses.",
    "Our portfolio spans dehydrated agro products, nutraceutical ingredients, organic commodities, specialty chemicals and spices. We work with certified farms, manufacturing partners and formulation facilities, with a focus on purity, traceability and consistent quality.",
    "From sourcing to shipment, our approach combines innovation and integrity with timely delivery, regulatory compliance and lasting business relationships.",
  ],
  industryIntroduction: "A partner in global maritime transport, supporting the industries and products in our portfolio.",
  brochure: "https://www.panvibesexim.com/assets/E-Brochure.pdf",
  profile: "https://www.panvibesexim.com/assets/images/catlogue/profile.pdf",
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
    image: "air-freight.png",
    overview: "Global trade support combining sourcing, logistics and quality-focused distribution.",
    description:
      "Documentation, customs clearance, logistics coordination, and delivery support for international exports.",
    features: "Customs clearance / Documentation / Logistics coordination",
  },
  {
    title: ["Import", "solutions"],
    image: "warehouse.png",
    overview: "Warehousing facilities supported by inventory management and distribution capabilities.",
    description:
      "Import support covering port operations, customs requirements, and inland transport.",
    features: "Port handling / Customs compliance / Inland transport",
  },
  {
    title: ["Transport", "solutions"],
    image: "transport.png",
    overview: "Transportation services focused on timely, secure delivery across destinations.",
    description:
      "Road, rail, and multimodal transport with shipment tracking and delivery coordination.",
    features: "Road / Rail / Multimodal transport",
  },
  {
    title: ["Document", "verification"],
    image: "customs.png",
    overview: "Container handling and consolidation support for import and export operations.",
    description:
      "Verification and processing of shipping documents, including bills of lading, origin certificates, and commercial invoices.",
    features: "Bills of lading / Origin certificates / Commercial invoices",
  },
  {
    title: ["Freight", "forwarding"],
    image: "ocean-freight.png",
    overview: "Specialized storage for temperature-sensitive goods and bulk liquid cargo.",
    description:
      "Air, sea, and land freight, with cargo insurance and supply chain management.",
    features: "Air freight / Sea freight / Land transport",
  },
];
export const stats = [
  { value: 10, suffix: "+", label: "Product categories", description: "A portfolio of agro products, food, nutraceutical ingredients and specialty chemicals." },
  { value: 25, suffix: "+", label: "Subproduct categories", description: "Explore dehydrated produce, spices, dry fruits, snacks and more in our catalogue." },
  { value: 10, suffix: "+", label: "Countries served", description: "Connecting Indian supply with international markets through quality, traceability and reliable delivery." },
  { value: 5, suffix: "+", label: "Services provided", description: "Export, import, transport, document verification and freight forwarding support." },
];
export const industries = [
  { name: "Agriculture", image: "industry-agriculture.jpg", description: "Dehydrated fruits, vegetables and sprouts, millets, makhana and dry fruits." },
  { name: "Chemicals", image: "industry-chemicals.jpg", description: "Specialty chemicals and construction admixtures from the PanVibes catalogue." },
  { name: "Indian Spices", image: "industry-spices.jpg", description: "Indian spices supplied as part of our international product portfolio." },
  { name: "Nutraceutical", image: "industry-nutraceutical.jpg", description: "Ingredients for nutrition and wellness, with a focus on purity and traceability." },
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
  { name: "Makhana & Healthy Food Snacks", image: "product-makhana.jpg", sector:'food' },
  { name: "Dairy Products", image: "product-dairy.jpg", sector:'food' },
  { name: "Dehydrated Vegetables", image: "product-vegetables.jpg", sector:'food' },
  { name: "Dehydrated Fruits", image: "product-fruits.jpg", sector:'food' },
  { name: "Dehydrated Sprouts", image: "product-sprouts.jpg", sector:'food' },
  { name: "Cashew & Other Dry Fruits", image: "product-cashew.jpg", sector:'food' },
  { name: "Spices", image: "product-spices.jpg", sector:'food' },
  { name: "Chemicals", image: "product-chemicals.jpg", sector:'industrial' },
  { name: "Nutraceuticals", image: "product-nutraceuticals.jpg", sector:'food' },
  {
    name: "Indian Flavours Ready in Minutes",
    image: "product-ready-meals.jpg",
    sector:'food',
  },
  { name: "Millets", image: "product-millets.jpg", sector:'food' },
  { name: "Aggregate", image: "product-aggregate.jpg", sector:'industrial' },
  { name: "Construction Admixtures", image: "product-admixtures.jpg", sector:'industrial' },
];
export const destinations: [string, number, number][] = [
  ["INDIA", 19, 73],
  ["NEW ZEALAND", -41, 174],
  ["SPAIN", 40, -4],
  ["FRANCE", 47, 2],
  ["ITALY", 42, 13],
  ["AUSTRALIA", -27, 134],
  ["CANADA", 56, -106],
];
// The source site supplies no customer quotations or FAQ section.
export const testimonials: {
  quote: string;
  name: string;
  role: string;
  company: string;
}[] = [];
export const faqs: { question: string; answer: string }[] = [];
