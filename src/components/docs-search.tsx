'use client';
import Link from 'next/link';
import { useDeferredValue, useState } from 'react';
import { searchArticles } from '@/lib/search.mjs';
import { Icon } from './icon';
export type SearchDocument = { slug: string; title: string; group: string; description: string; headings: string; text: string; status?: string };
const roles: Record<string, string[]> = { owner: ['Set up', 'Account'], service: ['Day to day', 'Help'], manager: ['Manage', 'Set up', 'Help'] };
export function DocsSearch({ documents, initialRole = '', initialQuery = '' }: { documents: SearchDocument[]; initialRole?: string; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery.slice(0, 200));
  const [role, setRole] = useState(Object.hasOwn(roles, initialRole) ? initialRole : '');
  const deferred = useDeferredValue(query);
  const filtered = role ? documents.filter(d => roles[role].includes(d.group)) : documents;
  const results = searchArticles(filtered, deferred);
  return <div className="manual-results"><div className="manual-search-panel"><label htmlFor="manual-search">What would you like to do?</label><div className="docs-search"><Icon name="search" size={22} /><input id="manual-search" aria-label="Search the user manual" type="search" placeholder="Search receipts, held orders, staff…" value={query} maxLength={200} onChange={e => setQuery(e.target.value)} /></div><span className="manual-filter-label">Guides for your role</span><div className="role-tabs" role="group" aria-label="Filter guides by role">{[['', 'All guides'], ['owner', 'Owners'], ['service', 'Service team'], ['manager', 'Managers']].map(([value, label]) => <button type="button" key={value} aria-pressed={role === value} onClick={() => setRole(value)}>{label}</button>)}</div></div><p className="search-status" role="status">{results.length} {results.length === 1 ? 'guide' : 'guides'}{deferred ? ` matching “${deferred}”` : ' to explore'}{role ? ' for this role' : ''}</p>{results.length ? <div className="guide-grid">{results.map(item => <Link className="guide-card" key={item.slug} href={`/docs/${item.slug}`}><span className="small-label">{item.group}</span>{item.status !== 'published' && <span className="review-pill guide-review-label">Draft guide</span>}<h2>{item.title}</h2><p>{item.snippet}</p><span>Read the guide <Icon name="arrow" size={17} /></span></Link>)}</div> : <div className="empty-state"><Icon name="book" size={30} /><h2>{documents.length ? 'Try a different word.' : 'The manual is being reviewed.'}</h2><p>{documents.length ? 'Search an item or action such as “printer”, “refund” or “branch”. You can also select All guides to broaden your search.' : 'Practical guides are being checked against the released app before publication. Start with the first-branch preparation checklist or contact your onboarding team.'}</p>{!documents.length && <Link href="/get-started" className="text-link">First-branch checklist <Icon name="arrow" size={18} /></Link>}</div>}</div>;
}
