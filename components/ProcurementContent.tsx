import Link from '@/components/SiteLink';
import Image from 'next/image';
import { exportProducts, procurementFaqs } from '@/lib/export-products';
import StructuredData from './StructuredData';
import { faqSchema } from '@/lib/seo';
import { buyerGuides } from '@/lib/buyer-guides';

export function BuyerFaqs({ faqs = procurementFaqs }: { faqs?: { question: string; answer: string }[] }) {
  return <section className="buyer-section" aria-labelledby="buyer-faq-title">
    <p className="buyer-eyebrow">Before you order</p><h2 id="buyer-faq-title">Buyer questions, answered.</h2>
    <div className="buyer-faqs">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
    <StructuredData data={faqSchema(faqs)} />
  </section>;
}

export function IngredientLinks({ compact = false }: { compact?: boolean }) {
  return <section className="buyer-section" aria-labelledby="ingredient-pages-title">
    <div className="buyer-section-heading"><div><p className="buyer-eyebrow">India / UK / USA / Europe / UAE</p><h2 id="ingredient-pages-title">Bulk food ingredients<br />from India.</h2></div><p>Compare ginger, turmeric, moringa, makhana and other listed ingredients for manufacturers, importers and distributors. Choose a product to review forms, grades and quotation requirements.</p></div>
    <div className={`buyer-product-grid ${compact ? 'buyer-product-grid-compact' : ''}`}>
      {exportProducts.filter(product => product.slug !== 'fruit-powders').map(product => <Link className="buyer-product-card" key={product.slug} href={`/products/${product.slug}`}>
        {!compact && <div className="buyer-product-image"><Image src={`/images/${product.image}`} alt={product.name} fill sizes="(max-width:650px) 100vw, (max-width:991px) 50vw, 25vw" /></div>}
        <span>{product.name}<span aria-hidden="true">↗</span></span><small>{product.forms.slice(0, 3).join(' / ')}</small>
      </Link>)}
    </div>
    <div className="buyer-resource-links"><Link href="/products/chemicals">Explore industrial chemicals ↗</Link><Link href="/quality">Quality &amp; documentation ↗</Link><Link href="/export-from-india">Packaging &amp; export ↗</Link></div>
  </section>;
}

export function SupplierOverview() {
  return <section className="buyer-section" aria-labelledby="supplier-overview-title">
    <p className="buyer-eyebrow">PanVibes Exim / Navi Mumbai, India</p>
    <h2 id="supplier-overview-title">Your B2B ingredient sourcing brief.<br/>Our next conversation.</h2>
    <p>PanVibes Exim is an India-based food ingredient supplier and export partner for manufacturers, importers, wholesalers and distributors. Explore <Link href="/products/ginger">ginger powder, flakes and whole ginger</Link>, <Link href="/products/turmeric-powder">bulk turmeric powder</Link>, <Link href="/products/moringa-powder">moringa powder</Link> and <Link href="/products/makhana">wholesale makhana / fox nuts</Link>. Dehydrated vegetables, banana powder and ashwagandha sourcing are also listed in the catalogue.</p>
    <p>Industrial buyers can use the separate <Link href="/products/chemicals">chemical supplier directory</Link>. We ship only to India, the UK, the USA, Europe and the UAE. Product availability, specifications, packing and commercial terms are reviewed against your enquiry.</p>
    <div className="buyer-resource-links">{buyerGuides.map(guide=><Link key={guide.slug} href={`/guides/${guide.slug}`}>{guide.title} ↗</Link>)}</div>
  </section>;
}
