import BlogExperience from './blog-experience';
import posts from './posts.json';

export const metadata = {
  title: 'Blog | PanVibes Exim',
  description: 'Perspectives on global trade, dehydrated foods, ingredients and sourcing. Explore the PanVibes Exim journal.',
};

export default function BlogPage() {
  return <BlogExperience posts={posts.map(post => {
    const summary = { ...post };
    delete summary.content;
    return summary;
  })} />;
}
