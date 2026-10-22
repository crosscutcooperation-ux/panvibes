import Link from '@/components/SiteLink';
import Image from 'next/image';
import { exportProducts, procurementFaqs } from '@/lib/export-products';
import StructuredData from './StructuredData';
import { faqSchema } from '@/lib/seo';

export function BuyerFaqs({ faqs = procurementFaqs }: { faqs?: { question: string; answer: string }[] }) {
  return <section className="buyer-section" aria-labelledby="buyer-faq-title">
    <p className="buyer-eyebrow">Before you order</p><h2 id="buyer-faq-title">Buyer questions, answered.</h2>
    <div className="buyer-faqs">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
    <StructuredData data={faqSchema(faqs)} />
  </section>;
}

export function IngredientLinks({ compact = false }: { compact?: boolean }) {
  return <section className="buyer-section" aria-labelledby="ingredient-pages-title">
    <div className="buyer-section-heading"><div><p className="buyer-eyebrow">India / UK / USA / Europe / UAE</p><h2 id="ingredient-pages-title">Ingredients for<br />your next order.</h2></div><p>Bulk sourcing for manufacturers, importers and distributors. Explore forms, grades and the information to include in your enquiry.</p></div>
    <div className={`buyer-product-grid ${compact ? 'buyer-product-grid-compact' : ''}`}>
      {exportProducts.filter(product => product.slug !== 'fruit-powders').map(product => <Link className="buyer-product-card" key={product.slug} href={`/products/${product.slug}`}>
        {!compact && <div className="buyer-product-image"><Image src={`/images/${product.image}`} alt={product.name} fill sizes="(max-width:650px) 100vw, (max-width:991px) 50vw, 25vw" /></div>}
        <span>{product.name}<span aria-hidden="true">↗</span></span><small>{product.forms.slice(0, 3).join(' / ')}</small>
      </Link>)}
    </div>
    <div className="buyer-resource-links"><Link href="/products/chemicals">Explore industrial chemicals ↗</Link><Link href="/quality">Quality &amp; documentation ↗</Link><Link href="/export-from-india">Packaging &amp; export ↗</Link></div>
  </section>;
}
