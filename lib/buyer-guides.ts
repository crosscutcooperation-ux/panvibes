export type BuyerGuide = {
  slug: string; title: string; heading: string; description: string; published: string;
  intro: string; product: string; productPath: string;
  sections: { heading: string; paragraphs: string[]; points?: string[] }[];
};

export const buyerGuides: BuyerGuide[] = [
  {
    slug: 'ginger-powder-flakes-whole-buying-guide',
    title: 'Buying Ginger Powder, Flakes & Whole Ginger',
    heading: 'Buying ginger in bulk: powder, flakes or whole?',
    description: 'Compare ginger forms for B2B procurement. Build a bulk ginger quotation brief covering grade, mesh, samples, COA, packaging and delivery terms.',
    published: '2026-10-26', product: 'Ginger', productPath: '/products/ginger',
    intro: 'A useful ginger supplier quotation starts with how your business will use the ingredient. A powder for a dry seasoning blend and a visible flake for further preparation are different buying briefs. Compare the form and specification first, then the commercial offer.',
    sections: [
      { heading: 'Choose the form around your process', paragraphs: [
        'Ginger powder is a sourcing option for buyers who need a powdered ingredient for blending or formulation. Ask for the mesh or particle-size specification, composition, aroma and moisture criteria your process requires. A sample trial is more useful than assuming that every powder behaves the same way.',
        'Ginger flakes suit a brief requiring a visible piece or a subsequent preparation step. State the required dimensions and appearance, and describe how the flakes will be used. Whole ginger is another listed sourcing option; confirm the product condition and size, especially when you plan to prepare or grind it yourself.',
        'PanVibes Exim accepts enquiries for whole ginger, ginger flakes and ginger powder. The product page lists conventional, IPM and organic grade enquiries. Each sourcing arrangement, specification and availability needs confirmation.',
      ] },
      { heading: 'Compare quotations on the same basis', paragraphs: [
        'A wholesale ginger price is only comparable when the underlying requirement matches. Different grades, testing requirements, packing and freight scope can produce different quotations. Request a current price against your brief rather than comparing an advertised starting price with a fully specified delivered offer.',
      ], points: ['Same form, grade and particle or cut size.', 'Same ordered quantity and packaging requirement.', 'Same testing, documentation and sample acceptance criteria.', 'Same delivery location, freight scope and commercial terms.'] },
      { heading: 'Ask for documents that cover the actual product', paragraphs: [
        'Request the product specification and the applicable certificate of analysis (COA). Check which product or lot a report covers and whether its test methods address your acceptance criteria. A document for another material or an older sourcing arrangement is not a substitute for the evidence your purchase requires.',
        'If requesting organic ginger, confirm the certificate scope and validity for the proposed product and supply arrangement. Include the residue, microbiological and other testing requirements applicable to your buyer and destination. This guide does not replace your importer or technical team’s review.',
      ] },
      { heading: 'Use a sample to agree acceptance criteria', paragraphs: [
        'Ask whether a representative sample is available and whether charges apply. Review the sample in your own process: appearance and aroma matter, but so do handling, blending or preparation behaviour. Record the agreed specification and how the supplied product will be assessed.',
        'Before a repeat order, refer back to the agreed brief and confirm any changed grade, volume, packing or delivery requirement. Avoid assuming that a sample request reserves stock or fixes a future price.',
      ] },
      { heading: 'Send a complete ginger sourcing enquiry', paragraphs: [
        'Tell PanVibes Exim your company, ginger form, grade, mesh or cut-size requirement, quantity, application, delivery city and country, packaging and required documents. The team reviews availability, sample arrangements and commercial terms before confirming a quotation.',
        'PanVibes Exim is based in Navi Mumbai, India. Shipping coverage is limited to India, the UK, the USA, Europe and the UAE. For Europe, specify the country and city so that the actual delivery requirement can be reviewed.',
      ] },
    ],
  },
  {
    slug: 'bulk-ingredient-quotation-checklist',
    title: 'Bulk Ingredient RFQ & Supplier Checklist',
    heading: 'A bulk ingredient quotation you can actually compare.',
    description: 'A practical B2B ingredient RFQ checklist: product specification, quantity, samples, COA, packaging and delivery terms for supplier enquiries.',
    published: '2026-10-26', product: 'Food ingredients', productPath: '/products',
    intro: 'Sending only a product name and asking for the best price leaves a supplier guessing. A request for quotation (RFQ) should describe the same requirement to each supplier, so your purchasing team can compare what is included and identify what still needs confirmation.',
    sections: [
      { heading: '1. Identify the ingredient and its purpose', paragraphs: [
        'Give the product name, required form and intended application. For dehydrated vegetables, specify the vegetable and whether you need whole pieces, flakes or powder. For ginger, state whole, flakes or powder. For turmeric powder, include the curcumin requirement. For makhana, identify the listed size and selection preference.',
        'PanVibes’ current ingredient pages cover dehydrated vegetables, ginger, turmeric powder, moringa powder, ashwagandha, makhana and banana powder. Banana is the only fruit powder currently listed. Do not use a broad category name as confirmation that every ingredient in that category is available.',
      ] },
      { heading: '2. Set the technical acceptance brief', paragraphs: [
        'Describe the product characteristics your process needs. Depending on the ingredient, this may include composition, particle or cut size, colour, aroma, moisture criteria and ingredient restrictions. Ask your technical team which microbiological, residue or contaminant reports are relevant to the application and destination.',
        'Request the applicable specification, COA and supporting reports. If you need a particular certification, identify it and check the actual product scope and validity. A sourcing enquiry does not by itself confirm that a certificate is available for an order.',
      ] },
      { heading: '3. Define quantity, packaging and timing', paragraphs: [
        'State the quantity and unit, preferred packing size or material, expected purchase frequency and required delivery date. Ask the team to confirm MOQ, pack configuration and lead time for that sourcing arrangement. A form’s quantity example is not a product-wide minimum-order guarantee.',
        'If requesting a sample, explain the trial quantity and your acceptance process. Confirm availability, any sample charges and how the sample relates to the proposed order before treating it as an approval sample.',
      ] },
      { heading: '4. Make the delivery terms comparable', paragraphs: [
        'Include the delivery city and country, not just the market name. Agree freight scope, delivery responsibilities and commercial terms with the team. When comparing offers, identify whether packaging, testing, transport and other required services are included or quoted separately.',
        'PanVibes Exim ships only to India, the UK, the USA, Europe and the UAE. Product eligibility, documentation and logistics are reviewed for each order. A European enquiry should name the actual country and delivery city.',
      ] },
      { heading: '5. Review the supplier’s reply before ordering', paragraphs: [
        'A useful reply should make clear which requirement can be met, which documents are available, the quoted specification and quantity, and the items awaiting confirmation. Resolve any difference between your RFQ, the sample, the specification and the quotation before agreeing an order.',
      ], points: ['Identify the business and the contact responsible for the quote.', 'Check product and lot coverage of the proposed documents.', 'Compare the same specification, packing, quantity and delivery scope.', 'Confirm sample acceptance, commercial terms and any remaining conditions in writing.'] },
    ],
  },
];
