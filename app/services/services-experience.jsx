'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './services.module.css';
import { enquiryContact } from '@/lib/enquiry-contact';
import EnquiryButton from '@/components/EnquiryButton';

const services = [
  {
    id: 'export', title: 'Export Solutions', image: '/images/photos/logistics.webp', alt: 'Cargo and pallets prepared for international export',
    summary: 'India / UK / USA / Europe / UAE.',
    description: 'Streamline your international shipments with our comprehensive export solutions. We handle documentation, customs clearance and logistics coordination for delivery to India, the UK, the USA, Europe and the UAE only.',
    features: ['Customs clearance', 'Documentation support', 'Logistics coordination', 'Global network', 'Quality assurance'],
  },
  {
    id: 'import', title: 'Import Solutions', image: '/images/photos/warehouse.webp', alt: 'Warehouse shelves and goods ready for import distribution',
    summary: 'Global sourcing. Local delivery.',
    description: 'Simplify your import process with our end-to-end import solutions. We manage customs clearance, port handling and inland transportation, with support for import compliance.',
    features: ['Import documentation', 'Port handling', 'Customs compliance', 'Inland transportation', 'Risk management'],
  },
  {
    id: 'transport', title: 'Transport Solutions', image: '/images/photos/transport.webp', alt: 'Road transport for inland logistics',
    summary: 'Every mile, connected.',
    description: 'Efficient transportation solutions for your logistics needs. We coordinate road, rail and multimodal transport services to keep your cargo moving from origin to destination.',
    features: ['Road transport', 'Rail services', 'Multimodal solutions', 'Real-time tracking', 'Timely delivery'],
  },
  {
    id: 'document', title: 'Document Verification', image: '/images/photos/documents.webp', alt: 'Trade paperwork and shipping documents',
    summary: 'The details that move trade.',
    description: 'Comprehensive document verification and processing, including bills of lading, certificates of origin, commercial invoices and the documentation needed for export and import.',
    features: ['Bill of lading', 'Certificates of origin', 'Commercial invoices', 'Customs documentation', 'Legal compliance'],
  },
  {
    id: 'freight', title: 'Freight Forwarding', image: '/images/photos/logistics.webp', alt: 'International freight and cargo transportation',
    summary: 'By air. By sea. Beyond borders.',
    description: 'Global freight forwarding across air, sea and land. We coordinate your shipment with competitive rates, cargo insurance and complete supply chain management.',
    features: ['Air freight', 'Sea freight', 'Land transport', 'Cargo insurance', 'Supply chain management'],
  },
];

const contact = {
  ...enquiryContact,
  phone: enquiryContact.phone.slice(2),
};

