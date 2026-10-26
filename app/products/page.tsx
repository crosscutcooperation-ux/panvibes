import { pageMetadata, breadcrumbSchema } from '@/lib/seo';
import { IngredientLinks, BuyerFaqs } from '@/components/ProcurementContent';
import StructuredData from '@/components/StructuredData';
import SiteMotion from '@/components/SiteMotion';
import ProductHero from './ProductHero';
import ProductRange from './ProductRange';
import Footer from '@/components/Footer';
import './products.css';
import assets from '@/lib/product-assets.json';
import { Fragment } from 'react';

export const metadata = pageMetadata('Bulk Food Ingredients & Industrial Chemicals', 'Compare bulk ginger, turmeric, moringa, makhana, banana powder and dehydrated vegetables from India. Explore the chemical catalogue and request a B2B quote.', '/products');

export default function ProductsPage() {
  return <>{Object.entries(assets).map(([name,asset])=><Fragment key={name}><link rel="preload" as="image" href={asset.mobile.src} media="(max-width:991px)"/><link rel="preload" as="image" href={asset.desktop.src} media="(min-width:992px)"/></Fragment>)}<SiteMotion>
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
  </SiteMotion></>;
}
