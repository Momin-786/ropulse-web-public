'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Icon } from './icon';
import { validateEnquiry } from '@/lib/contact.mjs';
type Errors = Record<string, string>;
export function EnquiryForm({ enabled, contactEmail }: { enabled: boolean; contactEmail?: string | null }) {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const requestId = useRef<string | null>(null);
  const requestBody = useRef('');
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || inFlight.current) return;
    const data = new FormData(event.currentTarget);
    const input = { name: data.get('name'), contact: data.get('contact'), business: data.get('business'), country: data.get('country'), branches: data.get('branches'), consent: data.get('consent') === 'on' };
    const checked = validateEnquiry(input);
    setErrors(checked.errors); setMessage('');
    if (Object.keys(checked.errors).length) {
      const first = Object.keys(checked.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const serialized = JSON.stringify(input);
    if (!requestId.current || requestBody.current !== serialized) { requestId.current = crypto.randomUUID(); requestBody.current = serialized; }
    inFlight.current = true; setBusy(true);
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': requestId.current }, body: JSON.stringify(input), signal: AbortSignal.timeout(12000) });
      const result = await response.json();
      if (response.ok && result.ok === true) { setSent(true); setMessage(result.message); }
      else { setErrors(result.errors || {}); setMessage(result.message || 'We could not confirm delivery. Please try again using this form.'); }
    } catch { setMessage('We could not confirm delivery. Please retry this same enquiry or use the direct contact option.'); }
    finally { setBusy(false); inFlight.current = false; }
  }
  if (sent) return <div className="form-message" role="status" tabIndex={-1}><Icon name="check" size={28} /><h2>We’ve received your enquiry.</h2><p>{message}</p></div>;
  return <form ref={formRef} onSubmit={submit} noValidate aria-label="Business enquiry" aria-describedby={!enabled ? 'enquiry-unavailable' : undefined}>
    {!enabled && <div className="notice" id="enquiry-unavailable"><strong>Let’s arrange it by email.</strong><p>Online requests are not open yet. The fields below are unavailable, and no details will be sent.</p>{contactEmail && <a className="button button-small" href={`mailto:${contactEmail}`}>Email the team <Icon name="arrow" size={17} /></a>}</div>}
    <fieldset className="form-grid enquiry-fields" disabled={!enabled}><legend className="sr-only">Your business and contact details</legend>{[['name', 'Your name', 'Jordan Ahmed', 'name', 100], ['business', 'Business name', 'Your restaurant or store', 'organization', 150], ['contact', 'Business email or phone', 'How can we reach you?', 'email', 254], ['country', 'Country', 'Where is your business based?', 'country-name', 80]].map(([key, label, placeholder, autoComplete, max]) => <div className="form-field" key={key}><label htmlFor={`enquiry-${key}`}>{label} <span aria-hidden="true">*</span></label><input id={`enquiry-${key}`} name={String(key)} placeholder={String(placeholder)} autoComplete={String(autoComplete)} maxLength={Number(max)} required aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined} />{errors[key] && <span className="field-error" id={`error-${key}`}>{errors[key]}</span>}</div>)}
      <div className="form-field"><label htmlFor="enquiry-branches">Number of branches <span aria-hidden="true">*</span></label><input id="enquiry-branches" name="branches" type="number" inputMode="numeric" min="1" max="10000" defaultValue="1" required aria-invalid={Boolean(errors.branches)} aria-describedby={errors.branches ? 'error-branches' : undefined} />{errors.branches && <span className="field-error" id="error-branches">{errors.branches}</span>}</div>
      <div className="form-full"><label className="consent-label"><input type="checkbox" name="consent" required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'error-consent' : undefined} /><span>You may contact me about this enquiry. I’ve read the <Link href="/legal/privacy">privacy notice</Link>. This does not subscribe me to marketing.</span></label>{errors.consent && <span className="field-error" id="error-consent">{errors.consent}</span>}</div>
      {message && <div className="form-message error form-full" role="alert">{message}</div>}
      <div className="form-full"><button className="button" type="submit" disabled={!enabled || busy}>{busy ? 'Sending your enquiry…' : 'Request a conversation'}<Icon name="arrow" size={19} /></button><p className="form-note" style={{ marginTop: 15 }}>All fields are required. We’ll use these details to discuss your business and arrange the next step.</p></div>
    </fieldset>
  </form>;
}
