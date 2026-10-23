import type { MetadataRoute } from 'next';
import { getSite } from '@/lib/site.mjs';
import { availableArticles } from '@/lib/manual-manifest.mjs';
import policies from '@/content/policies.json';
export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite();
  if (!site.indexable) return [];
  const paths = ['', '/features', '/restaurant', '/retail', '/pricing', '/get-started', '/resources', '/tour', '/docs', '/demo', '/contact', '/support', '/downloads', '/release-notes'];
  return [...paths.filter(path => path !== '/docs' || !site.manualReview).map(path => ({ url: `${site.origin}${path}`, changeFrequency: 'monthly' as const })), ...availableArticles(false).map(article => ({ url: `${site.origin}/docs/${article.slug}` })), ...Object.entries(policies).filter(([, p]) => p.approved && p.body && p.reviewedAt).map(([key]) => ({ url: `${site.origin}/legal/${key}` }))];
}
