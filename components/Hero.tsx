import { Pill } from "./ui";
import { company } from "@/lib/site-content";
import ScrollVideoHero from './ScrollVideoHero';
import EnquiryButton from './EnquiryButton';

export default function Hero() {
  return (
    <ScrollVideoHero>
        <div className="hero-copy">
          <p className="hero-eyebrow">{company.name}</p>
          <h1 id="hero-title">Your Vision,<br/><span>Our Expert</span><br/>Execution</h1>
          <p className="hero-description">{company.heroDescription}</p>
          <div className="hero-actions">
            <EnquiryButton className="pill pill-white" purpose="Bulk quotation">
              Request a Quote
            </EnquiryButton>
            <Pill className="pill-white" href="/products#ingredient-pages-title">Get Product Catalogue</Pill>
          </div>
        </div>
        <div className="scroll-cue">
          <span>Scroll to explore</span>
          <span aria-hidden="true">↓</span>
        </div>
    </ScrollVideoHero>
  );
}
