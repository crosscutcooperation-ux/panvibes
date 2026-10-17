'use client';

import { useState } from 'react';
import { Arrow, BlogCard } from './blog-shared';
import styles from './blog.module.css';
import theme from './brand-theme.module.css';
import BlogTitle from './blog-title';

export default function BlogExperience({ posts }) {
  const [category, setCategory] = useState('All stories');
  const [query, setQuery] = useState('');
  const categories = [...new Set(posts.map(post => post.category))];
  const search = query.trim().toLowerCase();
  const filtered = posts.filter(post => (category === 'All stories' || category === post.category) && `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(search));
  function reset() { setQuery(''); setCategory('All stories'); }

  return <div id="top" className={`${theme.theme} ${styles.page}`}>
    <a className={styles.skip} href="#stories">Skip to stories</a>
    <main>
      <BlogTitle />
      <section id="stories" className={styles.stories} aria-labelledby="stories-title">
        <div className={styles.catalogBar}><h2 id="stories-title">Our journal <sup>{posts.length}</sup></h2><div className={styles.catalogControls}><label className={styles.categorySelect}><span className={styles.srOnly}>Story category</span><select aria-label="Story category" value={category} onChange={event => setCategory(event.target.value)}>{['All stories', ...categories].map(item => <option key={item}>{item}</option>)}</select></label><label className={styles.search}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.4"/></svg><input type="search" aria-label="Search stories" placeholder="Find a story" value={query} onChange={event => setQuery(event.target.value)} /></label></div></div>
        <span className={styles.srOnly} aria-live="polite" role="status">{filtered.length} {filtered.length === 1 ? 'story' : 'stories'}</span>
        {(query || category !== 'All stories') && <div className={styles.resultBar}><span>{filtered.length} {filtered.length === 1 ? 'story' : 'stories'}</span><button type="button" onClick={reset}>Clear filters ↗</button></div>}
        {categories.map((item, groupIndex) => {
          const group = filtered.filter(post => post.category === item);
          if (!group.length) return null;
          return <section className={styles.group} key={item} aria-labelledby={`group-${groupIndex}`}><div className={styles.groupHeading}><span>0{groupIndex + 1} / INSIGHTS</span><h3 id={`group-${groupIndex}`}>{item}</h3><span>{String(group.length).padStart(2, '0')}</span></div><div className={styles.grid}>{group.map(post => <BlogCard key={post.slug} post={post} index={posts.indexOf(post)} />)}</div></section>;
        })}
        {!filtered.length && <div className={styles.empty}><span className={styles.kicker}>LET’S TRY ANOTHER DIRECTION</span><h3>No stories found.</h3><p>Try a product such as ginger, or explore a different category.</p><button type="button" onClick={reset}>View all stories <Arrow /></button></div>}
      </section>
    </main>
  </div>;
}
