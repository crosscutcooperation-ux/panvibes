import Hero from "@/components/Hero";
import Journey from "@/components/Services";
import SiteMotion from "@/components/SiteMotion";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <SiteMotion>
      <main>
        <Hero />
        <Journey />
      </main>
      <Footer />
    </SiteMotion>
  );
}
