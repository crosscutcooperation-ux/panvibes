'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from '@/components/SiteLink';
import { products } from '@/lib/site-content';
import catalogue from '@/lib/product-types.json';
import ProductEnquiry, { type ProductSelection } from './ProductEnquiry';
import ChemicalHoverCard from './ChemicalHoverCard';
import EnquiryButton from '@/components/EnquiryButton';

type Enquire = (selection:ProductSelection)=>void;

function ProductTypes({index,open,onEnquire}:{index:number;open:boolean;onEnquire:Enquire}) {
  const product=products[index],category=catalogue.categories[index];
  const enquire=(name:string)=>onEnquire({category:product.name,name});
  return <ul>{category.types.map(type=><li key={type.name} className={`${type.grades.length?'has-grades':''} ${category.key==='makhana'&&type.name.includes('+')?'grade-type':''}`}>
    <button type="button" className="range-type-name" tabIndex={open?0:-1} onClick={()=>enquire(type.name)} aria-label={`Enquire about ${type.name}`}>{type.name}<span aria-hidden="true">↗</span></button>
    {type.grades.length>0&&<div className="range-grades mono" aria-label={`${type.name} grades`}>{type.grades.map(grade=><button type="button" tabIndex={open?0:-1} key={grade} onClick={()=>enquire(`${type.name} — ${grade}`)}>{grade} ↗</button>)}</div>}
  </li>)}</ul>;
}

function ProductRow({index,order,onEnquire}:{index:number;order:number;onEnquire:Enquire}) {
  const product=products[index], category=catalogue.categories[index];
  const [hovered,setHovered]=useState(false);
  const [selected,setSelected]=useState(false);
  const open=hovered||selected;
  const panelId=`product-types-${category.key}`;
  const enquire=(name=product.name)=>onEnquire({category:product.name,name});
  return <article className="range-row" data-sector="food" data-open={open} onPointerEnter={event=>{if(event.pointerType==='mouse'&&matchMedia('(min-width:992px) and (hover:hover)').matches)setHovered(true);}} onPointerLeave={()=>setHovered(false)}>
    <div className="range-photo">
      <button className="range-image-enquiry" type="button" aria-label={`Enquire about ${product.name}`} onClick={()=>enquire()}><Image src={`/images/${product.image}`} alt={product.name} fill sizes="(max-width:767px) 100vw, 35vw"/></button>
      <span className="range-index mono">{String(order).padStart(2,'0')} / {String(products.length).padStart(2,'0')}</span>
    </div>
    <div className="range-content">
      <div className="range-overview" aria-hidden={open}>
        <p className="range-kicker mono">{category.types.length} {category.types.length===1?'product type':'product types'}</p>
        <h3>{product.name}</h3>
        <p className="range-hint mono"><span className="range-hover-hint">Hover to explore the types</span><span className="range-touch-hint">Tap + to explore the types</span><span aria-hidden="true">↗</span></p>
      </div>
      <div className="range-types" id={panelId} aria-hidden={!open} inert={!open}>
        <div className="range-slide-clip"><div className="range-slide-body">
        <p className="range-kicker mono">Available types / {String(category.types.length).padStart(2,'0')}</p>
        <h3>{product.name}</h3>
        <ProductTypes index={index} open={open} onEnquire={onEnquire}/>
        </div></div>
      </div>
      <button className="range-enquiry" type="button" onClick={()=>enquire()}>Enquire about this product <span aria-hidden="true">↗</span></button>
      <EnquiryButton className="range-quick-enquiry" product={product.name}>Enquiry form ↗</EnquiryButton>
      <button className="range-toggle" type="button" aria-expanded={open} aria-controls={panelId} aria-label={`${open?'Hide':'Show'} types for ${product.name}`} onClick={()=>{setSelected(!open);setHovered(false);}}><span aria-hidden="true">{open?'−':'+'}</span></button>
    </div>
  </article>;
}

