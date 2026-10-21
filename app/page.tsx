import Hero from "@/components/Hero";
import Journey from "@/components/Services";
import SiteMotion from "@/components/SiteMotion";
import Footer from "@/components/Footer";
import { IngredientLinks, BuyerFaqs } from '@/components/ProcurementContent';
import HomeExperience from '@/components/HomeExperience';
export default function Home() {
  return (
    <HomeExperience><SiteMotion>
      <main>
        <Hero />
        <Journey />
        <div className="buyer-home"><IngredientLinks/><BuyerFaqs/></div>
      </main>
      <Footer />
    </SiteMotion></HomeExperience>
  );
}
