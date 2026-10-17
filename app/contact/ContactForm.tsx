'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { company, services } from '@/lib/site-content';

export default function ContactForm(){
  const select=useRef<HTMLSelectElement>(null);
  const message=useRef<HTMLTextAreaElement>(null);
  const [subject,setSubject]=useState('General');
  const [draft,setDraft]=useState('');
  const [copied,setCopied]=useState(false);
  useEffect(()=>{const params=new URLSearchParams(window.location.search),choice=params.get('service'),product=params.get('product');if(select.current&&choice&&services.some(item=>item.title.join(' ')===choice))select.current.value=choice;if(product&&select.current&&message.current){select.current.value='Product sourcing';message.current.value=`I am interested in ${product}. Please share specifications, availability and a quotation.`;}},[]);
  function prepare(event:FormEvent<HTMLFormElement>){
    event.preventDefault();const data=new FormData(event.currentTarget);
    const body=`Hello PanVibes Exim,\n\n${data.get('message')}\n\nEnquiry: ${data.get('service')||'General enquiry'}\nName: ${data.get('name')}\nCompany: ${data.get('company')||'—'}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')||'—'}`;
    setDraft(body);setSubject(String(data.get('service')||'General'));setCopied(false);
  }
  return <form className="contact-form" onSubmit={prepare} onChange={()=>setDraft('')}>
    <label>Your name <span>*</span><input name="name" autoComplete="name" required maxLength={100} placeholder="Full name"/></label>
    <label>Company<input name="company" autoComplete="organization" maxLength={150} placeholder="Your organisation"/></label>
    <label>Email address <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={180} placeholder="you@company.com"/></label>
    <label>Phone number<input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="Include country code"/></label>
    <label className="contact-form-wide">I’m interested in<select name="service" ref={select} defaultValue=""><option value="">Select an enquiry</option>{services.map(item=><option key={item.title.join(' ')}>{item.title.join(' ')}</option>)}<option>Product sourcing</option><option>General enquiry</option></select></label>
    <label className="contact-form-wide">Tell us a little more <span>*</span><textarea ref={message} name="message" required maxLength={4000} rows={3} placeholder="Products, destinations, quantities…"/></label>
    <div className="contact-form-action"><p>Tell us what you have in mind.<br/>We’ll help you take the next step.</p><button className="contact-submit" type="submit">Prepare enquiry <span aria-hidden="true">↗</span></button></div>
    {draft&&<div className="contact-draft" role="status"><strong>Your enquiry is ready.</strong><p>Continue in your email app to send it to PanVibes.</p><a href={`mailto:${company.email}?subject=${encodeURIComponent(`Website enquiry — ${subject}`)}&body=${encodeURIComponent(draft)}`}>Open email draft ↗</a><button type="button" onClick={async()=>{try{await navigator.clipboard.writeText(draft);setCopied(true);}catch{setCopied(false);}}}>{copied?'Copied':'Copy enquiry'}</button><small>{company.email}</small></div>}
  </form>;
}
