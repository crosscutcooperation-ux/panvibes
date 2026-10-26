import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import EnquiryButton from '@/components/EnquiryButton';
import PageShell from '@/components/PageShell';
import StructuredData from '@/components/StructuredData';
import { buyerGuides } from '@/lib/buyer-guides';
import { breadcrumbSchema, organizationId, pageMetadata, siteUrl } from '@/lib/seo';

export function generateStaticParams(){return buyerGuides.map(guide=>({slug:guide.slug}));}

export async function generateMetadata({params}:PageProps<'/guides/[slug]'>){
  const {slug}=await params,guide=buyerGuides.find(item=>item.slug===slug);
  if(!guide)notFound();
  return pageMetadata(guide.title,guide.description,`/guides/${slug}`);
}

export default async function BuyerGuidePage({params}:PageProps<'/guides/[slug]'>){
  const {slug}=await params,guide=buyerGuides.find(item=>item.slug===slug);
  if(!guide)notFound();
  return <PageShell><main className="buyer-main buyer-page">
    <nav className="buyer-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/guides">Buyer guides</Link><span>/</span><span>{guide.title}</span></nav>
    <article className="buyer-guide-body">
      <header><p className="buyer-eyebrow">PanVibes Exim / Ingredient procurement</p><h1 className="buyer-page-title">{guide.heading}</h1><p className="buyer-intro">{guide.intro}</p><p className="buyer-guide-byline">Published by PanVibes Exim · <time dateTime={guide.published}>26 October 2026</time></p></header>
      {guide.sections.map(section=><section className="buyer-section" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}{section.points&&<ul>{section.points.map(point=><li key={point}>{point}</li>)}</ul>}</section>)}
    </article>
    <section className="buyer-section buyer-panel"><h2>Turn your brief into an enquiry.</h2><p>Send your product, form or grade, quantity, application, packaging and delivery destination to our team. Availability, documentation and the quotation are confirmed for your requirement.</p><div className="buyer-actions"><EnquiryButton className="buyer-button buyer-button-primary" product={guide.product} purpose="Bulk quotation">Request a bulk quote ↗</EnquiryButton><Link className="buyer-button" href={guide.productPath}>Explore {guide.product.toLowerCase()} ↗</Link><Link className="buyer-button" href="/quality">Review quality documents ↗</Link></div></section>
    <section className="buyer-section"><h2>Keep preparing your purchase.</h2><div className="buyer-resource-links">{buyerGuides.filter(item=>item.slug!==slug).map(item=><Link key={item.slug} href={`/guides/${item.slug}`}>{item.title} ↗</Link>)}<Link href="/export-from-india">Shipping destinations and packaging ↗</Link></div></section>
    <StructuredData data={breadcrumbSchema([{name:'Home',path:'/'},{name:'Buyer guides',path:'/guides'},{name:guide.title,path:`/guides/${slug}`}])}/>
    <StructuredData data={{'@context':'https://schema.org','@type':'Article',headline:guide.heading,description:guide.description,mainEntityOfPage:`${siteUrl}/guides/${slug}`,datePublished:guide.published,dateModified:guide.published,author:{'@id':organizationId},publisher:{'@id':organizationId},inLanguage:'en'}}/>
  </main></PageShell>;
}
