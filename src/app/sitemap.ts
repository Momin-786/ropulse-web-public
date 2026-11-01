import type { MetadataRoute } from 'next';
import { getSite } from '@/lib/site.mjs';
import { getGuideList, getPolicies } from '@/lib/editorial.mjs';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSite();
  if (!site.indexable) return [];
  const [articles, policies] = await Promise.all([getGuideList(false), getPolicies()]);
  const paths = ['', '/features', '/restaurant', '/retail', '/pricing', '/get-started', '/resources', '/tour', '/docs', '/demo', '/contact', '/support', '/downloads', '/release-notes'];
  return [...paths.filter(path => path !== '/docs' || !site.manualReview).map(path => ({ url: `${site.origin}${path}`, changeFrequency: 'monthly' as const })), ...articles.filter(article => !article.billingGated).map(article => ({ url: `${site.origin}/docs/${article.slug}` })), ...Object.entries(policies).filter(([, p]) => p.approved && p.body && p.reviewedAt).map(([key]) => ({ url: `${site.origin}/legal/${key}` }))];
}
