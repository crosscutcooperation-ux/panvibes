import knowledge from './assistant-knowledge.json';
import { services } from './site-content';
import chemicals from './chemicals.json';
import { exportProducts } from './export-products';
import { company } from './site-content';
import { shippingCoverage } from './shipping';

export type AssistantReply = { text: string; links?: { label: string; href: string }[] };
export function answerEnquiry(message: string): AssistantReply {
  const query = message.normalize('NFKC').toLowerCase();
  const product = exportProducts.find(item => query.includes(item.name.toLowerCase().split(' / ')[0]) || query.includes(item.slug.replaceAll('-', ' ')) || (['ginger', 'turmeric-powder', 'moringa-powder', 'banana-powder', 'makhana'].includes(item.slug) && new RegExp(`\\b${item.slug.split('-')[0]}\\b`).test(query)))
    ?? (query.includes('fox nut') ? exportProducts.find(item => item.slug === 'makhana') : undefined);
  const contactLink = { label: 'Prepare an enquiry', href: `/contact${product ? `?product=${encodeURIComponent(product.name)}` : ''}` };
  if (/\b(ship|ships|shipping|deliver|destinations?|countries|markets?)\b|\b(canada|australia|new zealand|singapore|africa|asia)\b/.test(query)) return {
    text: `${shippingCoverage} We do not offer shipping outside these markets. For Europe, include the delivery country and city. Product eligibility, packaging, documentation and logistics are reviewed for each order.`, links: [{ label: 'Shipping destinations & packaging', href: '/export-from-india' }, contactLink],
  };
  if (/price|cost|moq|minimum|stock|available|availability|lead time|delivery date/.test(query)) return {
    text: 'Price, MOQ, stock and lead time need confirmation from our export team. Include the product, grade, quantity, packaging and delivery country so they can review your requirement.', links: [contactLink],
  };
  if (/coa|specification|certificate|certification|testing|laboratory|sds|msds|organic|compliance/.test(query)) return {
    text: 'Request the relevant product specification, COA, laboratory reports or SDS/MSDS where applicable. The team confirms availability and the product or lot covered. For an organic request, ask for the exact certificate and product scope.', links: [{ label: 'Quality & documentation', href: '/quality' }, contactLink],
  };
  if (/sample/.test(query)) return { text: 'You can request a sample for review. Availability, charges and sample arrangements are confirmed by the team. Include your product, grade, application and delivery country.', links: [{ label: 'Request a sample', href: `/contact?purpose=Sample%20request${product ? `&product=${encodeURIComponent(product.name)}` : ''}` }] };
  const aboutLink = { label: 'Meet our founder & team', href: '/about' };
  if (/founder|founded|prakash|owner|started|established by/.test(query)) return { text: knowledge.founder.name + ' is the founder of ' + company.legalName + '. ' + knowledge.founder.biography, links: [aboutLink] };
  const leader = knowledge.leadership.find(person => query.includes(person.name.toLowerCase().split(' ')[0]));
  if (leader) return { text: leader.name + ' is ' + leader.role + ' at ' + company.legalName + '.', links: [aboutLink] };
  if (/leadership|directors?|team|management/.test(query)) return { text: knowledge.leadership.map(person => person.name + ' — ' + person.role).join('; ') + '.', links: [aboutLink] };
  if (/who (are|is)|about (you|panvibes|company)|what (is|does) panvibes/.test(query)) return { text: company.legalName + ': ' + knowledge.business + ' Founder: ' + knowledge.founder.name + '.', links: [aboutLink] };
  if (/services?|freight|customs|import support|transport|documentation/.test(query)) return { text: services.map(service => service.title.join(' ') + ': ' + service.description).join('\n'), links: [{label:'Our services',href:'/services'}] };
  if (/address|office|located|location|phone|telephone/.test(query)) return { text: company.address + '. Phone: ' + company.phones.join(', ') + '. Email: ' + company.email + '.', links:[{label:'Office & directions',href:'/contact'}] };
  if (product) return { text: `${product.intro}\nListed options: ${product.forms.join(', ')}.`, links: [{ label: `Explore ${product.name}`, href: `/products/${product.slug}` }, contactLink] };
  const chemical = chemicals.groups.find(group => query.includes(group.name.toLowerCase()) || group.products.some(name => query.includes(name.normalize('NFKC').toLowerCase().split(' (')[0])));
  if (chemical || /chemical|caustic|soda ash|hcl|h2so4|hno3|pac/.test(query)) return {
    text: chemical ? `${chemical.name}: ${chemical.products.join(', ')}. Share the required grade, purity or concentration, quantity and destination for a sourcing enquiry.` : 'Our chemical directory covers nine groups, including acids, alkalis, chlorides, sulphates, phosphates, oxides and water treatment chemicals. Use the directory to search for a product and start an enquiry.',
    links: [{ label: 'Explore chemicals', href: `/products/chemicals${chemical ? `#${chemical.slug}` : ''}` }, contactLink],
  };
  if (/\b(export|packaging|usa|uk|uae|india|europe|france|country|delivery)\b/.test(query)) return {
    text: `${shippingCoverage} Product eligibility, packaging, documentation and logistics are reviewed for each order. Share the product, quantity and delivery country.`, links: [{ label: 'Shipping destinations & packaging', href: '/export-from-india' }, contactLink],
  };
  if (/email|contact|human|person|sales|quote|quotation/.test(query)) return { text: `Contact export sales at ${company.email}. Submitted enquiries are saved securely and emailed to the PanVibes team. You receive a reference number and can also open an optional email summary. Include your company, product, grade, quantity and country.`, links: [contactLink, { label: 'Email export sales', href: `mailto:${company.email}` }] };
  if (/catalog|product|ingredient|range/.test(query)) return { text: 'Explore dehydrated vegetables, ginger, turmeric powder, moringa powder, ashwagandha, makhana / fox nuts and banana powder, plus our separate industrial chemical range.', links: [{ label: 'Food & nutrition', href: '/products#ingredient-pages-title' }, { label: 'Industrial chemicals', href: '/products/chemicals' }] };
  return { text: 'I can help you find products, chemical groups, documentation guidance and export enquiry options from this website. Try “ginger”, “chemicals”, “COA” or “export markets”. For other questions, our export team can help.', links: [contactLink] };
}