function IndustrialProductCard({index,order,onEnquire}:{index:number;order:number;onEnquire:Enquire}) {
  const product=products[index],category=catalogue.categories[index];
  const [selected,setSelected]=useState(false);
  const [hovered,setHovered]=useState(false);
  const open=selected||hovered;
  const toggleId=`product-toggle-${category.key}`,panelId=`product-types-${category.key}`;
  const enquire=()=>onEnquire({category:product.name,name:product.name});
  return <article className="range-row range-row-compact" data-sector="industrial" data-open={open} onPointerEnter={event=>{if(event.pointerType==='mouse'&&matchMedia('(hover:hover)').matches)setHovered(true);}} onPointerLeave={()=>setHovered(false)}>
    <div className="range-photo">
      <button className="range-image-enquiry" type="button" aria-label={`Enquire about ${product.name}`} onClick={enquire}><Image src={`/images/${product.image}`} alt={product.name} fill sizes="(max-width:767px) 100vw, 32vw"/></button>
      <span className="range-index mono">{String(order).padStart(2,'0')} / {String(products.length).padStart(2,'0')}</span>
    </div>
    <div className="range-compact-content">
      <p className="range-kicker mono">{category.types.length} {category.types.length===1?'product type':'product types'}</p>
      <h3><button className="range-compact-toggle" id={toggleId} type="button" aria-expanded={open} aria-controls={panelId} onClick={()=>{setSelected(!open);setHovered(false);}}><span>{product.name}</span><span className="range-compact-icon" aria-hidden="true">{open?'−':'+'}</span></button></h3>
      {product.name==='Chemicals'&&<Link className="range-directory-link" href="/products/chemicals">Search the full chemical directory ↗</Link>}
      <div className="range-compact-reveal" id={panelId} role="region" aria-labelledby={toggleId} aria-hidden={!open} inert={!open}>
        <div className="range-compact-clip"><div className="range-types"><ProductTypes index={index} open={open} onEnquire={onEnquire}/></div></div>
      </div>
      <button className="range-enquiry" type="button" onClick={enquire}>Enquire about this product <span aria-hidden="true">↗</span></button>
      <EnquiryButton className="range-quick-enquiry" product={product.name}>Enquiry form ↗</EnquiryButton>
    </div>
  </article>;
}

export default function ProductRange() {
  const [selection,setSelection]=useState<ProductSelection|null>(null);
  const indexed=products.map((product,index)=>({product,index}));
  const food=indexed.filter(({product})=>product.sector==='food');
  const industrial=indexed.filter(({product})=>product.sector==='industrial');
  return <><section className="product-range" aria-labelledby="product-range-title">
    <div className="range-heading">
      <div><p className="mono range-kicker">PanVibes Exim / Product catalogue</p><h2 id="product-range-title">Our product<br/>range<span>.</span></h2></div>
      <p className="range-heading-note">Explore {products.length} product categories.<br/>Food and nutrition, followed by chemicals and non-food materials.</p>
    </div>
    <section className="range-group" aria-labelledby="food-products-title" data-product-group="food">
      <div className="range-group-heading"><div><p className="mono range-kicker">01 / {food.length} categories</p><h2 id="food-products-title">Food &amp; nutrition</h2></div><p>Ingredients, everyday favourites and nutritional products.</p></div>
      <div className="range-list">{food.map(({product,index},order)=><ProductRow key={product.name} index={index} order={order+1} onEnquire={setSelection}/>)}</div>
    </section>
    <section className="range-group range-group-industrial" aria-labelledby="industrial-products-title" data-product-group="industrial">
      <div className="range-group-heading"><div><p className="mono range-kicker">02 / {industrial.length} categories</p><h2 id="industrial-products-title">Chemicals &amp; non-food</h2></div><p>Select a category to explore its types and specifications.</p></div>
      <div className="range-industrial-grid">{industrial.map(({product,index},order)=>product.name==='Chemicals'?<ChemicalHoverCard key={product.name} onEnquire={setSelection}/>:<IndustrialProductCard key={product.name} index={index} order={food.length+order+1} onEnquire={setSelection}/>)}</div>
    </section>
  </section><ProductEnquiry selection={selection} onClose={()=>setSelection(null)}/></>;
}
