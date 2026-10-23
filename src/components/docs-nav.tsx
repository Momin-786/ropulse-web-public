'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from './icon';
type Article = { slug: string; title: string; group: string };
export function DocsNav({ articles, current }: { articles: Article[]; current?: string }) {
  const [open, setOpen] = useState(false);
  const groups = [...new Set(articles.map(a => a.group))];
  const groupIcons: Record<string, string> = { 'Set up': 'terminal', 'Day to day': 'ticket', Manage: 'chart', Help: 'book', Account: 'shield' };
  return <aside className="docs-nav" aria-label="Manual navigation"><button type="button" className="docs-nav-toggle" aria-expanded={open} aria-controls="guide-navigation" onClick={() => setOpen(!open)}>Browse the manual <span aria-hidden="true">{open ? '−' : '+'}</span></button><nav id="guide-navigation" className={`docs-nav-content${open ? ' is-open' : ''}`} aria-label="User guides"><Link href="/docs" className="manual-overview-link" aria-current={current ? undefined : 'page'}><Icon name="book" size={17} />Manual overview</Link>{groups.map(group => {
    const items = articles.filter(a => a.group === group);
    return <details className="docs-nav-group" key={group} open><summary><Icon name={groupIcons[group] || 'book'} size={16} /><h2>{group}</h2><span className="docs-group-count" aria-label={`${items.length} guides`}>{items.length}</span><span className="docs-group-chevron" aria-hidden="true">⌄</span></summary><div className="docs-group-links">{items.map(a => <Link key={a.slug} href={`/docs/${a.slug}`} aria-current={current === a.slug ? 'page' : undefined} onClick={() => setOpen(false)}>{a.title}</Link>)}</div></details>;
  })}</nav></aside>;
}
