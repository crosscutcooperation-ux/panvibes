import { moringaSpecification } from '@/lib/moringa';
import Image from 'next/image';
import Link from '@/components/SiteLink';
import PageShell from '@/components/PageShell';
import EnquiryButton from '@/components/EnquiryButton';
import StructuredData from '@/components/StructuredData';
import { BuyerFaqs } from '@/components/ProcurementContent';
import { exportProducts } from '@/lib/export-products';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Nutraceuticals — Moringa Powder & Ashwagandha',
  'Explore moringa powder and ashwagandha for B2B ingredient sourcing. Compare options, request specifications and COA, and discuss a bulk quotation with PanVibes Exim.',
  '/products/nutraceuticals',
);

const products = exportProducts.filter(product => ['moringa', 'ashwagandha'].includes(product.slug));

export default function NutraceuticalsPage() {
  return <PageShell><main className="buyer-main buyer-page buyer-product-page">
    <nav className="buyer-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span>Nutraceuticals</span></nav>
    <section className="buyer-hero">
      <div>
        <p className="buyer-eyebrow">PanVibes Exim / B2B ingredients</p>
        <h1>Nutraceuticals<br /><span>Moringa &amp; Ashwagandha.</span></h1>
        <p className="buyer-intro">Explore moringa powder and ashwagandha in one place. Compare the listed sourcing options, review your specification needs and request a bulk quotation for your business.</p>
        <div className="buyer-actions"><Link className="buyer-button buyer-button-primary" href="#moringa">Explore Moringa ↗</Link><Link className="buyer-button" href="#ashwagandha">Explore Ashwagandha ↗</Link></div>
      </div>
      <div className="buyer-hero-photo"><Image src="/images/photos/nutraceuticals.webp" alt="Nutraceutical ingredients" fill sizes="(max-width:991px) 100vw, 45vw" priority /></div>
    </section>
    {products.map(product => <section className="buyer-section" id={product.slug} aria-labelledby={`${product.slug}-title`} key={product.slug}>
      <p className="buyer-eyebrow">Nutraceutical ingredient</p>
      <h2 id={`${product.slug}-title`}>{product.name}</h2>
      <p>{product.intro}</p>
      <dl className="buyer-facts">
        <div><dt>Forms / options</dt><dd>{product.forms.join(' / ')}</dd></div>
        <div><dt>Grades / selection</dt><dd>{product.grades.join(' / ')}</dd></div>
        <div><dt>Buyer profiles</dt><dd>{product.buyers}</dd></div>
        <div><dt>Testing &amp; documentation</dt><dd>Full lab COA and specifications on request. Confirm product and lot coverage with the team.</dd></div>
      </dl>
      <div className="buyer-columns">
        <div><h3>Buy to a specification</h3><p>{product.buyingGuide}</p><h3>Applications to discuss</h3><ul>{product.applications.map(application => <li key={application}>{application}</li>)}</ul></div>
        <div className="buyer-panel"><h3>Include in your enquiry</h3><ul>{product.request.map(requirement => <li key={requirement}>{requirement}</li>)}</ul></div>
      </div>
      {product.slug === 'moringa' && <div className="buyer-table-scroll"><table className="buyer-spec-table"><caption>Moringa Leaf Powder — PanVibes specification sheet. Full lab COA on request.</caption><tbody>{moringaSpecification.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table></div>}
      <div className="buyer-actions">
        <EnquiryButton className="buyer-button buyer-button-primary" product={product.name} purpose="Bulk quotation">Request a {product.name} Quote ↗</EnquiryButton>
        <EnquiryButton className="buyer-button" product={product.name} purpose="COA and specifications">Get {product.name} COA &amp; Specifications ↗</EnquiryButton>
        <Link className="buyer-button" href={`/products/${product.slug}`}>Full {product.name} details ↗</Link>
      </div>
    </section>)}
    <section className="buyer-section buyer-panel">
      <p className="buyer-eyebrow">India / UK / USA / Europe / UAE</p>
      <h2>Plan your bulk order.</h2>
      <p>Discuss bulk or custom packaging, sample requirements, delivery destination and FOB / CIF / DDP terms. Availability, origin, minimum order quantity and documentation are confirmed for the selected product in your quotation.</p>
      <div className="buyer-resource-links"><Link href="/quality">Quality &amp; documentation ↗</Link><Link href="/export-from-india">Packaging &amp; export ↗</Link></div>
    </section>
    <BuyerFaqs faqs={products.flatMap(product => product.faqs)} />
    <StructuredData data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name: 'Nutraceuticals', path: '/products/nutraceuticals' }])} />
  </main></PageShell>;
}