function Arrow({ diagonal = false }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export default function ServicesExperience() {
  const flightRef = useRef(null);
  const dialogRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const service = services[selected];

  useEffect(() => {
    const section = flightRef.current;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -top / Math.max(1, height - window.innerHeight)));
      const flight = Math.max(0, Math.min(1, progress / 0.82));
      const width = window.innerWidth;
      const planeWidth = Math.min(width * 1.08, 1400);
      const center = -planeWidth * 0.55 + flight * (width + planeWidth * 1.1);
      // The reveal follows the trailing part of the aircraft, exposing type behind it.
      const revealed = Math.max(0, Math.min(100, (center - planeWidth * 0.24) / width * 100));
      section.style.setProperty('--plane-x', `${center}px`);
      section.style.setProperty('--reveal', `${motionQuery.matches ? 100 : revealed}%`);
      section.style.setProperty('--copy-opacity', `${motionQuery.matches ? 1 : Math.max(0, Math.min(1, (flight - 0.62) / 0.2))}`);
      section.dataset.ready = 'true';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motionQuery.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motionQuery.removeEventListener('change', schedule);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected === null) return;
    const previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [selected]);

  return (
    <div id="service-page-top" className={styles.page}>
      <a className={styles.skip} href="#service-cards">Skip to services</a>
      <main>
        <section ref={flightRef} className={styles.flight} aria-labelledby="service-title" data-header-theme="light">
          <div className={styles.stage}>
            <div className={styles.headerSpace} aria-hidden="true" />
            <div className={styles.eyebrow}><span className={styles.dot} /> PANVIBES EXIM <span className={styles.eyebrowDivider}>/</span> GLOBAL TRADE & LOGISTICS</div>
            <div className={styles.titleArea}>
              <div className={styles.titleGhost} aria-hidden="true">Our <span>Service</span></div>
              <h1 id="service-title" className={styles.title}>Our <span>Service</span></h1>
            </div>
            <div className={styles.airplane} aria-hidden="true"><img src="/assets/services/airplane.avif" alt="" width="2221" height="2211" fetchPriority="high" /></div>
            <div className={styles.heroCopy}><p>Connecting possibilities.<br />Moving your business forward.</p><a href="#service-cards">Explore our services <Arrow /></a></div>
          </div>
        </section>

        <section id="service-cards" className={styles.services} aria-labelledby="solutions-title">
          <div className={styles.sectionIntro}><div><span className={styles.label}>WHAT WE DO</span><h2 id="solutions-title">One partner.<br /><span>Every possibility.</span></h2></div><p>From the first document to the final delivery, our services bring your global trade journey together.</p></div>
          <div className={styles.cards}>
            {services.map((item, index) => <button key={item.id} type="button" className={`${styles.card} ${selected === index ? styles.cardActive : ''}`} aria-label={`${item.title} — view details`} aria-haspopup="dialog" aria-controls="service-details" onClick={() => setSelected(index)}>
              <img src={item.image} alt={item.alt} width="600" height="800" loading="lazy" />
              <span className={styles.cardShade} />
              <span className={styles.cardNumber}>0{index + 1}</span>
              <span className={styles.cardContent}><span className={styles.cardTitle}>{item.title}</span><span className={styles.cardSummary}>{item.summary}</span></span>
              <span className={styles.cardHint}>Explore this service</span>
              <span className={styles.cardArrow}><Arrow diagonal /></span>
            </button>)}
          </div>
        </section>
      </main>
      <dialog
        ref={dialogRef}
        id="service-details"
        className={styles.modal}
        aria-labelledby="modal-service-title"
        onCancel={event => { event.preventDefault(); setSelected(null); }}
        onClick={event => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setSelected(null);
        }}
      >
        {service && <div className={styles.modalWindow}>
          <div className={styles.modalPhoto}>
            <img src={service.image} alt={service.alt} width="600" height="800" />
            <div className={styles.modalPhotoCaption}><span className={styles.label}>0{selected + 1} / OUR SERVICE</span><p>{service.summary}</p></div>
          </div>
          <div className={styles.modalContent}>
            <button type="button" className={styles.closeDetails} onClick={() => setSelected(null)} aria-label="Close service details" autoFocus><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></button>
            <div className={styles.detailCopy}>
              <h3 id="modal-service-title">{service.title}</h3>
              <p>{service.description}</p>
              <ul>{service.features.map(feature => <li key={feature}><span>↗</span>{feature}</li>)}</ul>
            </div>
            <div className={styles.contact}>
              <span className={styles.label}>YOUR POINT OF CONTACT</span>
              <div className={styles.contactIdentity}><span className={styles.contactInitials} aria-hidden="true">OM</span><div><h4>{contact.name}</h4><p>{contact.role}</p></div></div>
              <a href={`tel:+91${contact.phone}`}>+91 {contact.phone.slice(0, 5)} {contact.phone.slice(5)} <Arrow diagonal /></a>
              <a className={styles.emailLink} href={`mailto:info@panvibesexim.com?subject=${encodeURIComponent(`Enquiry: ${service.title}`)}`}>Enquire about this service <Arrow /></a>
              <EnquiryButton className="service-inline-enquiry" service={service.title}>Fill enquiry form ↗</EnquiryButton>
            </div>
          </div>
        </div>}
      </dialog>
    </div>
  );
}
