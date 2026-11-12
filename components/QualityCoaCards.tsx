import Image from 'next/image';
import Link from 'next/link';

type Only = 'ginger' | 'makhana';

const COA_HREF = '/contact?purpose=COA%20and%20specifications';

function Logo() {
  return <Image className="pvcoa-logo" src="/images/panvibes-logo-transparent.png" alt="PanVibes Exim" width={2071} height={759} />;
}

function Ginger() {
  return <article className="pvcoa-card">
    <header className="pvcoa-top"><Logo/><span className="pvcoa-badge">EU&#8209;525 TESTED<small>Pesticide residues: BLQ</small></span></header>
    <div className="pvcoa-head"><h3 className="pvcoa-prod">Dry Ginger</h3><p className="pvcoa-sub">Pesticide Residue Analysis</p></div>
    <p className="pvcoa-section">Result</p>
    <table className="pvcoa-table"><tbody>
      <tr className="pvcoa-res"><td>Pesticide molecules tested (LC&#8209;MS/MS &amp; GC&#8209;MS/MS)</td><td>527</td></tr>
      <tr className="pvcoa-res"><td>All analysed pesticides</td><td>BLQ*</td></tr>
      <tr><td>Compliance</td><td><span className="pvcoa-pill">EU Reg (EC) 396/2005</span></td></tr>
    </tbody></table>
    <div className="pvcoa-comply"><span className="pvcoa-ok">&#10003;</span><p><b>Compliant with EU Maximum Residue Levels.</b> Sample found in accordance with EU Regulation (EC) 396/2005 (per tested lot).</p></div>
    <div className="pvcoa-meta"><div><b>Laboratory:</b> Eureka Analytical Services Pvt Ltd, Navi Mumbai</div><div><b>Accreditation:</b> NABL (ULR TC1254925000025004F)</div><div><b>Report no.:</b> TR&#8209;25&#8209;EKA6&#8209;025001&#8209;01</div><div><b>Report date:</b> 16 December 2025</div></div>
    <footer className="pvcoa-foot"><span>*BLQ = Below Limit of Quantification &middot; results apply to the tested lot</span><Link href={COA_HREF} className="pvcoa-cta">Request full COA &#8599;</Link></footer>
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
    <footer className="pvcoa-foot"><span>Results apply to the tested lot &middot; full COA available on request</span><Link href={COA_HREF} className="pvcoa-cta">Request full COA &#8599;</Link></footer>
  </article>;
}

export default function QualityCoaCards({ only }: { only?: Only }) {
  return <section className="pvcoa" aria-label="Laboratory test summary">
    {only !== 'makhana' && <Ginger/>}{only !== 'ginger' && <Makhana/>}
    <style>{`
      .pvcoa{--navy:#16366A;--orange:#E8601C;--gold:#C9A24B;--ink:#1f2937;--cream:#F7F3EA;--line:#e5e0d5;--good:#2E7D32;--muted:#6b7280;display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));font-family:inherit}
      .pvcoa *{box-sizing:border-box}.pvcoa-card{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(22,54,106,.07)}
      .pvcoa-top{display:flex;justify-content:space-between;align-items:center;padding:16px 22px;background:#fff;border-bottom:3px solid var(--navy)}.pvcoa-logo{height:42px;width:auto;display:block}.pvcoa-badge{background:var(--gold);color:#3a2a10;font-weight:700;font-size:11px;padding:8px 13px;border-radius:999px;text-align:center;line-height:1.3;flex:none}.pvcoa-badge small{display:block;font-weight:500;font-size:9px;opacity:.85}
      .pvcoa-head{padding:16px 22px 4px}.pvcoa-prod{font-size:20px;font-weight:700;color:var(--navy);margin:0}.pvcoa-sub{font-size:12.5px;color:var(--orange);font-weight:600;margin:2px 0 0}.pvcoa-table{width:100%;border-collapse:collapse;margin:10px 0 2px}.pvcoa-table td{padding:9px 22px;font-size:13px;border-top:1px solid #f0ece2}.pvcoa-table tr td:first-child{color:var(--muted);width:54%}.pvcoa-table tr td:last-child{text-align:right;font-weight:600;color:var(--ink)}.pvcoa-res td:last-child{color:var(--good)}
      .pvcoa-pill{display:inline-block;background:#eaf4ea;color:var(--good);font-weight:700;font-size:11px;padding:3px 9px;border-radius:999px}.pvcoa-section{padding:10px 22px 0;margin:0;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold)}.pvcoa-comply{display:flex;align-items:center;gap:10px;padding:14px 22px;border-top:1px solid var(--line)}.pvcoa-comply .pvcoa-ok{flex:none;width:32px;height:32px;border-radius:50%;background:var(--good);color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700}.pvcoa-comply p{font-size:12.5px;margin:0}.pvcoa-comply b{color:var(--navy)}
      .pvcoa-meta{display:grid;grid-template-columns:1fr 1fr;gap:4px 18px;padding:14px 22px;background:var(--cream);font-size:11.5px}.pvcoa-meta b{color:var(--navy)}.pvcoa-foot{padding:12px 22px;background:#fafafa;border-top:1px solid var(--line);font-size:10.5px;color:var(--muted);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}.pvcoa-cta{color:#fff;background:var(--navy);text-decoration:none;font-weight:600;font-size:11.5px;padding:7px 12px;border-radius:999px;white-space:nowrap}
      @media(max-width:560px){.pvcoa-meta{grid-template-columns:1fr}.pvcoa-table tr td:first-child{width:60%}.pvcoa-logo{height:36px}}
    `}</style>
  </section>;
}
