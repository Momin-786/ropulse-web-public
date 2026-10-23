import type { MetadataRoute } from 'next';
import { getSite } from '@/lib/site.mjs';
export default function robots(): MetadataRoute.Robots {
  const site = getSite();
  return site.indexable ? { rules: { userAgent: '*', allow: '/', disallow: ['/account', '/login', '/signup', '/checkout', '/api/'] }, sitemap: `${site.origin}/sitemap.xml` } : { rules: { userAgent: '*', disallow: '/' } };
}
