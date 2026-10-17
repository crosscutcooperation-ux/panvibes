import type { Metadata } from 'next';
import SiteMotion from '@/components/SiteMotion';
import ProductHero from './ProductHero';
import ProductRange from './ProductRange';
import Footer from '@/components/Footer';
import './products.css';

export const metadata: Metadata = {
  title: 'Products | PanVibes Exim',
  description: 'Explore PanVibes food and nutrition products, plus a separate range of chemicals, aggregates and construction admixtures.',
};

export default function ProductsPage() {
  return <SiteMotion>
    <div className="products-page">
      <main>
        <ProductHero/>
        <ProductRange/>
      </main>
      <Footer/>
    </div>
  </SiteMotion>;
}
