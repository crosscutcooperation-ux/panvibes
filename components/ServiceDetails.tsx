'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { services } from '@/lib/site-content';
import { Arrow } from './ui';
import serviceContacts from '@/lib/service-contacts.json';
import { useEnquiry } from './EnquiryProvider';

const ServiceContext=createContext<(index:number)=>void>(()=>{});
export const useServiceDetails=()=>useContext(ServiceContext);

export default function ServiceDetails({children}:{children:ReactNode}) {
  const openEnquiry=useEnquiry();
  const dialog=useRef<HTMLDialogElement>(null);
  const previousOverflow=useRef<string|null>(null);
  const [index,setIndex]=useState(0);
  const service=services[index];
  const contact=serviceContacts.contacts[index];
  const phone=`+91 ${contact.phone.slice(2,7)} ${contact.phone.slice(7)}`;
  const whatsapp=`https://wa.me/${contact.phone}?text=${encodeURIComponent(`Hello ${contact.name.split(' ')[0]}, I am interested in ${service.title.join(' ')}. Please share details.`)}`;
  const restoreScroll=()=>{if(previousOverflow.current!==null){document.body.style.overflow=previousOverflow.current;previousOverflow.current=null;}};
  useEffect(()=>restoreScroll,[]);
  const open=(next:number)=>{setIndex(next);previousOverflow.current=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.showModal();};
  const close=()=>dialog.current?.close();
  return <ServiceContext.Provider value={open}>{children}
    <dialog ref={dialog} className="service-dialog" aria-labelledby="service-dialog-title" onClose={restoreScroll} onClick={event=>{if(event.target===event.currentTarget)close();}}>
      <div className="service-dialog-body">
        <button className="dialog-close" type="button" onClick={close} aria-label="Close service details">×</button>
        <p className="mono dialog-eyebrow">PanVibes Exim / Our expertise</p>
        <h2 id="service-dialog-title">{service.title.join(' ')}</h2>
        <p className="dialog-description">{service.description}</p>
        <ul>{contact.features.map(feature=><li key={feature}><span>↗</span>{feature}</li>)}</ul>
        <div className="service-contact-card"><p className="mono">Your point of contact</p>
          <div className="service-person"><span>{contact.name.split(' ').map(part=>part[0]).join('')}</span><div><strong>{contact.name}</strong><p>{contact.role}</p></div></div><a href={`tel:+${contact.phone}`}>{phone}<Arrow diagonal/></a>
          <a className="service-contact-cta" href={whatsapp} target="_blank" rel="noreferrer">Enquire with {contact.name.split(' ')[0]} on WhatsApp<Arrow/></a>
          <button className="service-website-enquiry" type="button" onClick={()=>openEnquiry({service:service.title.join(' ')})}>Fill enquiry form<Arrow diagonal/></button>
        </div>
      </div>
    </dialog>
  </ServiceContext.Provider>;
}
