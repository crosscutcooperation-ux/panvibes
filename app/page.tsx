import Hero from "@/components/Hero";
import Journey from "@/components/Services";
import SiteMotion from "@/components/SiteMotion";
import Footer from "@/components/Footer";
import { IngredientLinks, BuyerFaqs, SupplierOverview } from '@/components/ProcurementContent';
import StructuredData from '@/components/StructuredData';
import { websiteSchema } from '@/lib/seo';
import HomeExperience from '@/components/HomeExperience';
import packs from '@/lib/journey-packs.json';
export default function Home() {
  return (
    <>
    <link rel="preload" as="fetch" href={packs.desktop.src} crossOrigin="anonymous" media="(min-width: 992px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"/>
    <link rel="preload" as="fetch" href={packs.mobile.src} crossOrigin="anonymous" media="(max-width: 991px) and (prefers-reduced-motion: no-preference), (pointer: coarse) and (prefers-reduced-motion: no-preference)"/>
    <HomeExperience><SiteMotion>
      <main>
        <Hero />
        <Journey />
        <div className="buyer-home"><SupplierOverview/><IngredientLinks/><BuyerFaqs/></div>
        <StructuredData data={websiteSchema}/>
      </main>
      <Footer />
    </SiteMotion></HomeExperience>
    </>
  );
}
