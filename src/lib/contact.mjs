import { httpsUrl, email } from './site.mjs';

export function validateEnquiry(input) {
  /** @type {Record<string, string>} */
  const errors = {};
  const value = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { value, errors: { form: 'Enter your business details.' } };
  for (const [key, max] of [['name', 100], ['business', 150], ['country', 80], ['contact', 254]]) {
    const text = typeof input[key] === 'string' ? input[key].trim() : '';
    if (!text || text.length > max || /[\u0000-\u001f]/.test(text)) errors[key] = `Enter ${key === 'contact' ? 'a valid email or phone number' : `your ${key}`}${text.length > max ? ` (${max} characters maximum)` : ''}.`;
    value[key] = text;
  }
  const digits = value.contact.replace(/\D/g, '');
  const validPhone = /^\+?[\d ()-]{7,30}$/.test(value.contact) && digits.length >= 7 && digits.length <= 15;
  if (value.contact && !email(value.contact) && !validPhone) errors.contact = 'Enter a valid business email or phone number.';
  const branches = typeof input.branches === 'number' ? input.branches : Number(input.branches);
  if (!Number.isInteger(branches) || branches < 1 || branches > 10000) errors.branches = 'Enter a branch count between 1 and 10,000.';
  value.branches = branches;
  if (input.consent !== true) errors.consent = 'Confirm that we may contact you about this enquiry.';
  value.consent = input.consent === true;
  return { value, errors };
}
export async function deliverEnquiry(value, { endpoint, token, fetcher = fetch, requestId }) {
  const destination = httpsUrl(endpoint);
  if (!destination) return { ok: false, status: 503, message: 'Enquiry delivery is not available yet. Please use the contact option shown on this page.' };
  try {
    const response = await fetcher(destination, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestId, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ ...value, requestId, source: 'ropulse-website', consentVersion: 'demo-enquiry-v1' }),
    });
    // Integration contract: only HTTP 200/201/202 acknowledges accepted durable delivery.
    if (![200, 201, 202].includes(response.status)) throw new Error('Not accepted');
    return { ok: true, status: 200, message: 'Your enquiry has been received. The team will use the contact details you provided to arrange the next step.' };
  } catch {
    return { ok: false, status: 502, message: 'We could not confirm delivery. Keep this enquiry open and use the same request to retry, or contact the team directly.' };
  }
}
