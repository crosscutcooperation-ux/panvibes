import { pageMetadata, breadcrumbSchema } from '@/lib/seo';
import { IngredientLinks, BuyerFaqs } from '@/components/ProcurementContent';
import StructuredData from '@/components/StructuredData';
import SiteMotion from '@/components/SiteMotion';
import ProductHero from './ProductHero';
import ProductRange from './ProductRange';
import Footer from '@/components/Footer';
import './products.css';

export const metadata = pageMetadata('Bulk Food Ingredients & Industrial Chemical Catalog', 'Explore ginger, turmeric, moringa, makhana, dehydrated vegetables and fruit powders, plus the separate industrial chemical directory. Request a B2B quote.', '/products');

export default function ProductsPage() {
  return <SiteMotion>
    <div className="products-page">
      <main>
        <ProductHero/>
        <ProductRange/>
        <div className="buyer-home"><IngredientLinks compact/></div>
        <div className="buyer-home"><BuyerFaqs/></div>
        <StructuredData data={breadcrumbSchema([{name:'Home',path:'/'},{name:'Products',path:'/products'}])}/>
      </main>
      <Footer/>
    </div>
  </SiteMotion>;
}
