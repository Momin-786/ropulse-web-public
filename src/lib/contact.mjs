import { email } from './site.mjs';

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
