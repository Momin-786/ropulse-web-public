import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { DocsNav } from '@/components/docs-nav';
import { Markdown } from '@/components/markdown';
import { PrintButton } from '@/components/print-button';
import { PlannedAccountFlow } from '@/components/planned-account-flow';
import { availableArticles } from '@/lib/manual-manifest.mjs';
import { getArticle } from '@/lib/content.mjs';
import { getSite } from '@/lib/site.mjs';
export function generateStaticParams() { return availableArticles(getSite().manualReview).map(a => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const article = getArticle(slug, getSite().manualReview);
  if (!article) return { title: 'Guide unavailable', robots: { index: false, follow: false } };
  return { title: article.title, description: article.description, alternates: { canonical: `/docs/${article.slug}` }, ...(article.status !== 'published' ? { robots: { index: false, follow: false } } : {}) };
}
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const site = getSite();
  const article = getArticle(slug, site.manualReview);
  if (!article) notFound();
  if (slug !== article.slug) permanentRedirect(`/docs/${article.slug}`);
  const articles = availableArticles(site.manualReview); const index = articles.findIndex(a => a.slug === article.slug);
  const previous = articles[index - 1]; const next = articles[index + 1];
  return <>{site.manualReview && <div className="docs-banner"><div className="container"><strong>Review edition.</strong> Confirm these instructions against your supported app and permissions before use.</div></div>}<div className="container docs-layout article-layout"><DocsNav articles={articles} current={article.slug} /><article><header className="article-header"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/docs">User manual</Link><span aria-hidden="true">/</span><span>{article.group}</span></nav><h1>{article.title}</h1><div className="article-meta"><span>{article.readingMinutes} minute read</span><span>English interface</span>{article.status !== 'published' ? <span className="review-pill">Draft · release review required</span> : <span>Reviewed {article.reviewedAt} · {article.release}</span>}</div></header>{article.billingGated && <div className="notice"><strong>Planned account and billing release.</strong> These instructions apply once the automated portal and provider flows are enabled.</div>}{article.billingGated && <PlannedAccountFlow />}<div className="article-prose"><Markdown tokens={article.tokens} review={site.manualReview} /></div><PrintButton /><nav className="article-pagination" aria-label="Related guides">{previous && <Link href={`/docs/${previous.slug}`}><small>Previous guide</small>← {previous.title}</Link>}{next && <Link href={`/docs/${next.slug}`}><small>Next guide</small>{next.title} →</Link>}</nav></article><aside className="article-toc" aria-label="On this page"><h2>On this page</h2>{article.headings.map(heading => <a key={heading.id} href={`#${heading.id}`}>{heading.text}</a>)}</aside></div></>;
}
