'use client';
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Image from 'next/image';
import Link from '@/components/SiteLink';
import { csvFields } from '@/lib/enquiry-csv';

type Enquiry = Record<string, string | number | null> & { reference: string; created_at: string; name: string; company: string; email: string; product: string; status: string; email_status: string };
type Dashboard = { summary: { total: number; unread: number; week: number; failedEmails: number }; rows: Enquiry[]; count: number; page: number; pages: number };
type Screen = 'loading' | 'login' | 'request' | 'reset' | 'dashboard';
const logo = '/images/panvibes-logo-ffad64e4ba54.webp';

async function api(path: string, body?: unknown) {
  const response = await fetch('/api/admin/' + path, { method: body ? 'POST' : 'GET', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
  const result = await response.json();
  if (!response.ok) throw new Error(response.status === 401 && path !== 'auth' ? 'Your session expired. Sign in again.' : result.error || 'Please try again.');
  return result;
}

export default function AdminDashboard() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false), [data, setData] = useState<Dashboard | null>(null);
  const [search, setSearch] = useState(''), [query, setQuery] = useState(''), [status, setStatus] = useState(''), [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const detail = useRef<HTMLDialogElement>(null);
  const changeScreen = (next: Screen) => { setError(''); setNotice(''); setScreen(next); };
  useEffect(() => { let active = true; api('auth').then(result => { if (active) { setUsername(result.user?.username || ''); setScreen(result.user ? 'dashboard' : 'login'); } }).catch(() => { if (active) setScreen('login'); }); return () => { active = false; }; }, []);
  const load = useCallback(async () => {
    try { const result = await api(`enquiries?search=${encodeURIComponent(query)}&status=${status}&page=${page}`); setData(result); }
    catch (failure) { const message = (failure as Error).message; setError(message); if (message.includes('session expired')) setScreen('login'); }
  }, [query, status, page]);
  useEffect(() => {
    let active = true;
    if (screen === 'dashboard') api(`enquiries?search=${encodeURIComponent(query)}&status=${status}&page=${page}`).then(result => { if (active) setData(result); }).catch(failure => { if (active) { setError(failure.message); if (failure.message.includes('session expired')) setScreen('login'); } });
    return () => { active = false; };
  }, [screen, query, status, page]);
  useEffect(() => { if (selected && !detail.current?.open) detail.current?.showModal(); }, [selected]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    const fields = new FormData(event.currentTarget), name = String(fields.get('username') || username);
    try {
      if (screen === 'reset' && fields.get('password') !== fields.get('confirm')) throw new Error('The new passwords do not match.');
      const result = await api('auth', { action: screen === 'login' ? 'login' : screen === 'request' ? 'reset-request' : 'reset-confirm', username: name, password: fields.get('password') || '', code: fields.get('code') || '' });
      setUsername(name);
      if (screen === 'login') setScreen('dashboard');
      else if (screen === 'request') { setScreen('reset'); setNotice(result.message); }
      else { setScreen('login'); setNotice(result.message); }
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }

  async function update(action: { reference: string; status?: string; action?: string }) {
    setBusy(true); setError(''); setNotice('');
    try { const result = await api('enquiries', action); if (action.status) setSelected(current => current ? { ...current, status: action.status! } : null); if (action.action) { setSelected(current => current ? { ...current, email_status: result.emailDelivery } : null); setNotice(result.emailDelivery === 'sent' ? 'Notification email sent.' : 'Email delivery is still pending. The enquiry remains saved.'); } await load(); }
    catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }

  if (screen !== 'dashboard') return <main className="admin-shell admin-auth-shell">
    <section className="admin-auth-story">
      <div className="admin-story-top"><span className="admin-brand-tile"><Image src={logo} alt="PanVibes Exim" width={220} height={81} priority/></span><span className="admin-story-label">TEAM WORKSPACE</span></div>
      <div className="admin-story-copy"><p className="admin-eyebrow">CONNECTED TRADE. CLEAR CONVERSATIONS.</p><h1>Good business <br/>starts with a <br/><em>conversation.</em></h1><p>One place for every buyer, every requirement, and your next connection.</p></div>
      <TradeRoutes/>
      <div className="admin-story-footer"><span>QUALITY · TRUST · GLOBAL</span><span>PanVibes Exim</span></div>
    </section>
    <section className="admin-auth-form"><div className="admin-login-card" key={screen}>
      <div className="admin-login-mark"><AdminIcon name={screen === 'reset' || screen === 'request' ? 'lock' : 'inbox'}/></div>
      <p className="admin-eyebrow">PANVIBES / ENQUIRY WORKSPACE</p><h2>{screen === 'loading' ? 'One moment.' : screen === 'login' ? 'Welcome back.' : screen === 'request' ? 'A fresh start.' : 'Check your email.'}</h2>
      <p className="admin-login-description">{screen === 'login' ? 'Sign in to keep your enquiries moving.' : screen === 'request' ? 'Enter your username. We’ll send a reset code to the configured info mailbox.' : screen === 'reset' ? 'Enter your six-digit code and choose a new password.' : 'Opening your workspace…'}</p>
      {notice && <p className="admin-notice" role="status">{notice}</p>}{error && <p className="admin-error" role="alert">{error}</p>}
      {screen !== 'loading' ? <form onSubmit={authenticate}>
        <label>Username<input name="username" autoComplete="username" required maxLength={100} defaultValue={username} placeholder="Your administrator username"/></label>
        {screen === 'reset' && <label>Reset code<input name="code" className="admin-code-input" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required placeholder="000000"/></label>}
        {screen !== 'request' && <label>{screen === 'reset' ? 'New password' : 'Password'}<input name="password" type="password" autoComplete={screen === 'reset' ? 'new-password' : 'current-password'} minLength={screen === 'reset' ? 12 : undefined} maxLength={128} required placeholder={screen === 'reset' ? 'Choose a strong password' : 'Enter your password'}/></label>}
        {screen === 'reset' && <label>Confirm new password<input name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} required placeholder="Enter your new password again"/><small>At least 12 characters.</small></label>}
        {screen === 'login' && <button type="button" className="admin-text-button admin-forgot" disabled={busy} onClick={() => changeScreen('request')}>Forgot password?</button>}
        <button className="admin-primary" disabled={busy}>{busy && <span className="admin-spinner" aria-hidden="true"/>}{busy ? 'Please wait…' : screen === 'login' ? 'Sign in' : screen === 'request' ? 'Send reset code' : 'Save new password'}</button>
      </form> : <div className="admin-loading-line" role="status"><span/>Opening your workspace</div>}
      {screen !== 'login' && screen !== 'loading' && <div className="admin-reset-navigation">{screen === 'reset' && <button className="admin-text-button" disabled={busy} onClick={() => changeScreen('request')}>Request a new code</button>}<button className="admin-text-button" disabled={busy} onClick={() => changeScreen('login')}>Back to sign in</button></div>}
      <div className="admin-login-bottom"><Link className="admin-back-link" href="/">Back to website</Link><span><AdminIcon name="lock"/>Private team access</span></div>
    </div><span className="admin-auth-caption">PanVibes Exim · Enquiry management</span></section>
  </main>;

  const statCards = [
    {label:'Total enquiries',value:data?.summary.total,description:'All buyer requirements',icon:'inbox'},
    {label:'New enquiries',value:data?.summary.unread,description:'Waiting for your review',icon:'conversation'},
    {label:'Last 7 days',value:data?.summary.week,description:'Recent conversations',icon:'calendar'},
    {label:'Emails to retry',value:data?.summary.failedEmails,description:'Notification follow-up',icon:'mail'},
  ];
  return <main className="admin-shell admin-workspace">
    <aside className="admin-sidebar"><div className="admin-sidebar-brand"><Image src={logo} alt="PanVibes Exim" width={190} height={70} priority/><span>ENQUIRY WORKSPACE</span></div><div className="admin-sidebar-menu"><span className="admin-nav-caption">WORKSPACE</span><div className="admin-sidebar-item" aria-current="page"><AdminIcon name="inbox"/><span>Enquiries</span><b>{data?.summary.total ?? '—'}</b></div></div><div className="admin-sidebar-note"><span className="admin-note-rule"/><p>Every connection<br/>starts here.</p></div><div className="admin-account"><span className="admin-account-avatar" aria-hidden="true">{username.slice(0,2).toUpperCase()}</span><div><span>TEAM ACCOUNT</span><strong>{username}</strong></div><button onClick={async () => { try { await api('auth', { action: 'logout' }); setData(null); changeScreen('login'); } catch { setError('Sign out failed. Try again.'); } }}>Sign out</button></div></aside>
    <section className="admin-content">
      <header className="admin-topline"><span className="admin-eyebrow">WORKSPACE <i>/</i> ENQUIRIES</span><Link href="/" target="_blank" rel="noopener noreferrer">View website</Link></header>
      <div className="admin-page-heading"><div><p className="admin-eyebrow">YOUR BUSINESS, IN CONVERSATION</p><h1>Enquiries<span aria-hidden="true">.</span></h1><p>A clear view of the people and requirements coming your way.</p></div><a className="admin-primary admin-export" href="/api/admin/export">Download all enquiries (CSV)</a></div>
      {error && <p className="admin-error" role="alert">{error}</p>}{notice && <p className="admin-notice" role="status">{notice}</p>}
      <div className="admin-stats">{statCards.map((stat,i) => <article key={stat.label} className={i === 0 ? 'admin-stat-featured' : ''}><div className="admin-stat-top"><span>{stat.label}</span><AdminIcon name={stat.icon}/></div><strong>{stat.value ?? '—'}</strong><p>{stat.description}</p></article>)}</div>
      <section className="admin-inbox"><div className="admin-inbox-heading"><div><h2>Enquiry inbox <span>{data?.count ?? 0}</span></h2><p>From first hello to the next step.</p></div><button className="admin-text-button" onClick={load}>Refresh</button></div>
        <form className="admin-filters" onSubmit={event => { event.preventDefault(); setPage(1); setQuery(search); }}><label className="admin-search-field"><span className="admin-sr-only">Search enquiries</span><AdminIcon name="search"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search buyers, products or references" maxLength={200}/></label><button className="admin-secondary">Search</button><label className="admin-status-field"><span className="admin-sr-only">Filter by status</span><select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option><option value="new">New</option><option value="reviewed">Reviewed</option><option value="closed">Closed</option></select></label></form>
        <div className="admin-table-wrap"><table><thead><tr><th>Buyer / reference</th><th>Requirement</th><th>Destination</th><th>Received</th><th>Status</th><th><span className="admin-sr-only">Details</span></th></tr></thead><tbody>{data?.rows.map(row => <tr key={row.reference}><td data-label="Buyer"><strong>{row.name}</strong><span>{row.company}</span><small className="admin-reference">{row.reference}</small></td><td data-label="Requirement"><strong>{row.product || row.service || 'General enquiry'}</strong><span>{row.quantity || 'Quantity to discuss'}</span></td><td data-label="Destination">{String(row.shipping_market)}{row.destination_details && <span>{row.destination_details}</span>}</td><td data-label="Received">{new Date(row.created_at).toLocaleDateString('en-GB')}<span>{new Date(row.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span></td><td data-label="Status"><span className={'admin-badge admin-badge-' + row.status}>{row.status}</span><small className={row.email_status === 'failed' ? 'admin-mail-failed' : ''}>Email: {row.email_status}</small></td><td className="admin-view-cell"><button className="admin-detail-button" onClick={() => setSelected(row)}>View enquiry</button></td></tr>)}</tbody></table></div>
        {data && !data.rows.length && <div className="admin-empty"><span className="admin-empty-art"><AdminIcon name={query || status ? 'search' : 'inbox'}/><i/></span><strong>{query || status ? 'No matching enquiries.' : 'Your next connection starts here.'}</strong><p>{query || status ? 'Try a different buyer, product or status.' : 'New website enquiries will appear here, ready for your team.'}</p>{(query || status) && <button className="admin-text-button" onClick={() => {setSearch('');setQuery('');setStatus('');setPage(1);}}>Clear filters</button>}</div>}
        <footer className="admin-pagination"><span>{data?.count ?? 0} enquiries <i>·</i> Page {page} of {data?.pages ?? 1}</span><div><button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button disabled={!data || page >= data.pages} onClick={() => setPage(page + 1)}>Next</button></div></footer>
      </section><p className="admin-footnote"><AdminIcon name="lock"/>Only your team can access buyer details. CSV downloads include all saved enquiries.</p>
    </section>
    <dialog className="admin-detail" ref={detail} onClose={() => setSelected(null)} onCancel={() => setSelected(null)}>{selected && <><div className="admin-detail-heading"><div><p className="admin-eyebrow">ENQUIRY DETAILS</p><h2>{selected.reference}</h2></div><button onClick={() => detail.current?.close()} aria-label="Close enquiry details">×</button></div>{error && <p className="admin-error" role="alert">{error}</p>}{notice && <p className="admin-notice" role="status">{notice}</p>}<div className="admin-detail-actions"><label>Follow-up status<select value={selected.status} disabled={busy} onChange={e => update({reference:selected.reference,status:e.target.value})}><option value="new">New</option><option value="reviewed">Reviewed</option><option value="closed">Closed</option></select></label><a href={`mailto:${selected.email}`}>Reply to buyer</a>{['failed','not sent','pending','sending'].includes(selected.email_status) && <button disabled={busy} onClick={() => update({reference:selected.reference,action:'retry-email'})}>Retry notification email</button>}</div><dl>{Object.entries(csvFields).map(([key,label]) => <div key={key}><dt>{label}</dt><dd>{String(selected[key] || 'Not provided')}</dd></div>)}</dl><p className="admin-detail-note">Email delivery: {selected.email_status}</p></>}</dialog>
  </main>;
}

function AdminIcon({name}:{name:string}) {
  const paths:Record<string,ReactNode> = {
    inbox:<><path d="M4 4h16v16H4z"/><path d="M4 13h5l2 3h2l2-3h5"/></>,
    conversation:<><path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 8h8M8 12h5"/></>,
    calendar:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16m-11 4h2m3 0h2"/></>,
    mail:<><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></>,
    search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
    lock:<><rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.inbox}</svg>;
}

function TradeRoutes() {
  return <div className="admin-trade-art" aria-hidden="true"><svg viewBox="0 0 600 240" fill="none"><defs><pattern id="admin-route-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="currentColor" opacity=".15"/></pattern></defs><rect width="600" height="240" fill="url(#admin-route-grid)"/><g className="admin-route-lines" stroke="currentColor" strokeWidth="1.2"><path d="M74 164C152 164 138 54 256 54S370 180 456 180"/><path d="M172 202C270 202 242 54 256 54S378 60 524 60"/><path d="M74 164C182 164 348 112 524 60"/></g><g fill="#e5643d"><circle cx="74" cy="164" r="5"/><circle cx="256" cy="54" r="6"/><circle cx="456" cy="180" r="5"/></g><g fill="currentColor"><circle cx="172" cy="202" r="4"/><circle cx="524" cy="60" r="4"/></g><g fill="currentColor" fontSize="10" fontFamily="SteinhartMono,monospace" letterSpacing="2"><text x="68" y="144">USA</text><text x="245" y="33">INDIA</text><text x="448" y="207">UAE</text><text x="150" y="230">UK</text><text x="497" y="40">EUROPE</text></g></svg></div>;
}
