import brand from '../content/brand.json' with { type: 'json' };
export function httpsUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.toString() : null;
  } catch { return null; }
}
export function siteOrigin(value) {
  try {
    const url = new URL(value || 'http://localhost:3000');
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) return 'http://localhost:3000';
    if (url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) return url.origin;
  } catch { /* fall through */ }
  return 'http://localhost:3000';
}
export function email(value) {
  return typeof value === 'string' && /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) && value.length <= 254 ? value : null;
}
export function isReviewMode(env = process.env) {
  return env.DOCS_REVIEW_MODE === 'true' || (env.NODE_ENV === 'development' && env.DOCS_REVIEW_MODE !== 'false');
}
export function getSite(env = process.env) {
  return {
    origin: siteOrigin(env.SITE_URL),
    company: env.COMPANY_NAME?.trim() || brand.seller,
    supportHours: brand.supportHours,
    supportEmail: email(env.SUPPORT_EMAIL || brand.supportEmail), salesEmail: email(env.SALES_EMAIL),
    identityUrl: httpsUrl(env.IDENTITY_URL),
    review: isReviewMode(env),
    manualReview: isReviewMode(env) || env.DOCS_PUBLIC_DRAFTS !== 'false',
    indexable: env.SITE_INDEXABLE === 'true' && !isReviewMode(env) && siteOrigin(env.SITE_URL).startsWith('https:'),
  };
}
