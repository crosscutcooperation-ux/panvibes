import Hero from "@/components/Hero";
import Journey from "@/components/Services";
import SiteMotion from "@/components/SiteMotion";
import Footer from "@/components/Footer";
import { IngredientLinks, BuyerFaqs, SupplierOverview } from '@/components/ProcurementContent';
import StructuredData from '@/components/StructuredData';
import { websiteSchema } from '@/lib/seo';
import HomeExperience from '@/components/HomeExperience';
import HomeMediaPreload from '@/components/HomeMediaPreload';
export default function Home() {
  return (
    <>
    <HomeMediaPreload/>
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
