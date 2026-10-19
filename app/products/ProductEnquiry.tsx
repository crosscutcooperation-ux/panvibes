'use client';

import { useEffect, useRef } from 'react';
import { enquiryContact as contact } from '@/lib/enquiry-contact';
import { Arrow } from '@/components/ui';
import { useEnquiry } from '@/components/EnquiryProvider';

export type ProductSelection={category:string;name:string};

export default function ProductEnquiry({selection,onClose}:{selection:ProductSelection|null;onClose:()=>void}){
  const openEnquiry=useEnquiry();
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    if(!selection)return;
    const modal=dialog.current!;
    const previous=document.documentElement.style.overflow;
    modal.showModal();document.documentElement.style.overflow='hidden';
    return()=>{modal.close();document.documentElement.style.overflow=previous;};
  },[selection]);
  const product=selection?.name??'';
  const enquiry=selection&&selection.category!==product?`${product} (${selection.category})`:product;
  return <dialog ref={dialog} className="service-dialog product-enquiry-dialog" aria-labelledby="product-enquiry-title" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target!==event.currentTarget)return;const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)onClose();}}>
    {selection&&<div className="service-dialog-body">
      <button type="button" className="dialog-close" aria-label="Close product enquiry" onClick={onClose} autoFocus>×</button>
      <p className="mono dialog-eyebrow">PanVibes Exim / Product enquiry</p><h2 id="product-enquiry-title">{product}</h2>
      <p className="dialog-description">{selection.category!==product?selection.category:'Explore sourcing, specifications and availability with our team.'}</p>
      <div className="service-contact-card"><p className="mono">Your point of contact</p>
        <div className="service-person"><span>OM</span><div><strong>{contact.name}</strong><p>{contact.role}</p></div></div>
        <a href={`tel:+${contact.phone}`}>{contact.displayPhone}<Arrow diagonal/></a>
        <a className="service-contact-cta" href={`https://wa.me/${contact.phone}?text=${encodeURIComponent(`Hello Omkar, I am interested in ${enquiry}. Please share specifications, availability and a quotation.`)}`} target="_blank" rel="noreferrer">Enquire on WhatsApp<Arrow/></a>
        <button className="service-website-enquiry" type="button" onClick={()=>openEnquiry({product,purpose:'Bulk quotation'})}>Fill enquiry form<Arrow diagonal/></button>
      </div>
    </div>}
  </dialog>;
}
