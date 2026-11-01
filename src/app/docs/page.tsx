import type { Metadata } from 'next';
import { DocsSearch } from '@/components/docs-search';
import { DocsNav } from '@/components/docs-nav';
import { Eyebrow } from '@/components/marketing';
import { PrinterGuideFeature } from '@/components/printer-guide-feature';
import { getGuideList, getSearchDocuments } from '@/lib/editorial.mjs';
import { getSite } from '@/lib/site.mjs';
import Link from 'next/link';
export const metadata: Metadata = { title: 'User manual', robots: { index: !getSite().manualReview && getSite().indexable, follow: getSite().indexable }, description: 'Practical RoPulse guides for owners, managers and the service team.', alternates: { canonical: '/docs' } };
export default async function DocsHome({ searchParams }: { searchParams: Promise<{ role?: string; q?: string }> }) {
  const site = getSite();
  const { role, q } = await searchParams;
  const articles = await getGuideList(site.manualReview);
  const documents = await getSearchDocuments(site.manualReview);
  const showPrinterGuide = articles.some(article => article.slug === 'hardware-and-printing');
  return <>{site.manualReview && <div className="docs-banner"><div className="container"><strong>Manual review edition.</strong> These draft guides require release walkthroughs. Review pages are excluded from search engines.</div></div>}<section className="container docs-intro"><Link href="/resources" className="resource-breadcrumb">← All resources</Link><Eyebrow>The RoPulse user manual</Eyebrow><h1>Find the task.<br />Follow the steps.</h1><p className="lead">Practical guidance for owners, managers and the service team. Search below or choose the role that fits your day.</p>{showPrinterGuide && <PrinterGuideFeature />}</section><div className="container docs-layout"><DocsNav articles={articles} /><DocsSearch documents={documents} initialRole={typeof role === 'string' ? role : ''} initialQuery={typeof q === 'string' ? q : ''} /></div></>;
}
