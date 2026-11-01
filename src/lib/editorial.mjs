// Public content comes from the repository. No external CMS is required.
import homepage from '../content/homepage.json' with { type: 'json' };
import policies from '../content/policies.json' with { type: 'json' };
import { getSite } from './site.mjs';
import { getReleases } from './releases.mjs';
import { availableArticles } from './manual-manifest.mjs';
import { getArticle, searchDocuments } from './content.mjs';

export async function getHomepage() { return homepage; }
export async function getPublicSettings() {
  const site = getSite();
  return {
    ...site,
    seoTitle: 'ROPULSE — Every order. One pulse.',
    seoDescription: 'Restaurant POS and Backoffice for orders, tables, kitchen tickets, stock and reporting.',
    footerDescription: 'Restaurant POS and backoffice for your team.',
    navigation: [
      { title: 'Product', href: '/features' },
      { title: 'Restaurants', href: '/restaurant' },
      { title: 'Retail', href: '/retail' },
      { title: 'Resources', href: '/resources' },
    ],
  };
}
export async function getPolicies() { return policies; }
export async function getPublicReleases() { return getReleases(); }
export async function getGuideList(review = false) { return availableArticles(review); }
export async function getPublicArticle(slug, review = false) { return getArticle(slug, review); }
export async function getSearchDocuments(review = false) { return searchDocuments(review); }
