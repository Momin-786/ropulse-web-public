import publication from '../content/manual-publication.json' with { type: 'json' };
/** @type {Record<string, {status:string,reviewer:string|null,reviewedAt:string|null,release:string|null}>} */
const publicationRecords = publication;
// Only these files can become website articles. Never enumerate the docs directory.
export const manual = [
  ['01-getting-started.md', 'getting-started', 'Get started', 'Set up', 'Access, invitations and first-day checks.'],
  ['02-business-branches-and-staff.md', 'business-and-staff', 'Business, branches & staff', 'Set up', 'Prepare your outlets, roles, staff and schedules.'],
  ['03-products-modifiers-and-layouts.md', 'products-and-layouts', 'Products, modifiers & layouts', 'Set up', 'Build a catalog and prepare the Register.'],
  ['04-prices-taxes-and-payment-setup.md', 'prices-and-payment-setup', 'Prices, taxes & payment setup', 'Set up', 'Check prices, currencies, charges and accepted methods.'],
  ['05-register-and-checkout.md', 'register-and-checkout', 'Register & checkout', 'Day to day', 'Take an order, hold it and complete a sale.'],
  ['06-restaurant-service-and-kitchen.md', 'restaurant-and-kitchen', 'Restaurant service & kitchen', 'Day to day', 'Tables, courses, preparation tickets and handover.'],
  ['07-payments-receipts-and-corrections.md', 'payments-and-receipts', 'Payments, receipts & corrections', 'Day to day', 'Tender, receipts, refunds and payment uncertainty.'],
  ['08-customers-loyalty-and-engagement.md', 'customers-and-loyalty', 'Customers & loyalty', 'Day to day', 'Customer records, balances and engagement.'],
  ['09-stock-ingredients-and-recipes.md', 'stock-and-recipes', 'Stock, ingredients & recipes', 'Manage', 'Counts, adjustments, units and recipe costing.'],
  ['10-shifts-reports-and-audit.md', 'shifts-and-reports', 'Shifts, reports & audit', 'Manage', 'Open, reconcile, close and investigate.'],
  ['11-hardware-and-printing.md', 'hardware-and-printing', 'Printers, receipts & KOT', 'Help', 'Install and connect printers, route kitchen tickets, bind devices and troubleshoot output.'],
  ['12-connectivity-and-troubleshooting.md', 'troubleshooting', 'Connectivity & troubleshooting', 'Help', 'Recover uncertain operations and protect your records.'],
  ['13-subscription-and-support.md', 'subscription-and-support', 'Subscription & support', 'Account', 'Software subscriptions, renewal and support.'],
  ['14-orders-approvals-and-administration.md', 'orders-and-administration', 'Orders & administration', 'Manage', 'Find orders, handle approvals and review history.'],
  ['15-website-account-and-billing.md', 'website-account-and-billing', 'Website account & billing', 'Account', 'Planned shared-account and automated billing journey.'],
].map(([file, slug, title, group, description]) => ({
  file, slug, title, group, description,
  status: 'review', reviewer: null, reviewedAt: null, release: null,
  ...publicationRecords[slug],
  billingGated: file.startsWith('13-') || file.startsWith('15-'),
}));
export function approvedArticle(article) {
  return article.status === 'published' && Boolean(article.reviewer && article.reviewedAt && article.release);
}
export function availableArticles(review = false) {
  return manual.filter(article => review || approvedArticle(article));
}
export function articlePath(file, review = false) {
  const name = file.replace(/^.*\//, '');
  if (name === 'README.md') return '/docs';
  const article = availableArticles(review).find(item => item.file === name);
  return article ? `/docs/${article.slug}` : '/docs';
}
