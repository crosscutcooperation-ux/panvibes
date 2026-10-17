import Link from 'next/link';
import { notFound } from 'next/navigation';
import posts from '../posts.json';
import { Arrow, BlogCard } from '../blog-shared';
import styles from '../blog.module.css';
import theme from '../brand-theme.module.css';
import { getBlogImage } from '../blog-images';

export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts.find(post => post.slug === slug);
  return { title: post ? `${post.title} | PanVibes Exim` : 'Story not found', description: post?.excerpt };
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
      <article className={styles.article}>
        <Link href="/blog#stories" className={styles.back}>← Back to the journal</Link>
        <div className={styles.articleMeta}><span className={styles.orangeDot} />{post.category}<span>{post.minutes} MIN READ</span></div>
        <h1>{post.title}</h1><p className={styles.articleLead}>{post.excerpt}</p>
        <div className={styles.byline}><span className={styles.bylineIcon}>p↗</span><div>PanVibes Exim<span>THE PANVIBES JOURNAL</span></div></div>
        <img className={styles.articleImage} src={image.src} alt={image.alt} width="1000" height="700" />
        <div id="article-content" className={styles.articleBody} dangerouslySetInnerHTML={{ __html: post.content }} />
        <Link href="/blog#stories" className={styles.articleEnd}>Explore more stories <Arrow /></Link>
      </article>
      <section className={styles.related} aria-labelledby="related-title"><div className={styles.sectionLabel}><h2 id="related-title">Keep exploring</h2><span>MORE FROM {post.category.toUpperCase()}</span></div><div className={styles.grid}>{related.map(item => <BlogCard post={item} index={posts.indexOf(item)} key={item.slug} />)}</div></section>
    </main>
  </div>;
}
