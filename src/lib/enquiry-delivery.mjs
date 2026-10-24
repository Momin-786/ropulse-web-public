// Import only from server routes, server components and launch tooling.
// Keep this separate from contact.mjs, whose validation runs in the browser.
import { email, httpsUrl } from './site.mjs';
import { verifyTurnstile } from './turnstile.mjs';

export function enquiryDeliveryConfig(env = process.env) {
  // An incomplete Resend setup must not silently fall back to another receiver.
  if (env.RESEND_API_KEY || env.CONTACT_FROM_EMAIL || env.CONTACT_TO_EMAIL) {
    const apiKey = env.RESEND_API_KEY?.trim();
    const from = env.CONTACT_FROM_EMAIL?.trim();
    const address = from?.match(/^[^<>\r\n]+<([^<>]+)>$/)?.[1] || from;
    const recipients = (env.CONTACT_TO_EMAIL || '').split(',').map(item => item.trim());
    if (!apiKey || /[\r\n]/.test(apiKey) || !email(address) || /[\r\n]/.test(from || '') ||
        !recipients.length || recipients.length > 50 || recipients.some(item => !email(item))) return null;
    return { provider: 'resend', endpoint: 'https://api.resend.com/emails', token: apiKey, from, to: [...new Set(recipients)] };
  }
  const endpoint = httpsUrl(env.CONTACT_ENDPOINT);
  return endpoint ? { provider: 'endpoint', endpoint, token: env.CONTACT_API_TOKEN } : null;
}

export function enquiryDeliveryConfigured(env = process.env) {
  return Boolean(enquiryDeliveryConfig(env));
}

export async function deliverVerifiedEnquiry(value, { env = process.env, requestId, turnstileToken, fetcher = fetch }) {
  const verification = await verifyTurnstile(turnstileToken, { env, fetcher });
  if (!verification.ok) return verification;
  return deliverEnquiry(value, { env, requestId, fetcher });
}

export async function deliverEnquiry(value, { env = {}, endpoint = undefined, token = undefined, fetcher = fetch, requestId }) {
  const config = enquiryDeliveryConfig({ ...env, ...(endpoint ? { CONTACT_ENDPOINT: endpoint, CONTACT_API_TOKEN: token } : {}) });
  if (!config || !requestId || !/^[a-z0-9-]{1,100}$/i.test(requestId)) return { ok: false, status: 503, message: 'Enquiry delivery is not available yet. Please use the contact option shown on this page.' };
  const body = config.provider === 'resend' ? {
    from: config.from,
    to: config.to,
    subject: 'New Ropulse website enquiry',
    ...(email(value.contact) ? { reply_to: value.contact } : {}),
    text: [
      'New business enquiry from the Ropulse website', '',
      `Name: ${value.name}`, `Business: ${value.business}`, `Contact: ${value.contact}`,
      `Country: ${value.country}`, `Branches: ${value.branches}`, '',
      'Consent: Contact about this enquiry only; no marketing subscription.',
      'Consent version: demo-enquiry-v1', `Enquiry reference: ${requestId}`,
    ].join('\n'),
  } : { ...value, requestId, source: 'ropulse-website', consentVersion: 'demo-enquiry-v1' };
  try {
    const response = await fetcher(config.endpoint, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000), cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestId, ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}) },
      body: JSON.stringify(body),
    });
    if (![200, 201, 202].includes(response.status)) throw new Error('Not accepted');
    if (config.provider === 'resend') {
      const receipt = await response.json();
      if (typeof receipt?.id !== 'string' || !receipt.id.trim()) throw new Error('Missing email receipt');
    }
    return { ok: true, status: 200, message: 'Your enquiry has been accepted for delivery to the team. We’ll use the contact details you provided to arrange the next step.' };
  } catch {
    return { ok: false, status: 502, message: 'We could not confirm delivery. Keep this enquiry open and use the same request to retry, or contact the team directly.' };
  }
}
