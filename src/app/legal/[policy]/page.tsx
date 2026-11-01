import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { lexer } from 'marked';
import { getPolicies } from '@/lib/editorial.mjs';
import { Markdown } from '@/components/markdown';
import { PageIntro } from '@/components/marketing';
import { getSite } from '@/lib/site.mjs';
export async function generateStaticParams() { return Object.keys(await getPolicies()).map(policy => ({ policy })); }
export async function generateMetadata({ params }: { params: Promise<{ policy: string }> }): Promise<Metadata> {
  const { policy } = await params;
  const policies = await getPolicies();
  if (!Object.hasOwn(policies, policy)) return { title: 'Page not found' };
  const content = policies[policy as keyof typeof policies];
  return { title: content.title, alternates: { canonical: `/legal/${policy}` }, ...(!content.approved ? { robots: { index: false, follow: false } } : {}) };
}
export default async function Policy({ params }: { params: Promise<{ policy: string }> }) {
  const { policy } = await params;
  const policies = await getPolicies();
  if (!Object.hasOwn(policies, policy)) notFound();
  const content = policies[policy as keyof typeof policies];
  const published = content.approved && content.body && content.reviewedAt;
  const site = getSite();
  return <><PageIntro label="Policies & information" title={content.title}><p>{published ? `Last reviewed ${content.reviewedAt}.` : 'Contact the team for the terms that apply to your service.'}</p></PageIntro><section className="container content-section" style={{ maxWidth: 840 }}>{published ? <div className="article-prose"><Markdown tokens={lexer(content.body)} /></div> : <div className="empty-state"><h2>Request your service terms</h2><p>Ropulse is a brand of {site.company}, Pakistan.</p><p>Subscription checkout remains unavailable while commercial policies and payment services are being prepared.</p><p>No payment or account credentials are collected on this page.</p><Link href="/support" className="text-link">Contact the Ropulse team →</Link></div>}</section></>;
}
