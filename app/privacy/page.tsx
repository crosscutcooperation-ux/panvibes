import PageShell from '@/components/PageShell';
import Link from '@/components/SiteLink';
import { company } from '@/lib/site-content';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('Privacy Policy', 'How PanVibes Exim handles enquiries, website analytics, advertising cookies and privacy choices.', '/privacy');

export default function PrivacyPage() {
  return <PageShell><main className="buyer-page buyer-main buyer-guide-body">
    <nav className="buyer-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Privacy Policy</span></nav>
    <h1 className="buyer-page-title">Privacy Policy</h1><p className="buyer-intro">Last updated: 15 November 2026</p>
    <section className="buyer-section"><h2>Who we are</h2><p>{company.legalName}, {company.address}, operates panvibes.com. For privacy questions or requests, email <a href={`mailto:${company.email}`}>{company.email}</a>.</p></section>
    <section className="buyer-section"><h2>Information you share</h2><p>When you submit an enquiry, we collect your name, email address, country, requested product and quantity. You may also provide your company, phone number, delivery destination, product details and message. We save the enquiry for our sales team, may email it to the team, and use it to respond to your request and discuss supply.</p><p>If you use the website assistant, your question may be sent to Google Gemini to generate an answer. Please do not put confidential or sensitive information in chat messages. Technical server logs may record request details, including IP addresses, for operation and security.</p></section>
    <section className="buyer-section"><h2>Optional analytics and advertising</h2><p>Google Analytics 4 helps us understand website use. Meta Pixel helps us measure advertising activity. These services can collect browser, device, page and interaction information and set cookies. We load each service only after you allow its category in the cookie choices banner.</p><p>You can accept, reject or choose the two categories separately. Your choice is saved on this device for up to 180 days. Use “Cookie settings” in the footer to change it. Withdrawing consent stops future loading of the relevant service and clears its accessible first-party cookies; it does not undo data already collected while consent was active.</p></section>
    <section className="buyer-section"><h2>Sharing, storage and retention</h2><p>Enquiries are available to authorised PanVibes staff and may pass through our email provider. Analytics, advertising and assistant providers process information according to their own services and may handle it outside your country. We keep enquiries and operational records while needed to handle requests, maintain business records and meet applicable obligations. You can contact us to ask about a particular record or request its removal.</p></section>
    <section className="buyer-section"><h2>Your choices and rights</h2><p>You may ask us to access, correct or delete personal information you supplied, and you may withdraw optional cookie consent at any time. We review requests under applicable law. Email <a href={`mailto:${company.email}`}>{company.email}</a> with enough detail to identify the enquiry. You can use the site without accepting optional analytics or advertising cookies.</p></section>
  </main></PageShell>;
}
