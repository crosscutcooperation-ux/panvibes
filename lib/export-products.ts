// Product options supplied in the owner's marketing master document (17 October 2026).
// Numeric QC limits, prices, MOQ, certificates and delivery promises are intentionally not inferred.
export type ExportProduct = {
  slug: string; name: string; title: string; description: string; image: string; origin?: string;
  intro: string; forms: string[]; grades: string[]; buyers: string;
  applications: string[]; buyingGuide: string; request: string[];
  faqs: { question: string; answer: string }[];
};

export const exportProducts: ExportProduct[] = [
  {
    slug: 'dehydrated-vegetables', name: 'Dehydrated Vegetables', title: 'Dehydrated Vegetable Supplier & Exporter India',
    description: 'Source dehydrated vegetables from India for B2B ingredient procurement. Discuss whole, flake and powder forms, bulk quantities and export documentation.',
    image: 'photos/vegetables.webp',
    intro: 'PanVibes Exim supplies dehydrated vegetables from India for food manufacturers, ingredient distributors and importers. Discuss your required vegetable, form and specification with our export team.',
    forms: ['Whole', 'Flakes', 'Powder'], grades: ['Product-specific grades on request'],
    buyers: 'Food manufacturers, ingredient importers, seasoning companies and distributors.',
    applications: ['Ready-to-eat and instant foods', 'Sauces and seasoning blends', 'Bakery and snack ingredient sourcing'],
    buyingGuide: 'Start with the vegetable and the role it plays in your recipe. Whole pieces, flakes and powders need different appearance and particle-size requirements. Ginger, garlic, tomato, beetroot, carrot and onion are listed in our portfolio; confirm the available form for each product before ordering.',
    request: ['Vegetable and required form', 'Particle size or mesh specification', 'Grade, volume and delivery country', 'Microbiology and residue requirements'],
    faqs: [
      { question: 'Which dehydrated vegetables can I enquire about?', answer: 'Our portfolio lists ginger, garlic, tomato, beetroot, carrot and onion. Share the vegetable and form you need so the team can confirm current sourcing availability.' },
      { question: 'Can I request vegetable powders in bulk?', answer: 'Yes. Send the required vegetable, powder specification, quantity, application and destination. MOQ, packaging and lead time are confirmed in the quotation.' },
    ],
  },
  {
    slug: 'ginger', name: 'Ginger', title: 'Ginger Powder, Flakes & Whole Ginger Exporter India',
    description: 'Enquire about Indian ginger whole, flakes and powder in conventional, IPM and organic grades. Bulk sourcing for food manufacturers and ingredient importers.',
    image: 'photos/vegetables.webp',
    intro: 'Source Indian ginger in whole, flake or powder form through PanVibes Exim. Conventional, IPM and organic grade enquiries are supported for international B2B buyers, subject to specification and availability confirmation.',
    forms: ['Ginger Whole', 'Ginger Flakes', 'Ginger Powder'], grades: ['Conventional', 'IPM', 'Organic'],
    buyers: 'Spice importers, food manufacturers, ingredient distributors and seasoning companies.',
    applications: ['Seasoning blends', 'Food and beverage manufacturing', 'Ready-to-eat and instant food ingredients'],
    buyingGuide: 'Choose whole ginger when your process includes further preparation, flakes when a visible ingredient is required, and powder when particle size and blending matter. Specify your grade and destination-market testing requirements alongside the form. Organic documentation must be checked for the specific product and lot.',
    request: ['Whole, flakes or powder', 'Conventional, IPM or organic grade', 'Moisture and particle-size requirements', 'Required quantity and delivery country'],
    faqs: [
      { question: 'What ginger forms and grades can I request?', answer: 'Request whole ginger, ginger flakes or ginger powder in conventional, IPM or organic grades. The team confirms the sourcing option and relevant documentation for your requirement.' },
      { question: 'How do I request a bulk ginger powder quotation?', answer: 'Send your grade, mesh or particle-size requirement, quantity, application and destination country. Ask for the relevant specification, laboratory reports and packaging details with the quote.' },
    ],
  },
  {
    slug: 'turmeric-powder', name: 'Turmeric Powder', title: 'Bulk Turmeric Powder Supplier & Exporter India',
    description: 'Request turmeric powder from India with 1–5% curcumin options and conventional, IPM or organic grade enquiries. Get product specifications and a bulk quote.',
    image: 'photos/spices.webp',
    intro: 'PanVibes Exim supports bulk turmeric powder sourcing from India, with listed curcumin options from 1% to 5%. Enquire about conventional, IPM and organic grades for your food or ingredient business.',
    forms: ['Turmeric Powder'], grades: ['Conventional', 'IPM', 'Organic'],
    buyers: 'Spice companies, food manufacturers, ingredient distributors and nutraceutical buyers.',
    applications: ['Spice and seasoning blends', 'Food manufacturing', 'Functional ingredient procurement subject to specification'],
    buyingGuide: 'The listed curcumin options are 1%, 2%, 3%, 4% and 5%. State the percentage your formulation requires and request the applicable test method and lot report. Curcumin percentage alone does not establish overall product quality: colour, moisture, particle size, microbiology and residue criteria also belong in your purchase specification.',
    request: ['Curcumin option: 1%, 2%, 3%, 4% or 5%', 'Grade and intended application', 'Colour, mesh and moisture criteria', 'Testing requirements, quantity and destination'],
    faqs: [
      { question: 'Which curcumin percentages are listed for turmeric powder?', answer: 'The listed sourcing options are 1%, 2%, 3%, 4% and 5% curcumin. Confirm the exact grade, test method, availability and lot-specific result with export sales.' },
      { question: 'Can I enquire about organic turmeric powder?', answer: 'Yes. Include organic grade in your enquiry and request the applicable certification and product scope before ordering. Certification is confirmed for the specific sourcing arrangement.' },
    ],
  },
  {
    slug: 'moringa-powder', name: 'Moringa Powder', title: 'Moringa Powder Bulk Supplier & Exporter India',
    description: 'Enquire about conventional and organic moringa powder from India for food, nutraceutical and supplement businesses. Request specifications and bulk supply details.',
    image: 'photos/nutraceuticals.webp',
    intro: 'PanVibes Exim lists conventional and organic moringa powder for international B2B sourcing. Discuss your ingredient specification, intended application and destination with our export team.',
    forms: ['Moringa Powder'], grades: ['Conventional', 'Organic'],
    buyers: 'Food manufacturers, nutraceutical businesses, supplement companies, herbal product manufacturers and ingredient distributors.',
    applications: ['Functional-food ingredient sourcing', 'Nutraceutical ingredient procurement', 'Herbal product and supplement manufacturing'],
    buyingGuide: 'Select conventional or organic sourcing according to your product brief. Share your powder requirements and destination-specific limits so the team can discuss the applicable specification, testing and documentation. Product suitability and any certification need confirmation before purchase.',
    request: ['Conventional or organic grade', 'Particle-size, appearance and moisture requirements', 'Microbiology, heavy metals and pesticide criteria', 'Application, volume and delivery destination'],
    faqs: [
      { question: 'Is conventional and organic moringa powder listed?', answer: 'Yes. Both conventional and organic moringa powder are listed. Ask the team to confirm availability and the relevant product documentation for your order.' },
      { question: 'What should a bulk moringa powder enquiry include?', answer: 'Include grade, application, quantity, delivery country and required testing or certification. Request a product specification and applicable laboratory documentation for review.' },
    ],
  },
  {
    slug: 'makhana', name: 'Makhana / Fox Nuts', title: 'Makhana & Fox Nuts Bulk Supplier & Exporter India',
    description: 'Source makhana / fox nuts from India in sizes 4, 4+, 5, 5+, 6 and 6+. Discuss hand-picked selection, bulk packaging, samples and export requirements.',
    image: 'photos/makhana.webp',
    intro: 'PanVibes Exim lists makhana, also known as fox nuts, for bulk international buyers. Size options include 4, 4+, 5, 5+, 6 and 6+, with hand-picked and non-hand-picked selection enquiries.',
    forms: ['Makhana 4', 'Makhana 4+', 'Makhana 5', 'Makhana 5+', 'Makhana 6', 'Makhana 6+'], grades: ['Hand-picked', 'Non-hand-picked'],
    buyers: 'Snack manufacturers, food importers, ingredient distributors and private-label brands.',
    applications: ['Snack manufacturing', 'Retail and wholesale sourcing', 'Private-label product discussions'],
    buyingGuide: 'Use the listed size labels to start a sourcing conversation, then agree a sample and measurable acceptance criteria. Size labels do not replace a specification. State your selection preference and ask about appearance, broken-piece tolerance, moisture, packaging and the applicable laboratory documentation.',
    request: ['Size: 4, 4+, 5, 5+, 6 or 6+', 'Hand-picked or non-hand-picked selection', 'Quantity, packaging and sample requirements', 'Destination and required delivery date'],
    faqs: [
      { question: 'Which makhana sizes can I request?', answer: 'The listed sizes are 4, 4+, 5, 5+, 6 and 6+. Request a sample and an agreed specification to confirm the size and quality criteria for your order.' },
      { question: 'Is hand-picked makhana available to enquire about?', answer: 'Yes. Both hand-picked and non-hand-picked selection options are listed. Confirm availability, packaging, quantity and applicable testing with export sales.' },
    ],
  },
  {
    slug: 'fruit-powders', name: 'Fruit Powders', title: 'Fruit Powder Supplier for B2B Export from India',
    description: 'Explore banana powder, the fruit powder in the PanVibes Exim catalog, for international B2B buyers. Request specifications, documentation and a bulk quotation.',
    image: 'photos/banana.webp',
    intro: 'Our fruit powder catalog contains banana powder. Discuss your banana powder specification, application and bulk requirement with PanVibes Exim for international B2B ingredient sourcing.',
    forms: ['Banana Powder'], grades: ['Product-specific grades on request'],
    buyers: 'Food manufacturers, ingredient importers, bakery businesses and distributors.',
    applications: ['Food ingredient formulation', 'Bakery ingredient procurement', 'Beverage and snack ingredient discussions'],
    buyingGuide: 'Specify the banana powder composition your application needs, including any carrier or additive restrictions. Confirm appearance, particle size, storage requirements, applicable documentation and availability with the team before agreeing an order.',
    request: ['Fruit and required composition', 'Application and ingredient restrictions', 'Powder specification and quantity', 'Destination and documentation requirements'],
    faqs: [
      { question: 'Which fruit powder is in the catalog?', answer: 'Banana powder is the only product in our dehydrated fruit and fruit powder catalog.' },
      { question: 'How do I obtain a fruit powder specification?', answer: 'Tell the export team the fruit, intended application, composition requirements and quantity. Request the relevant specification and applicable test reports before agreeing an order.' },
    ],
  },
  {
    slug: 'banana-powder', name: 'Banana Powder', title: 'Banana Powder Supplier & Exporter India',
    description: 'Request banana powder from India for international B2B ingredient sourcing. Discuss specifications, food-safety documentation, bulk packaging and export requirements.',
    image: 'photos/banana.webp',
    intro: 'Banana powder is available to enquire about through PanVibes Exim for international B2B ingredient sourcing. Request the product specification and relevant food-safety and laboratory documentation for your intended market.',
    forms: ['Banana Powder'], grades: ['Specification and grade confirmed on enquiry'],
    buyers: 'International food manufacturers, ingredient distributors and importers.',
    applications: ['Food manufacturing', 'Bakery ingredient sourcing', 'Ingredient distribution'],
    buyingGuide: 'Define the banana powder your formulation requires before comparing quotations. Ask about composition, appearance, particle size, moisture, packaging and storage. Market-specific documentation must be reviewed for the actual product and sourcing facility; no blanket product-approval claim is made.',
    request: ['Composition and intended application', 'Powder specification and required tests', 'Bulk quantity and packaging preference', 'Delivery market and documentation needs'],
    faqs: [
      { question: 'What documentation can I request for banana powder?', answer: 'Request the relevant specification and applicable food-safety and laboratory documentation. The export team confirms which documents cover the product and sourcing arrangement for your enquiry.' },
      { question: 'How is banana powder pricing confirmed?', answer: 'Pricing, MOQ, packaging and lead time are quoted after the team reviews your required specification, quantity and delivery destination.' },
    ],
  },
  {
    slug: 'ashwagandha', name: 'Ashwagandha', title: 'Ashwagandha B2B Ingredient Sourcing',
    description: 'Discuss ashwagandha sourcing with PanVibes Exim. Share the required form, specification, quantity, destination and documentation needs for a B2B enquiry.',
    image: 'photos/nutraceuticals.webp', origin: 'Confirmed with the product quotation',
    intro: 'Ashwagandha is listed alongside moringa powder in the PanVibes Exim nutraceutical portfolio. Share your required form and ingredient specification so our team can review a B2B sourcing enquiry.',
    forms: ['Required form confirmed on enquiry'], grades: ['Buyer specification on enquiry'],
    buyers: 'Ingredient distributors and businesses evaluating nutraceutical ingredient sourcing.',
    applications: ['B2B ingredient procurement subject to the required form and specification'],
    buyingGuide: 'State the form and specification you require rather than assuming a powder, extract or standardized grade. Ask the team to confirm the product identity, origin, documentation, packaging and availability before purchase.',
    request: ['Required form and product specification', 'Intended business application', 'Quantity, packaging and delivery country', 'Required testing and documentation'],
    faqs: [
      { question: 'What information is needed for an ashwagandha enquiry?', answer: 'Include your required form, specification, quantity, application, destination and documentation requirements. The team confirms which sourcing option can be offered.' },
      { question: 'Are grades, origin or specifications published for ashwagandha?', answer: 'No fixed grade, origin, active-content percentage or technical limits are assumed. Request confirmed product details with your quotation.' },
    ],
  },
  {
    slug: 'spices', name: 'Spices & Spice Powders', title: 'Indian Spice & Spice Powder Supplier for Bulk Export',
    description: 'Source spices and spice powders from India through PanVibes Exim. Explore ginger and turmeric options and discuss bulk ingredient and export requirements.',
    image: 'photos/spices.webp',
    intro: 'PanVibes Exim supports Indian spice and spice powder sourcing for B2B buyers. Explore ginger and turmeric options alongside the vanilla beans and saffron listed in the broader product portfolio.',
    forms: ['Ginger Whole, Flakes & Powder', 'Turmeric Powder', 'Vanilla Beans', 'Saffron'], grades: ['Product-specific grades on enquiry'],
    buyers: 'Spice importers, seasoning manufacturers, food companies and ingredient distributors.',
    applications: ['Spice blending and seasoning', 'Food ingredient manufacturing', 'Wholesale ingredient distribution'],
    buyingGuide: 'Build your brief around the specific spice, form, grade and destination. Ginger and turmeric have different sourcing options; a grade listed for one product should not be assumed for another. Send any microbiology, residue, colour or active-content requirements with your bulk enquiry.',
    request: ['Spice, form and grade', 'Application and quality criteria', 'Bulk quantity and purchase frequency', 'Destination and required documentation'],
    faqs: [
      { question: 'Which spice powders are featured?', answer: 'Ginger powder and turmeric powder have dedicated sourcing pages. Turmeric enquiries can specify listed curcumin options from 1% to 5%; ginger enquiries can specify whole, flakes or powder.' },
      { question: 'Can I enquire about other spices?', answer: 'Yes. Send your product list, specifications and quantity to export sales for sourcing confirmation. Vanilla beans and saffron are also listed in the broader portfolio.' },
    ],
  },
];

export const procurementFaqs = [
  { question: 'What does PanVibes Exim supply?', answer: 'PanVibes Exim is an India-based B2B supplier and exporter of dehydrated vegetables, ginger, turmeric powder, moringa powder, ashwagandha, makhana / fox nuts and banana powder. A separate industrial portfolio lists chemicals, aggregates and construction admixtures.' },
  { question: 'Where does PanVibes Exim ship?', answer: 'We ship only to India, the UK, the USA, Europe and the UAE. For European deliveries, specify the country and city. Product eligibility, documentation, logistics and delivery terms are confirmed for each order.' },
  { question: 'What is the minimum order quantity?', answer: 'MOQ is confirmed per product, grade, packaging and sourcing arrangement. Send your required quantity and destination to receive a suitable quotation.' },
  { question: 'Can I request a sample, COA or specification?', answer: 'Yes. Request a sample, certificate of analysis or product specification with your enquiry. The team confirms availability, applicable product or lot coverage, and any sample charges before proceeding.' },
  { question: 'How do I request a bulk quotation?', answer: 'Share your company, product, form or grade, quantity, application, delivery country and required testing or certifications. Contact info@panvibesexim.com or use the enquiry form to prepare an email.' },
];
