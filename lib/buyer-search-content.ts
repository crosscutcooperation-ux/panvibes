// Buyer-intent copy for the confirmed catalogue. These are content targets,
// not measured search volumes, stock promises or published specifications.
type BuyerContent = {
  title: string;
  heading: string;
  subheading: string;
  options: { name: string; use: string; confirm: string }[];
  faqs: { question: string; answer: string }[];
};

export const buyerSearchContent: Record<string, BuyerContent> = {
  'dehydrated-vegetables': {
    title: 'Dehydrated Vegetable Supplier India', heading: 'Dehydrated vegetable supplier', subheading: 'Bulk sourcing from India.',
    options: [
      { name: 'Whole pieces', use: 'Recipes that need a recognisable vegetable piece.', confirm: 'Vegetable, cut dimensions, rehydration behaviour and appearance.' },
      { name: 'Flakes', use: 'Seasonings, soups and instant-food ingredient procurement.', confirm: 'Cut size, broken pieces, moisture criteria and recipe trial.' },
      { name: 'Powders', use: 'Dry blends and food formulations requiring an even distribution.', confirm: 'Mesh or particle size, composition and required testing.' },
    ],
    faqs: [{ question: 'How can I compare bulk dehydrated vegetable quotations?', answer: 'Compare the same vegetable, form, cut or mesh size, testing requirements, packing and delivered quantity. Request samples against one acceptance brief; different forms or specifications are not directly comparable on price alone.' }],
  },
  ginger: {
    title: 'Ginger Powder & Flakes Supplier India', heading: 'Ginger supplier in India', subheading: 'Powder, flakes & whole ginger.',
    options: [
      { name: 'Ginger powder', use: 'Spice blends, bakery mixes and beverage ingredient development.', confirm: 'Mesh or particle size, aroma, moisture criteria and the intended formulation.' },
      { name: 'Ginger flakes', use: 'Applications where a visible ginger piece or subsequent processing is preferred.', confirm: 'Flake dimensions, appearance, preparation method and sample performance.' },
      { name: 'Whole ginger', use: 'Buyers who want to carry out their own size reduction or preparation.', confirm: 'The required product condition, size, grade and preparation process.' },
    ],
    faqs: [
      { question: 'Can I buy ginger powder in bulk from PanVibes Exim?', answer: 'Yes, bulk ginger powder enquiries are supported. PanVibes Exim is based in Navi Mumbai, India. Send your grade, mesh requirement, quantity, application and destination for a sourcing review and quotation; stock and commercial terms need confirmation.' },
      { question: 'What affects the wholesale price of ginger powder?', answer: 'Grade, specification, order quantity, testing, packaging and delivery terms can change the quotation. Request a price against a defined brief and compare the same specification, packing and freight scope. A current price is provided by the team rather than assumed on this page.' },
    ],
  },
  'turmeric-powder': {
    title: 'Bulk Turmeric Powder Supplier India', heading: 'Bulk turmeric powder supplier', subheading: 'Source to a curcumin brief.',
    options: [
      { name: 'Curcumin requirement', use: 'Buyers comparing the listed 1–5% curcumin sourcing options.', confirm: 'Target percentage, test method and lot-specific result.' },
      { name: 'Conventional or IPM', use: 'Ingredient purchasing against an agreed grade and destination brief.', confirm: 'Grade definition, residue criteria and available supporting reports.' },
      { name: 'Organic enquiry', use: 'A purchase requiring product-specific organic documentation.', confirm: 'Applicable certificate, product scope and validity before ordering.' },
    ],
    faqs: [{ question: 'How do I request a wholesale turmeric powder price?', answer: 'Specify the curcumin target, conventional/IPM/organic grade, powder requirements, quantity, packaging and delivery country. Ask for the applicable specification and COA so the price can be compared against the same sourcing brief.' }],
  },
  'moringa-powder': {
    title: 'Moringa Powder Bulk Supplier India', heading: 'Moringa powder bulk sourcing', subheading: 'Conventional & organic enquiries.',
    options: [
      { name: 'Conventional grade', use: 'Food and nutraceutical businesses sourcing to their ingredient specification.', confirm: 'Composition, particle size, colour and applicable laboratory requirements.' },
      { name: 'Organic grade enquiry', use: 'Buyers whose finished-product brief requires organic sourcing.', confirm: 'Product and lot coverage of the relevant organic documents.' },
      { name: 'Application review', use: 'Formulators comparing powder for a food, herbal or supplement application.', confirm: 'Recipe suitability, ingredient restrictions and destination requirements.' },
    ],
    faqs: [{ question: 'What should I check when selecting a moringa powder supplier?', answer: 'Review the specification, composition, sample, powder characteristics and applicable laboratory reports. If requesting organic material, check the certificate scope for the actual product and sourcing arrangement rather than relying on an organic label alone.' }],
  },
  makhana: {
    title: 'Makhana & Fox Nuts Wholesale Supplier India', heading: 'Wholesale makhana & fox nuts', subheading: 'Compare size and selection.',
    options: [
      { name: 'Size labels 4 to 6+', use: 'Snack brands and importers selecting a suitable visual size.', confirm: 'A representative sample and measurable size acceptance criteria.' },
      { name: 'Hand-picked selection', use: 'Enquiries requiring an agreed selection standard.', confirm: 'Appearance, broken-piece tolerance and current availability.' },
      { name: 'Non-hand-picked selection', use: 'Buyers assessing a different selection brief and price point.', confirm: 'The same sample, moisture, packaging and quality checks used in comparison.' },
    ],
    faqs: [{ question: 'How do I compare wholesale makhana prices?', answer: 'Use the same size label, selection standard, sample acceptance criteria, quantity and packing. Ask about broken pieces, moisture and delivery terms before comparing quotations. PanVibes confirms the available sourcing option against your requirement.' }],
  },
  'fruit-powders': {
    title: 'Fruit Powder Sourcing | Banana Powder', heading: 'Fruit powder for B2B buyers', subheading: 'Our listed option is banana.',
    options: [
      { name: 'Choose the listed product', use: 'Food businesses looking for banana powder.', confirm: 'Banana powder is the only fruit powder currently in this catalogue.' },
      { name: 'Define the composition', use: 'Comparing ingredient declarations for a formulation.', confirm: 'Carrier or additive restrictions and the actual product specification.' },
      { name: 'Review a bulk quotation', use: 'Moving from product exploration to a commercial sourcing brief.', confirm: 'Quantity, sample, packing, documentation and delivery destination.' },
    ],
    faqs: [],
  },
  'banana-powder': {
    title: 'Banana Powder Bulk Supplier India', heading: 'Banana powder bulk supplier', subheading: 'A defined ingredient brief.',
    options: [
      { name: 'Composition requirements', use: 'Bakeries, snack and beverage businesses reviewing ingredients.', confirm: 'The actual composition and any carrier or additive restrictions.' },
      { name: 'Powder characteristics', use: 'Comparing samples for handling and formulation.', confirm: 'Particle size, colour, moisture criteria and application performance.' },
      { name: 'Bulk procurement', use: 'Importers and manufacturers preparing a repeat purchasing brief.', confirm: 'Quantity, packing, food-safety documents and delivery terms.' },
    ],
    faqs: [{ question: 'Can I request a banana powder sample before a bulk order?', answer: 'Yes, include a sample request with your composition, application, quantity and destination. The team confirms sample availability and charges, then agrees the specification and acceptance criteria before a bulk quotation is finalised.' }],
  },
  ashwagandha: {
    title: 'Ashwagandha B2B Sourcing India', heading: 'Ashwagandha sourcing in India', subheading: 'Start with the specification.',
    options: [
      { name: 'Required form', use: 'Herbal and nutraceutical buyers defining what they need.', confirm: 'Specify the form; do not assume every form is stocked or available.' },
      { name: 'Quality and application brief', use: 'Comparing sourcing options against a finished-product requirement.', confirm: 'Composition, acceptance criteria, intended application and relevant reports.' },
      { name: 'Commercial enquiry', use: 'Buyers requesting a B2B sourcing discussion.', confirm: 'Quantity, packaging, destination and documentation before quotation.' },
    ],
    faqs: [{ question: 'Does this ashwagandha listing confirm an extract strength or medical benefit?', answer: 'No. The listing supports a B2B sourcing enquiry. Form, composition, any standardisation requirement and relevant documentation must be reviewed with the team. No medical benefit or unconfirmed extract specification is promised.' }],
  },
  spices: {
    title: 'Indian Spice & Spice Powder Supplier', heading: 'Indian spice supplier', subheading: 'Ginger and turmeric sourcing.',
    options: [
      { name: 'Ginger', use: 'Buying whole ginger, flakes or powder for further processing and blending.', confirm: 'Form, grade, particle size and destination testing requirements.' },
      { name: 'Turmeric powder', use: 'Food and ingredient procurement with a defined curcumin brief.', confirm: 'Listed curcumin option, grade and applicable COA.' },
      { name: 'Supplier comparison', use: 'Manufacturers and spice importers comparing commercial offers.', confirm: 'The same specification, quantity, packing and freight terms.' },
    ],
    faqs: [{ question: 'Which spices should I include in a PanVibes bulk enquiry?', answer: 'The spice sourcing pages cover ginger and turmeric. Use the individual product page to specify the ginger form or turmeric powder requirement, grade, quantity and destination. The team confirms the sourcing arrangement and applicable documentation.' }],
  },
};
