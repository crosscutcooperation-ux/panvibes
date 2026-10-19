'use client';
import { useEffect, useState } from 'react';
import chemicals from '@/lib/chemicals.json';
import { chemicalFormula } from '@/lib/chemical-formulas';
import { useEnquiry } from '@/components/EnquiryProvider';

const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[₂₃₄]/g, char => ({ '₂': '2', '₃': '3', '₄': '4' })[char]!);

export default function ChemicalCatalogue({ embedded = false, onEnquire }: { embedded?: boolean; onEnquire?: (name: string) => void }) {
  const openEnquiry = useEnquiry();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('acids');
  useEffect(() => {
    if (embedded) return;
    const syncGroup = () => { const slug = window.location.hash.slice(1); if (chemicals.groups.some(item => item.slug === slug)) setSelectedGroup(slug); };
    const frame = requestAnimationFrame(syncGroup);
    window.addEventListener('hashchange', syncGroup);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', syncGroup); };
  }, [embedded]);
  const filtered = chemicals.groups.filter(item => group === 'all' || item.slug === group).map(item => ({ ...item,
    products: item.products.filter(name => normalize(`${name} ${item.name} ${chemicalFormula(name)}`).includes(normalize(query.trim()))),
  })).filter(item => item.products.length);
  const count = filtered.reduce((total, item) => total + item.products.length, 0);
  const activeGroup = filtered.some(item => item.slug === selectedGroup) ? selectedGroup : filtered[0]?.slug;
  const prefix = embedded ? 'range-chemical' : 'chemical';
  return <section className={embedded ? 'chemical-embedded' : 'buyer-section'} aria-labelledby={embedded ? undefined : 'chemical-list-title'} aria-label={embedded ? 'Chemical groups and product formulas' : undefined}>
    {!embedded && <><p className="buyer-eyebrow">Industrial sourcing / Product directory</p><h2 id="chemical-list-title">Find your chemical.</h2></>}
    <div className="chemical-tools">
      <label>Search by chemical, formula or group<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try caustic soda, H2SO4 or PAC" /></label>
      <label>Chemical group<select value={group} onChange={event => setGroup(event.target.value)}><option value="all">All nine groups</option>{chemicals.groups.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
      {(query || group !== 'all') && <button type="button" onClick={() => { setQuery(''); setGroup('all'); setSelectedGroup('acids'); }}>Clear filters</button>}
    </div>
    <p className="chemical-count" role="status">{count} listings in {filtered.length} groups. Some chemicals appear in more than one group.</p>
    {filtered.length > 0 && <div className="chemical-explorer">
      <nav className="chemical-categories" aria-label="Choose a chemical group">
        <p className="buyer-eyebrow">Chemical groups</p>
        {filtered.map(item => <button className="chemical-category" type="button" key={item.slug} aria-pressed={activeGroup === item.slug} aria-controls={`${prefix}-panel-${item.slug}`} onClick={() => setSelectedGroup(item.slug)} onPointerEnter={event => { if (event.pointerType === 'mouse') setSelectedGroup(item.slug); }} onFocus={() => setSelectedGroup(item.slug)}><span>{item.name}</span><span aria-hidden="true">↗</span></button>)}
      </nav>
      <div className="chemical-panels">{filtered.map(item => <section className="chemical-group" id={embedded ? `${prefix}-${item.slug}` : item.slug} key={item.slug} hidden={activeGroup !== item.slug} aria-labelledby={`${prefix}-${item.slug}-title`}>
        <div id={`${prefix}-panel-${item.slug}`}><p className="buyer-eyebrow">{String(item.products.length).padStart(2, '0')} listed products</p><h3 id={`${prefix}-${item.slug}-title`}>{item.name}</h3>
        <table className="chemical-table"><caption>Choose a chemical name to enquire about its specification and availability.</caption><thead><tr><th scope="col">Name</th><th scope="col">Formula</th></tr></thead><tbody>{item.products.map(name => <tr className="chemical-row" key={name}><td><button type="button" onClick={() => onEnquire ? onEnquire(name) : openEnquiry({product:name})} aria-label={`Enquire about ${name}`}>{name}<span aria-hidden="true">↗</span></button></td><td>{chemicalFormula(name)}</td></tr>)}</tbody></table>
        </div>
      </section>)}</div>
    </div>}
    <p className="chemical-formula-note">Formulas identify the base compound. Hydration, concentration, purity and product grade are confirmed against your requirement. Variable compositions and unspecified oxide types need confirmation.</p>
    {count === 0 && <p>No matching chemicals. Try another name or clear the filters. <button className="range-quick-enquiry" type="button" onClick={() => openEnquiry({service:'Product sourcing'})}>Ask our sourcing team ↗</button></p>}
  </section>;
}
