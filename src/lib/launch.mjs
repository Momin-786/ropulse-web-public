import { getSite, httpsUrl } from './site.mjs';
import { releaseErrors } from './releases.mjs';
import { enquiryDeliveryConfigured } from './enquiry-delivery.mjs';
import { turnstileConfigured } from './turnstile.mjs';
export function launchChecks({ env = process.env, policies, articles, releases, mode = 'site' }) {
  if (!['site', 'enquiries', 'distribution', 'paid'].includes(mode)) throw new Error('Mode must be site, enquiries, distribution or paid.');
  const site = getSite(env);
  const approved = key => Boolean(policies[key]?.approved && policies[key]?.body && policies[key]?.reviewedAt);
  const checks = [
    ['Production HTTPS site URL', site.origin.startsWith('https:')],
    ['Confirmed seller name', Boolean(site.company)],
    ['Published support contact', Boolean(site.supportEmail)],
    ['Support mailbox delivery verified', env.SUPPORT_MAILBOX_VERIFIED === 'true'],
    ['Documentation review mode disabled', !site.review],
    ['Approved privacy notice', approved('privacy')],
    ['Approved terms', approved('terms')],
    ['Patched dependencies and clean-install CI verified', env.DEPENDENCY_SECURITY_VERIFIED === 'true'],
    ['Deployed HTTPS, domain and smoke tests verified', env.DEPLOYMENT_VERIFIED === 'true'],
  ];
  if (['enquiries', 'paid'].includes(mode)) checks.push(['Enquiry delivery configuration', enquiryDeliveryConfigured(env)], ['Turnstile security configuration', turnstileConfigured(env)], ['Durable enquiry delivery and abuse controls verified', env.ENQUIRY_DELIVERY_VERIFIED === 'true']);
  if (['distribution', 'paid'].includes(mode)) checks.push(['Approved operational manual articles', articles.some(a => !a.billingGated)], ['At least one complete approved app release', releases.some(r => releaseErrors(r).length === 0)]);
  if (mode === 'paid') checks.push(['Shared identity destination', Boolean(site.identityUrl)], ['Approved billing and refund policy', approved('billing-refunds')], ['Authoritative offers, provider payments, fulfilment and cancellation verified', env.PAID_BACKEND_VERIFIED === 'true']);
  return checks;
}
