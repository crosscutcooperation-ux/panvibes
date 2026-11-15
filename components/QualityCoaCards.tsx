import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import './QualityCoaCards.css';

type Only = 'ginger' | 'makhana';

const poppins = Poppins({ weight: ['400', '500', '600', '700', '800'], subsets: ['latin'], display: 'swap' });
const coaHref = '/contact?purpose=COA%20%26%20specifications';

function Logo() {
  return <Image className="pvcoa-logo" src="/images/panvibes-logo-transparent.png" alt="PanVibes Exim Pvt Ltd" width={2071} height={759} />;
}

function Ginger() {
  return <article className="pvcoa-card">
    <header className="pvcoa-top"><Logo/><span className="pvcoa-badge">EU MRL COMPLIANT<small>Pesticide residues: BLQ</small></span></header>
    <div className="pvcoa-head"><h3 className="pvcoa-prod">Dry Ginger</h3><p className="pvcoa-sub">Pesticide Residue Analysis</p></div>
    <p className="pvcoa-section">Result</p>
    <table className="pvcoa-table"><tbody>
      <tr className="pvcoa-res"><td>Pesticide molecules tested (LC&#8209;MS/MS &amp; GC&#8209;MS/MS)</td><td>527</td></tr>
      <tr className="pvcoa-res"><td>All analysed pesticides</td><td>BLQ*</td></tr>
      <tr><td>Compliance</td><td><span className="pvcoa-pill">EU Reg (EC) 396/2005</span></td></tr>
    </tbody></table>
    <div className="pvcoa-comply"><span className="pvcoa-ok">&#10003;</span><p><b>Compliant with EU Maximum Residue Levels.</b> Sample found in accordance with EU Regulation (EC) 396/2005 (per tested lot).</p></div>
    <div className="pvcoa-meta"><div><b>Laboratory:</b> Eureka Analytical Services Pvt Ltd, Navi Mumbai</div><div><b>Accreditation:</b> NABL (ULR TC1254925000025004F)</div><div><b>Report no.:</b> TR&#8209;25&#8209;EKA6&#8209;025001&#8209;01</div><div><b>Report date:</b> 16 December 2025</div></div>
    <footer className="pvcoa-foot"><span>*BLQ = Below Limit of Quantification &middot; results apply to the tested lot</span><Link className="pvcoa-cta" href={`${coaHref}&product=Ginger`}>Request full COA &#8599;</Link></footer>
  </article>;
}

function Makhana() {
  return <article className="pvcoa-card">
    <header className="pvcoa-top"><Logo/><span className="pvcoa-badge">LAB&nbsp;TESTED<small>Food-safety verified</small></span></header>
    <div className="pvcoa-head"><h3 className="pvcoa-prod">Makhana / Fox Nuts</h3><p className="pvcoa-sub">Microbiological &amp; Aflatoxin Analysis</p></div>
    <p className="pvcoa-section">Microbiological results</p>
    <table className="pvcoa-table"><tbody>
      <tr className="pvcoa-res"><td>Coliform</td><td>&lt;10 CFU/g</td></tr><tr className="pvcoa-res"><td>Yeast &amp; Mould</td><td>&lt;10 CFU/g</td></tr><tr className="pvcoa-res"><td>Enterobacteriaceae</td><td>&lt;10 CFU/g</td></tr><tr className="pvcoa-res"><td>Salmonella</td><td>Absent / 25g</td></tr><tr><td>Aerobic Plate Count</td><td>290 CFU/g</td></tr>
    </tbody></table>
    <p className="pvcoa-section">Residue</p><table className="pvcoa-table"><tbody><tr><td>Total Aflatoxin</td><td>3.3 &micro;g/kg</td></tr></tbody></table>
    <div className="pvcoa-comply"><span className="pvcoa-ok">&#10003;</span><p><b>Microbiologically safe; aflatoxin within common EU limit (&le;4&nbsp;&micro;g/kg total).</b> Salmonella absent; low microbial load.</p></div>
    <div className="pvcoa-meta"><div><b>Laboratory:</b> Omshiva Test House Pvt Ltd, Patna</div><div><b>Accreditation:</b> NABL / ISO&nbsp;17025 (TC&#8209;14251)</div><div><b>Report no.:</b> STH/25/09/123</div><div><b>Report date:</b> September 2025</div></div>
    <footer className="pvcoa-foot"><span>Results apply to the tested lot &middot; full COA available on request</span><Link className="pvcoa-cta" href={`${coaHref}&product=Makhana%20%2F%20Fox%20Nuts`}>Request full COA &#8599;</Link></footer>
  </article>;
}

export default function QualityCoaCards({ only }: { only?: Only }) {
  return <section className={`pvcoa ${poppins.className}`} aria-label="Laboratory test summary">
    {!only && <div className="pvcoa-lead"><h2>Quality Test Summary</h2><p>Third-party, NABL-accredited laboratory testing &middot; full lab reports (COA) available on request</p></div>}
    {only !== 'makhana' && <Ginger/>}{only !== 'ginger' && <Makhana/>}
  </section>;
}
