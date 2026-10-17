import { Pill } from "./ui";
import { company } from "@/lib/site-content";
import ScrollVideoHero from './ScrollVideoHero';

export default function Hero() {
  const [vision, ...remainder] = company.heroTitle.split(", ");
  const execution = remainder.join(", ");
  const words = execution.split(" ");
  return (
    <ScrollVideoHero>
        <div className="hero-copy">
          <p className="hero-eyebrow">{company.name}</p>
          <h1 id="hero-title">
            {execution ? (
              <>
                {vision},<br />
                <span>{words.slice(0, -1).join(" ")}</span>
                <br />
                {words.at(-1)}
              </>
            ) : (
              company.heroTitle
            )}
          </h1>
          <p className="hero-description">{company.heroDescription}</p>
          <div className="hero-actions">
            <Pill className="pill-white" href="/contact">
              Request a Quote
            </Pill>
          </div>
        </div>
        <div className="scroll-cue">
          <span>Scroll to explore</span>
          <span aria-hidden="true">↓</span>
        </div>
    </ScrollVideoHero>
  );
}
