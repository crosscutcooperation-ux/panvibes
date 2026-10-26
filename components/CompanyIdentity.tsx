import Link from '@/components/SiteLink';
import { company } from '@/lib/site-content';
import { siteUrl } from '@/lib/seo';
import { shippingMarketList } from '@/lib/shipping';

export default function CompanyIdentity(){
  return <div className="buyer-home"><section className="buyer-section" aria-labelledby="company-information-title">
    <p className="buyer-eyebrow">PanVibes Exim / Company information</p>
    <h2 id="company-information-title">The business behind<br/>your sourcing enquiry.</h2>
    <p>PanVibes Exim is a B2B food ingredient supplier and export partner based in Navi Mumbai, Maharashtra, India, with a separate industrial chemical portfolio. This website, panvibes.com, is the official PanVibes Exim website for its catalogue, company information and business enquiries.</p>
    <dl className="buyer-facts">
      <div><dt>Business name</dt><dd>{company.legalName}</dd></div>
      <div><dt>Official website</dt><dd><a href={siteUrl}>panvibes.com</a></dd></div>
      <div><dt>Founder</dt><dd>{company.founderName}</dd></div>
      <div><dt>Head office</dt><dd>{company.address}</dd></div>
      <div><dt>Business enquiries</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
      <div><dt>Shipping coverage</dt><dd>{shippingMarketList}</dd></div>
    </dl>
    <div className="buyer-resource-links"><Link href="/products">Confirmed ingredient catalogue ↗</Link><Link href="/products/chemicals">Industrial chemical enquiries ↗</Link><Link href="/contact">Contact PanVibes Exim ↗</Link></div>
  </section></div>;
}
