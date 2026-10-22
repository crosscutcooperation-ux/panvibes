import BlogExperience from './blog-experience';
import posts from './posts.json';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('Journal', 'Perspectives on global trade, dehydrated foods, ingredients and sourcing for international B2B buyers. Explore the PanVibes Exim journal.', '/blog');

export default function BlogPage() {
  return <BlogExperience posts={posts.map(post => {
    const summary = { ...post };
    delete summary.content;
    return summary;
  })} />;
}
