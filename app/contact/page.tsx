import { pageMetadata } from '@/lib/seo';
import { Suspense } from 'react';
import Footer from '@/components/Footer';
import SiteMotion from '@/components/SiteMotion';
import { company } from '@/lib/site-content';
import ContactMap from './ContactMap';
import ContactForm from './ContactForm';
import './contact.css';

export const metadata=pageMetadata('Contact Export Sales | Bulk Quote, Samples & COA', 'Contact PanVibes Exim in Navi Mumbai. Share your product, grade, quantity and country to request a bulk quotation, sample, COA or export sourcing discussion.', '/contact');

export default function ContactPage(){
  return <SiteMotion><div className="contact-page">
    <main className="contact-main">
      <section className="contact-intro" aria-labelledby="contact-title">
        <div className="contact-heading"><p className="mono">India / UK / USA / Europe / UAE</p><h1 id="contact-title"><span className="contact-word-get">Get</span> <span className="contact-word-in">in</span><br/><span className="contact-word-touch">touch</span><i>.</i></h1><p className="contact-intro-note">Your next opportunity<br/>starts with a conversation.</p></div>
        <ContactMap/>
      </section>
      <section className="contact-details" aria-label="Contact information and enquiry form">
        <aside className="contact-email"><p className="mono contact-label">01 / Say hello</p><a className="contact-email-link" href={`mailto:${company.email}`}>info@<br/>panvibesexim.com ↗</a><div className="contact-phone-list"><p className="mono contact-label">Prefer a conversation?</p>{company.phones.map(phone=><a key={phone} href={`tel:${phone.replace(/\s/g,'')}`}>{phone}</a>)}</div></aside>
        <div className="contact-your-info"><p className="mono contact-label">02 / Your information</p><Suspense fallback={<p>Loading enquiry form…</p>}><ContactForm/></Suspense></div>
        <aside className="contact-office"><p className="mono contact-label">03 / Find us</p><h2>Head office</h2><p>{company.address}</p><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(company.address)}`} target="_blank" rel="noreferrer">Click here for directions ↗</a><span className="mono contact-office-note">Navi Mumbai, India<br/>19.079° N / 73.011° E</span></aside>
      </section>
    </main><Footer/>
  </div></SiteMotion>;
}
