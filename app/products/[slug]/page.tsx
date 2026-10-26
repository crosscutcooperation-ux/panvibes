import Link from '@/components/SiteLink';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import StructuredData from '@/components/StructuredData';
import { BuyerFaqs } from '@/components/ProcurementContent';
import { exportProducts } from '@/lib/export-products';
import { breadcrumbSchema, organizationId, pageMetadata, siteUrl } from '@/lib/seo';
import { enquiryContact } from '@/lib/enquiry-contact';
import EnquiryButton from '@/components/EnquiryButton';
import { buyerSearchContent } from '@/lib/buyer-search-content';

export function generateStaticParams() { return exportProducts.map(product => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = exportProducts.find(item => item.slug === slug);
  if (!product) notFound();
  return pageMetadata(buyerSearchContent[slug]?.title || product.title, product.description, `/products/${slug}`);
}

export default async function ExportProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = exportProducts.find(item => item.slug === slug);
  if (!product) notFound();
  const buyer = buyerSearchContent[slug];
  return <PageShell><main className="buyer-main buyer-page">
    <nav className="buyer-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span>{product.name}</span></nav>
    <section className="buyer-hero"><div><p className="buyer-eyebrow">India-based B2B ingredient sourcing</p><h1>{buyer?.heading || product.name}<br /><span>{buyer?.subheading || 'For bulk buyers.'}</span></h1><p className="buyer-intro">{product.intro}</p><div className="buyer-actions"><EnquiryButton className="buyer-button buyer-button-primary" product={product.name} purpose="Bulk quotation">Request a Bulk Quote ↗</EnquiryButton><EnquiryButton className="buyer-button" product={product.name} purpose="COA and specifications">Get COA &amp; Specifications ↗</EnquiryButton><EnquiryButton className="buyer-button" product={product.name} purpose="Sample request">Request a Sample ↗</EnquiryButton></div></div><div className="buyer-hero-photo"><Image src={`/images/${product.image}`} alt={product.name} fill sizes="(max-width:991px) 100vw, 45vw" priority /></div></section>
    {slug==='fruit-powders' && <section className="buyer-section buyer-panel"><h2>Looking specifically for banana powder?</h2><p>This category overview covers the only fruit powder currently listed. Use the dedicated product page for banana powder applications, buying requirements, sample enquiries and specifications.</p><div className="buyer-resource-links"><Link href="/products/banana-powder">Banana powder bulk sourcing from India ↗</Link></div></section>}
    {buyer && <section className="buyer-section" aria-labelledby="buying-options-title"><p className="buyer-eyebrow">Compare your sourcing options</p><h2 id="buying-options-title">Choose {product.name.toLowerCase()} for your process.</h2><div className="buyer-table-scroll"><table className="buyer-spec-table"><caption>Listed options support a sourcing discussion. Agree the specification and availability before ordering.</caption><thead><tr><th scope="col">Option</th><th scope="col">Buying context</th><th scope="col">What to confirm</th></tr></thead><tbody>{buyer.options.map(option=><tr key={option.name}><th scope="row">{option.name}</th><td>{option.use}</td><td>{option.confirm}</td></tr>)}</tbody></table></div></section>}
    <section className="buyer-section"><p className="buyer-eyebrow">Product overview</p><h2>Build your sourcing brief.</h2><dl className="buyer-facts">
      <div><dt>Origin</dt><dd>{product.origin || "India"}</dd></div><div><dt>Forms / options</dt><dd>{product.forms.join(' / ')}</dd></div>
      <div><dt>Grades / selection</dt><dd>{product.grades.join(' / ')}</dd></div><div><dt>Buyer profiles</dt><dd>{product.buyers}</dd></div>
      <div><dt>Packaging &amp; MOQ</dt><dd>Bulk or custom packaging enquiries. Packing sizes, MOQ and lead time confirmed in the quotation.</dd></div><div><dt>Testing &amp; documentation</dt><dd>Request the relevant specification, COA and laboratory reports. Availability and product or lot coverage are confirmed on enquiry.</dd></div>
    </dl></section>
    <section className="buyer-section buyer-columns"><div><p className="buyer-eyebrow">Choosing your product</p><h2>Buy to a specification.</h2><p>{product.buyingGuide}</p><div className="buyer-resource-links"><Link href="/quality">Quality &amp; testing guide ↗</Link></div></div><div className="buyer-panel"><h3>Applications to discuss</h3><ul>{product.applications.map(item => <li key={item}>{item}</li>)}</ul><h3>Include in your enquiry</h3><ul>{product.request.map(item => <li key={item}>{item}</li>)}</ul></div></section>
    <section className="buyer-section"><p className="buyer-eyebrow">Technical review</p><h2>Request the details that matter.</h2><table className="buyer-spec-table"><caption>Acceptance limits are agreed against your requirement. Numeric specifications and certificates are supplied for review, rather than assumed.</caption><tbody>{[
      ['Appearance, colour & aroma', 'Request the product-specific description and sample criteria.'], ['Moisture & particle size', 'Specify required limits and mesh size where applicable.'], ['Microbiology', 'Share the limits and test methods required by your buyer or application.'], ['Heavy metals & pesticide residues', 'Request applicable reports and agree destination-market criteria.'], ['Aflatoxin & other parameters', 'Confirm applicability to the product and your procurement specification.'], ['Shelf life, storage & packaging', 'Request confirmed product-specific information before ordering.'],
    ].map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table></section>
    <section className="buyer-section buyer-panel"><p className="buyer-eyebrow">India / UK / USA / Europe / UAE</p><h2>From your brief to an export plan.</h2><p>We ship only to India, the UK, the USA, Europe and the UAE. Share your delivery country, quantity, required date and documentation needs. Our team reviews product availability, packing, sample requests and logistics before confirming commercial terms.</p><div className="buyer-actions"><Link className="buyer-button" href="/export-from-india">Explore packaging &amp; export ↗</Link><a className="buyer-button" href={`https://wa.me/${enquiryContact.phone}?text=${encodeURIComponent(`Hello, I would like to discuss bulk ${product.name}.`)}`} target="_blank" rel="noreferrer">Talk to Export Sales ↗</a></div></section>
    <section className="buyer-section buyer-panel"><h2>Prepare a comparable bulk quotation.</h2><p>Share your company, product form, grade, quantity, application, delivery city and country, packing preference and documentation requirements. Compare the same specification and freight scope when reviewing offers.</p><div className="buyer-resource-links"><Link href="/guides/bulk-ingredient-quotation-checklist">Bulk ingredient RFQ checklist ↗</Link>{slug==='ginger' && <Link href="/guides/ginger-powder-flakes-whole-buying-guide">Compare ginger powder, flakes and whole ginger ↗</Link>}</div></section>
    <BuyerFaqs faqs={[...product.faqs,...(buyer?.faqs || [])]} />
    <section className="buyer-section"><h2>Explore related ingredients.</h2><div className="buyer-resource-links">{exportProducts.filter(item => item.slug !== slug).map(item => <Link key={item.slug} href={`/products/${item.slug}`}>{item.name} ↗</Link>)}</div></section>
    <StructuredData data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name: product.name, path: `/products/${slug}` }])} />
    <StructuredData data={{ '@context': 'https://schema.org', '@type': 'Product', '@id': `${siteUrl}/products/${slug}#product`, name: product.name, description: product.intro, url: `${siteUrl}/products/${slug}`, image: `${siteUrl}/images/${product.image}`, category: 'B2B food ingredients', countryOfOrigin: product.origin ? undefined : { '@type': 'Country', name: 'India' }, additionalProperty: [{ '@type': 'PropertyValue', name: 'Forms', value: product.forms.join(', ') }, { '@type': 'PropertyValue', name: 'Grades / selection enquiries', value: product.grades.join(', ') }], subjectOf: { '@type': 'WebPage', url: `${siteUrl}/products/${slug}`, publisher: { '@id': organizationId } } }} />
  </main></PageShell>;
}
