import Link from 'next/link';
import { Icon } from './icon';
import { articlePath } from '@/lib/manual-manifest.mjs';
import { getSite } from '@/lib/site.mjs';
export function Eyebrow({ children }: { children: React.ReactNode }) { return <p className="eyebrow"><span />{children}</p>; }
export function PageIntro({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return <section className="page-intro container"><Eyebrow>{label}</Eyebrow><h1>{title}</h1><div className="lead">{children}</div></section>;
}
export function CTA({ title = 'Find your rhythm with RoPulse.', description = 'Walk through the workflows that matter to your business.' }: { title?: string; description?: string }) {
  return <section className="container cta-wrap"><div className="cta-panel"><div><Eyebrow>A clearer way to work</Eyebrow><h2>{title}</h2><p>{description}</p></div><Link href="/demo" className="button button-white">Let’s talk about your business <Icon name="arrow" size={19} /></Link></div></section>;
}
export const capabilities = [
  { icon: 'terminal', title: 'A considered counter experience.', label: 'Register', text: 'Organize products, required options and order context. Keep the basket and the next action clear.', link: 'register-and-checkout' },
  { icon: 'ticket', title: 'Keep service moving.', label: 'Restaurant operations', text: 'Bring tables, courses and kitchen tickets into a deliberate service flow, with supported routing and hardware.', link: 'restaurant-and-kitchen' },
  { icon: 'box', title: 'Know what goes into every item.', label: 'Catalog & stock', text: 'Prepare products, track retail counts and organize ingredients and recipe costs with the right units.', link: 'stock-and-recipes' },
  { icon: 'chart', title: 'Close the day with context.', label: 'Backoffice', text: 'Review shifts, payment records and branch reports. Follow the original reference when a difference needs explaining.', link: 'shifts-and-reports' },
];
export function CapabilityGrid() {
  const files: Record<string, string> = { 'register-and-checkout': '05-register-and-checkout.md', 'restaurant-and-kitchen': '06-restaurant-service-and-kitchen.md', 'stock-and-recipes': '09-stock-ingredients-and-recipes.md', 'shifts-and-reports': '10-shifts-reports-and-audit.md' };
  return <div className="capability-grid">{capabilities.map((item, index) => <article className="capability" key={item.label}><div className="capability-top"><Icon name={item.icon} size={30} /><span>0{index + 1}</span></div><p className="small-label">{item.label}</p><h3>{item.title}</h3><p>{item.text}</p><Link href={articlePath(files[item.link], getSite().manualReview)} className="text-link">Read the workflow <Icon name="arrow" size={17} /></Link></article>)}</div>;
}
