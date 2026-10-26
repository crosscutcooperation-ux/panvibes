import type { MetadataRoute } from 'next';
import { exportProducts } from '@/lib/export-products';
import { siteUrl } from '@/lib/seo';
import posts from './blog/posts.json';
import { buyerGuides } from '@/lib/buyer-guides';
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/about', '/services', '/products', '/products/chemicals', '/quality', '/export-from-india', '/blog', '/contact', '/guides', ...buyerGuides.map(guide=>`/guides/${guide.slug}`), ...exportProducts.map(product => `/products/${product.slug}`), ...posts.map(post => `/blog/${post.slug}`)];
  return routes.map(path => ({ url: `${siteUrl}${path}` }));
}
