'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import chemicals from '@/lib/chemicals.json';
import { chemicalFormula } from '@/lib/chemical-formulas';
import type { ProductSelection } from './ProductEnquiry';
import EnquiryButton from '@/components/EnquiryButton';

export default function ChemicalHoverCard({ onEnquire }: { onEnquire: (selection: ProductSelection) => void }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const open = hovered || expanded;
  const enquire = (name: string) => onEnquire({ category: 'Chemicals', name });
  function close() { setHovered(false); setExpanded(false); setActiveGroup(null); }

  return <article className="range-row range-chemical" data-sector="industrial" data-open={open}
    onPointerEnter={event => { if (event.pointerType === 'mouse' && matchMedia('(min-width:992px) and (hover:hover)').matches) setHovered(true); }}
    onPointerLeave={() => { setHovered(false); if (!expanded) setActiveGroup(null); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !expanded) { setHovered(false); setActiveGroup(null); } }}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); trigger.current?.focus(); } }}>
    <div className="range-photo chemical-hover-photo"><Image src="/images/photos/chemicals.webp" alt="Industrial chemical portfolio" fill sizes="(max-width:767px) 100vw, 32vw" /></div>
    <div className="chemical-hover-header">
      <p className="mono range-kicker">9 chemical groups</p>
      <h3><button ref={trigger} className="chemical-card-trigger" type="button" aria-expanded={open} aria-controls="chemical-hover-groups" onClick={() => { if (open) close(); else setExpanded(true); }}><span>Chemicals</span><span className="range-compact-icon" aria-hidden="true">{open ? '−' : '+'}</span></button></h3>
      <p className="chemical-hover-hint"><span className="range-hover-hint">Hover to explore the groups ↓</span><span className="range-touch-hint">Tap + to explore the groups ↓</span></p>
    </div>
    <div className="chemical-hover-reveal" id="chemical-hover-groups" aria-hidden={!open} inert={!open}>
      <div className="chemical-hover-clip"><nav className="chemical-hover-groups" aria-label="Choose a chemical group">
        {chemicals.groups.map(group => {
          const active = open && activeGroup === group.slug;
          const panelId = `chemical-flyout-${group.slug}`;
          return <div className="chemical-hover-group" key={group.slug} data-active={active}
            onPointerEnter={event => { if (event.pointerType === 'mouse' && matchMedia('(min-width:992px) and (hover:hover)').matches) setActiveGroup(group.slug); }}
            onPointerLeave={() => { if (!expanded) setActiveGroup(null); }}
            onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setActiveGroup(null); }}>
            <button className="chemical-group-trigger" type="button" aria-expanded={active} aria-controls={panelId} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setActiveGroup(group.slug); }} onClick={event => {
              // Keyboard focus opens the sheet. Touch clicks toggle it without a synthetic hover.
              if (event.detail === 0) setActiveGroup(group.slug);
              else setActiveGroup(current => current === group.slug ? null : group.slug);
            }}><span>{group.name}</span><span aria-hidden="true">↗</span></button>
            <section className="chemical-flyout" id={panelId} aria-label={`${group.name} names and formulas`} aria-hidden={!active} inert={!active}>
              <p className="mono range-kicker">{group.products.length} listed products</p><h4>{group.name}</h4>
              <table className="chemical-table"><thead><tr><th scope="col">Name</th><th scope="col">Formula</th></tr></thead><tbody>{group.products.map(name => <tr className="chemical-row" key={name}><td><button type="button" onClick={() => enquire(name)} aria-label={`Enquire about ${name}`}>{name}<span aria-hidden="true">↗</span></button></td><td>{chemicalFormula(name)}</td></tr>)}</tbody></table>
              <p className="chemical-flyout-note">Base formulas shown. Confirm the grade, hydration and specification with our team.</p>
            </section>
          </div>;
        })}
      </nav></div>
    </div>
    <div className="chemical-hover-footer"><Link className="range-directory-link" href="/products/chemicals">Full chemical directory ↗</Link><button className="range-enquiry" type="button" onClick={() => enquire('Chemicals')}>Enquire about this product <span aria-hidden="true">↗</span></button><EnquiryButton className="range-quick-enquiry" product="Chemicals">Enquiry form ↗</EnquiryButton></div>
  </article>;
}
