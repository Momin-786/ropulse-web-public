import { randomUUID } from 'node:crypto';
import { getSite, httpsUrl } from '@/lib/site.mjs';
import { validateEnquiry, deliverEnquiry } from '@/lib/contact.mjs';
import policies from '@/content/policies.json';
export const runtime = 'nodejs';
export const maxDuration = 15;
export async function POST(request: Request) {
  const site = getSite();
  const origin = request.headers.get('origin');
  if (origin !== site.origin) return Response.json({ ok: false, message: 'Please submit the form from the RoPulse website.' }, { status: 403 });
  if (!request.headers.get('content-type')?.startsWith('application/json')) return Response.json({ ok: false, message: 'Unsupported request format.' }, { status: 415 });
  // Enforce the limit on actual bytes, including chunked requests.
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ ok: false, message: 'Enter your enquiry.' }, { status: 400 });
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 8192) { await reader.cancel(); return Response.json({ ok: false, message: 'This enquiry is too long.' }, { status: 413 }); }
    chunks.push(value);
  }
  let input;
  try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return Response.json({ ok: false, message: 'Check the form and try again.' }, { status: 400 }); }
  const { value, errors } = validateEnquiry(input);
  if (Object.keys(errors).length) return Response.json({ ok: false, errors, message: 'Please check the highlighted fields.' }, { status: 422 });
  if (!policies.privacy.approved || !policies.privacy.body || !policies.privacy.reviewedAt || !site.company || !httpsUrl(process.env.CONTACT_ENDPOINT)) return Response.json({ ok: false, message: 'Online enquiries are not available yet. Please use the contact option shown on the page.' }, { status: 503 });
  const supplied = request.headers.get('idempotency-key');
  const requestId = supplied && /^[0-9a-f-]{36}$/i.test(supplied) ? supplied : randomUUID();
  const result = await deliverEnquiry(value, { endpoint: process.env.CONTACT_ENDPOINT, token: process.env.CONTACT_API_TOKEN, requestId });
  return Response.json({ ok: result.ok, message: result.message, requestId }, { status: result.status });
}
