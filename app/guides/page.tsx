import Link from '@/components/SiteLink';
import PageShell from '@/components/PageShell';
import StructuredData from '@/components/StructuredData';
import { buyerGuides } from '@/lib/buyer-guides';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

export const metadata=pageMetadata('B2B Ingredient Buying Guides', 'Practical guides for buying ginger and bulk food ingredients: product forms, supplier comparisons, RFQ requirements, samples, COA and shipping terms.', '/guides');

export default function BuyerGuidesPage(){
  return <PageShell><main className="buyer-main buyer-page">
    <nav className="buyer-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Buyer guides</span></nav>
    <p className="buyer-eyebrow">PanVibes Exim / Procurement resources</p>
    <h1 className="buyer-page-title">Buying ingredients<br/>with a clear brief.</h1>
    <p className="buyer-intro">Compare product forms, prepare a useful request for quotation and identify what a supplier still needs to confirm. These guides support B2B enquiries for the ingredients in our catalogue.</p>
    <section className="buyer-section buyer-columns" aria-label="Ingredient buying guides">{buyerGuides.map(guide=><article className="buyer-panel" key={guide.slug}><h2><Link href={`/guides/${guide.slug}`}>{guide.heading}</Link></h2><p>{guide.description}</p><div className="buyer-resource-links"><Link href={`/guides/${guide.slug}`}>Read the buying guide ↗</Link></div></article>)}</section>
    <section className="buyer-section"><h2>Start with the actual product.</h2><p>PanVibes Exim supports ingredient sourcing from Navi Mumbai, India, with shipping only to India, the UK, the USA, Europe and the UAE. Availability, specifications and commercial terms are confirmed against your requirement.</p><div className="buyer-resource-links"><Link href="/products">Food ingredient catalogue ↗</Link><Link href="/products/chemicals">Industrial chemical directory ↗</Link><Link href="/quality">Quality and documentation ↗</Link></div></section>
    <StructuredData data={breadcrumbSchema([{name:'Home',path:'/'},{name:'Buyer guides',path:'/guides'}])}/>
  </main></PageShell>;
}
