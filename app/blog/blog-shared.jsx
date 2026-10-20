import Link from 'next/link';
import styles from './blog.module.css';
import { getBlogImage } from './blog-images';
import { storyLabels } from './story-labels';

export function Arrow({ diagonal = false }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function BlogCard({ post, index }) {
  const image = getBlogImage(post);
  const label = storyLabels[post.slug] || post.title;
  return <article className={styles.card}>
    <Link href={`/blog/${post.slug}`} className={styles.cardLink} aria-label={`${label} — ${post.title}`}>
      <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
      <div className={styles.cardImage}><img src={image.thumbnail} alt={image.alt} width="480" height="320" loading="lazy" decoding="async" /></div>
      <h3>{label}</h3>
      <span className={styles.cardArrow}><Arrow diagonal /></span>
    </Link>
  </article>;
}
