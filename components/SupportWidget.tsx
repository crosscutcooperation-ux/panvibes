'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from '@/components/SiteLink';
import { company } from '@/lib/site-content';
import type { AssistantReply } from '@/lib/chat-assistant';
import { useEnquiry } from './EnquiryProvider';

type Message = AssistantReply & { role: 'user' | 'assistant'; id: number };
const welcome: Message = { role: 'assistant', id: 0, text: 'Hello! Looking for an ingredient or chemical? I can guide you through our catalog and help you prepare an export enquiry.' };

function BotIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 3v3m-1-3h2M5 10H3v7h2m14-7h2v7h-2" /><rect x="5" y="6" width="14" height="15" rx="5" /><path d="M8.5 12h.01m7 0h.01M9 16c1.5 1.3 4.5 1.3 6 0" strokeLinecap="round" strokeWidth="2" /></svg>; }

export default function SupportWidget() {
  const openEnquiry = useEnquiry();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const history = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const nextId = useRef(1);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else if (dialog.current?.open) { dialog.current.close(); trigger.current?.focus(); }
  }, [open]);
  useEffect(() => { if (history.current) history.current.scrollTop = history.current.scrollHeight; }, [messages]);
  async function ask(text: string) {
    const trimmed = text.trim().slice(0, 600);
    if (!trimmed || pending) return;
    const question: Message = { role: 'user', id: nextId.current++, text: trimmed };
    setMessages(current => [...current, question].slice(-30));
    setInput(''); setPending(true);
    const controller = new AbortController(); activeRequest.current = controller;
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: trimmed }), signal: controller.signal });
      const answer = await response.json();
      const reply = response.ok ? answer : { text: answer.error || 'Please try again shortly.' };
      setMessages(current => [...current, { role: 'assistant', id: nextId.current++, ...reply }].slice(-31));
    } catch {
      if (!controller.signal.aborted) {
        const answer = await import('@/lib/chat-assistant').then(({answerEnquiry})=>answerEnquiry(trimmed))
          .catch(()=>({text:`Please contact our team at ${company.email} for product and export enquiries.`,links:[{label:'Email our team',href:`mailto:${company.email}`}]}));
        if (!controller.signal.aborted) setMessages(current => [...current, { role: 'assistant' as const, id: nextId.current++, ...answer }].slice(-31));
      }
    }
    finally { if (activeRequest.current === controller) { setPending(false); activeRequest.current = null; } }
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); ask(input); }
  return <>
    <div className="support-dock" aria-label="Quick contact">
      <a className="support-email" href={`mailto:${company.email}?subject=${encodeURIComponent('B2B product enquiry — PanVibes Exim')}`} aria-label="Email PanVibes export sales" title={`Email ${company.email}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg></a>
      <button ref={trigger} className="support-launcher" type="button" onClick={() => setOpen(true)} aria-label="Open PanVibes catalog assistant" aria-haspopup="dialog" aria-expanded={open} aria-controls="catalog-assistant"><BotIcon /><span>Ask us</span></button>
    </div>
    <dialog ref={dialog} id="catalog-assistant" className="support-panel" aria-labelledby="support-title" aria-describedby="support-description" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) setOpen(false); } }}>
      <div className="support-header"><span className="support-avatar"><BotIcon /></span><div><h2 id="support-title">PanVibes Assistant</h2><p>Catalog &amp; enquiry guide</p></div><button className="support-close" type="button" aria-label="Close catalog assistant" onClick={() => setOpen(false)}>×</button></div>
      <p id="support-description" className="support-disclosure">AI-assisted catalog guide. Questions may be sent to Google Gemini; catalog guidance is available if AI is unavailable. Enquiries are stored when you submit the form.</p>
      <div ref={history} className="support-history" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversation">{messages.map(message => <div className={`support-message support-message-${message.role}`} key={message.id}><span className="support-speaker">{message.role === 'assistant' ? 'PanVibes Assistant' : 'You'}</span><p>{message.text}</p>{message.links && <div className="support-links">{message.links.map(link => link.href.startsWith('/contact') ? <button key={link.href} type="button" onClick={() => { const params = new URLSearchParams(link.href.split('?')[1] || ''); setOpen(false); openEnquiry({ product: params.get('product') || undefined, purpose: params.get('purpose') || undefined }); }}>{link.label} ↗</button> : <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label} ↗</Link>)}</div>}</div>)}</div>
      {pending && <p className="support-pending" role="status">Finding an answer…</p>}
      <div className="support-prompts">{['Product catalog', 'Chemicals', 'COA & testing', 'Export markets'].map(prompt => <button key={prompt} type="button" disabled={pending} onClick={() => ask(prompt)}>{prompt}</button>)}</div>
      <form className="support-form" onSubmit={submit}><label className="support-input-label" htmlFor="support-input">Your question</label><input id="support-input" autoFocus value={input} maxLength={600} onChange={event => setInput(event.target.value)} placeholder="Ask about a product…" autoComplete="off" /><button type="submit" disabled={!input.trim() || pending} aria-label="Send question">↑</button></form>
      <div className="support-bottom"><a href={`mailto:${company.email}`}>Email export sales ↗</a><button type="button" onClick={() => { activeRequest.current?.abort(); activeRequest.current = null; setPending(false); setMessages([welcome]); }}>Clear chat</button></div>
    </dialog>
  </>;
}
