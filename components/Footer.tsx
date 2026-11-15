import { company, navigation, destinations } from '@/lib/site-content';
import { Pill } from './ui';
import FooterParticleMap from './FooterParticleMap';
import Link from '@/components/SiteLink';
import { companySocialLinks } from '@/lib/social';
import CookieSettingsButton from './CookieSettingsButton';

export default function Footer() {
  return (
    <footer className="pan-footer" aria-label="PanVibes company and contact information">
      <div className="pan-footer-grid">
        <div className="pan-footer-socials"><p className="eyebrow">Socials</p><div>
          {companySocialLinks.map(({ name, href, mark })=><a href={href} target="_blank" rel="noopener noreferrer" aria-label={`PanVibes on ${name}`} key={name}>{mark}</a>)}
          <a href="https://youtube.com/@panvibes6161?si=7WJofh8FCeixOA_-" target="_blank" rel="noopener noreferrer" aria-label="PanVibes on YouTube">▶</a>
        </div><p className="pan-footer-tagline">{company.tagline}</p></div>
        <nav className="pan-footer-company" aria-label="Footer company navigation"><p className="eyebrow">Company</p><div>{navigation.map(item=><Link href={item.href} key={item.href}>{item.label}</Link>)}</div></nav>
        <div className="pan-footer-resources"><p className="eyebrow">Company resources</p><Pill href="/products/chemicals" showArrow={false}>Chemical directory</Pill><Pill href="/quality" showArrow={false}>Quality &amp; documentation</Pill><Pill href="/export-from-india" showArrow={false}>Packaging &amp; export</Pill><Pill href="/guides" showArrow={false}>Ingredient buying guides</Pill><Pill href={company.brochure} newTab showArrow={false}>Download E-brochure</Pill><Pill href={company.profile} newTab showArrow={false}>Company profile</Pill></div>
        <div className="pan-footer-location"><p className="eyebrow">Head office</p><p>{company.address}</p><p className="eyebrow pan-footer-transit-label">Shipping destinations</p><p>{destinations.map(([name])=>name).join(' / ')}</p></div>
        <div className="pan-footer-contact"><p className="eyebrow">Send us mail</p><p className="pan-footer-email"><a href={`mailto:${company.email}`}>{company.email}</a></p><p className="eyebrow pan-footer-transit-label">Collaborate</p><div>{company.phones.map(phone=><p key={phone}><a href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a></p>)}</div></div>
        <div className="pan-footer-map"><FooterParticleMap/></div>
      </div>
      <div className="pan-footer-certifications" aria-label="Company registrations">
        <span>FSSAI Central License <strong>11525998000895</strong></span>
        <span>Spice Board Registration (Merchant Exporter) <strong>CRES/SBCB/27019/2025-2026</strong></span>
        <span>IEC <strong>AAQCP2809P</strong></span>
      </div>
      <div className="pan-footer-bottom mono"><span>© {company.copyrightYear} {company.legalName}. All rights reserved.</span><span>{company.location}</span><span><Link href="/privacy">Privacy Policy</Link> · <CookieSettingsButton/></span></div>
    </footer>
  );
}
