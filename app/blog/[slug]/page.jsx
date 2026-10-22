import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import posts from '../posts.json';
import { Arrow, BlogCard } from '../blog-shared';
import styles from '../blog.module.css';
import theme from '../brand-theme.module.css';
import { getBlogImage } from '../blog-images';
import StructuredData from '@/components/StructuredData';
import { breadcrumbSchema, organizationId, pageMetadata, siteUrl } from '@/lib/seo';
import { shippingCoverage } from '@/lib/shipping';

export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts.find(post => post.slug === slug);
  if (!post) notFound();
  const metadata = pageMetadata(post.title, post.excerpt, `/blog/${slug}`);
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article' } };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const post = posts.find(post => post.slug === slug);
  if (!post) notFound();
  const related = posts.filter(item => item.category === post.category && item.slug !== slug).slice(0, 3);
  const image = getBlogImage(post);
  return <div id="top" className={`${theme.theme} ${styles.page}`}>
    <a className={styles.skip} href="#article-content">Skip to article</a>
    <main>
      <StructuredData data={{'@context':'https://schema.org','@type':'Article',headline:post.title,description:post.excerpt,image:new URL(image.src,siteUrl).href,mainEntityOfPage:`${siteUrl}/blog/${slug}`,author:{'@id':organizationId},publisher:{'@id':organizationId}}}/>
      <StructuredData data={breadcrumbSchema([{name:'Home',path:'/'},{name:'Blog',path:'/blog'},{name:post.title,path:`/blog/${slug}`}])}/>
      <article className={styles.article}>
        <Link href="/blog#stories" className={styles.back}>← Back to the journal</Link>
        <div className={styles.articleMeta}><span className={styles.orangeDot} />{post.category}<span>{post.minutes} MIN READ</span></div>
        <h1>{post.title}</h1><p className={styles.articleLead}>{post.excerpt}</p>
        <p className={styles.shippingNote}><strong>Shipping destinations:</strong> {shippingCoverage}</p>
        <div className={styles.byline}><span className={styles.bylineIcon}>p↗</span><div>PanVibes Exim<span>THE PANVIBES JOURNAL</span></div></div>
        <img className={styles.articleImage} src={image.src} alt={image.alt} width="1200" height="800" />
        <div id="article-content" className={styles.articleBody} dangerouslySetInnerHTML={{ __html: post.content }} />
        <Link href="/blog#stories" className={styles.articleEnd}>Explore more stories <Arrow /></Link>
      </article>
      <section className={styles.related} aria-labelledby="related-title"><div className={styles.sectionLabel}><h2 id="related-title">Keep exploring</h2><span>MORE FROM {post.category.toUpperCase()}</span></div><div className={styles.grid}>{related.map(item => <BlogCard post={item} index={posts.indexOf(item)} key={item.slug} />)}</div></section>
    </main>
  </div>;
}
