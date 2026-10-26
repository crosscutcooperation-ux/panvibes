import EnquiryButton from '@/components/EnquiryButton';
import Link from '@/components/SiteLink';
import Image from 'next/image';
import PageShell from '@/components/PageShell';
import StructuredData from '@/components/StructuredData';
import { BuyerFaqs } from '@/components/ProcurementContent';
import { breadcrumbSchema, organizationId, pageMetadata, siteUrl } from '@/lib/seo';
import chemicals from '@/lib/chemicals.json';
import ChemicalCatalogue from './ChemicalCatalogue';

export const metadata = pageMetadata('Industrial Chemical Supplier India', 'Source industrial chemicals from India: acids, caustic soda, chlorides, sulphates, phosphates and water treatment chemicals. Request a specification-led B2B quote.', '/products/chemicals');
const faqs = [
  { question: 'Which chemical groups are listed?', answer: 'The catalog lists acids, alkalis and bases, chlorides, sulphates, phosphates, oxides, water treatment chemicals, industrial salts and heavy metal salts.' },
  { question: 'How do I request a chemical quotation?', answer: 'Send the chemical name, required grade and concentration or purity, quantity, application, packaging and destination. Ask for the applicable specification, certificate of analysis and SDS. Availability and shipment requirements are confirmed before quotation.' },
  { question: 'Are prices, purity and stock levels published?', answer: 'No. Prices, purity, grades, packing sizes, MOQ and current availability are confirmed against your requirement. A catalog listing is an invitation to enquire, rather than a stock or certification guarantee.' },
];

export default function ChemicalsPage() {
  return <PageShell><main className="buyer-page buyer-main">
    <nav className="buyer-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span>Chemicals</span></nav>
    <section className="buyer-hero"><div><p className="buyer-eyebrow">PanVibes Exim / Industrial portfolio</p><h1>Industrial chemical sourcing.<br /><span>From India, to your brief.</span></h1><p className="buyer-intro">Compare listed acids, alkalis, industrial salts and water treatment chemicals for B2B procurement. PanVibes Exim supports chemical sourcing enquiries from Navi Mumbai, India. Share the chemical name, grade, purity or concentration, quantity and destination for review.</p><div className="buyer-actions"><EnquiryButton className="buyer-button buyer-button-primary" product="Industrial chemicals">Request a chemical quote ↗</EnquiryButton><a className="buyer-button" href="#chemical-list-title">Explore the list ↓</a></div></div><div className="buyer-hero-photo"><Image src="/images/product-chemicals.jpg" alt="Industrial chemical product portfolio" fill sizes="(max-width:991px) 100vw, 45vw" priority /></div></section>
    <ChemicalCatalogue />
    <section className="buyer-section buyer-panel"><h2>Tell us the specification.</h2><p>Include the chemical name, required grade, concentration or purity, quantity, application, packaging and delivery country. Request the applicable SDS/MSDS, COA and product specification for review. Product availability, handling, transport and documentation requirements are confirmed for the order.</p><div className="buyer-actions"><EnquiryButton className="buyer-button" product="Industrial chemicals" purpose="SDS and specifications">Request SDS &amp; specifications ↗</EnquiryButton><Link className="buyer-button" href="/quality">Documentation guide ↗</Link></div></section>
    <BuyerFaqs faqs={faqs} />
    <StructuredData data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name: 'Chemicals', path: '/products/chemicals' }])} />
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Industrial chemical directory', url: `${siteUrl}/products/chemicals`, publisher: { '@id': organizationId }, mainEntity: { '@type': 'ItemList', itemListElement: chemicals.groups.map((group, i) => ({ '@type': 'ListItem', position: i + 1, name: group.name, url: `${siteUrl}/products/chemicals#${group.slug}`, item: { '@type': 'ItemList', name: group.name, itemListElement: group.products.map((name, j) => ({ '@type': 'ListItem', position: j + 1, name })) } })) } }} />
  </main></PageShell>;
}
