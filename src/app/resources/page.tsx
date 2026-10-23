import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow } from '@/components/marketing';
import { Icon } from '@/components/icon';
import { ProductGallery } from '@/components/product-gallery';
import './resources.css';
export const metadata: Metadata = { title: 'Resources', alternates: { canonical: '/resources' }, description: 'Find RoPulse setup guidance, the user manual, real app screens, downloads and support in one place.' };
const resources = [
  { href: '/get-started', icon: 'check', label: 'START HERE', title: 'Prepare your first branch', text: 'A practical checklist for your business, team, devices and first training sale.', action: 'Follow the checklist' },
  { href: '/docs', icon: 'book', label: 'LEARN THE WORKFLOW', title: 'The user manual', text: 'Search by task, browse by role, and find the steps your team needs.', action: 'Browse the manual' },
  { href: '/tour', icon: 'terminal', label: 'SEE IT IN CONTEXT', title: 'Inside the app', text: 'Explore real Register screens with sample orders, tables and products.', action: 'Explore the screens' },
  { href: '/downloads', icon: 'box', label: 'INSTALL & UPDATE', title: 'App downloads', text: 'Find approved installers, supported platforms and release requirements as they are published.', action: 'View downloads' },
  { href: '/release-notes', icon: 'ticket', label: 'WHAT’S CHANGED', title: 'Release notes', text: 'Review changes for your installed version before planning an update.', action: 'Check release notes' },
  { href: '/support', icon: 'shield', label: 'GET A HAND', title: 'Help & support', text: 'Prepare the right references and find the next step when something needs attention.', action: 'Find help' },
];
export default function Resources() {
  return <><section className="resource-hero"><div className="container"><Eyebrow>The RoPulse resource centre</Eyebrow><h1>A clearer answer.<br /><span>A smoother day.</span></h1><p className="lead">Setting up, serving customers or closing the shift?<br />Start with what you need to do.</p><form className="resource-search-form" action="/docs" method="get" role="search"><label htmlFor="resource-query">Search the user manual</label><div><Icon name="search" size={22} /><input id="resource-query" name="q" type="search" maxLength={200} placeholder="Try receipt, staff or printer" /><button type="submit" aria-label="Search guides"><Icon name="arrow" size={22} /></button></div></form></div></section><section className="container section resource-section"><div className="section-heading"><div><Eyebrow>Your next step</Eyebrow><h2>The right help,<br />in the right place.</h2></div><p>Explore the product, prepare your team,<br />or find help with a specific task.</p></div><div className="resource-grid">{resources.map(item => <Link key={item.href} href={item.href} className="resource-card"><span className="resource-icon"><Icon name={item.icon} size={27} /></span><span className="small-label">{item.label}</span><h2>{item.title}</h2><p>{item.text}</p><span className="resource-action">{item.action}<Icon name="arrow" size={19} /></span></Link>)}</div></section><ProductGallery area="setup" /><section className="container cta-wrap"><div className="resource-help"><Icon name="ticket" size={30} /><div><h2>Can’t find the answer?</h2><p>Tell us the task you’re working on. We’ll help you find the next step.</p></div><Link href="/support" className="button">Get support <Icon name="arrow" size={19} /></Link></div></section></>;
}
