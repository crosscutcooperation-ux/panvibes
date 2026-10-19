import Hero from "@/components/Hero";
import Journey from "@/components/Services";
import SiteMotion from "@/components/SiteMotion";
import Footer from "@/components/Footer";
import { IngredientLinks, BuyerFaqs } from '@/components/ProcurementContent';
export default function Home() {
  return (
    <SiteMotion>
      <main>
        <Hero />
        <Journey />
        <div className="buyer-home"><IngredientLinks/><BuyerFaqs/></div>
      </main>
      <Footer />
    </SiteMotion>
  );
}
