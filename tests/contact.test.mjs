import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEnquiry, deliverEnquiry } from '../src/lib/contact.mjs';
const valid = { name: 'Business Owner', business: 'Test Café', contact: 'owner@example.com', country: 'Pakistan', branches: '2', consent: true };
test('enquiry accepts email or phone, normalizes input and rejects invalid fields', () => {
  assert.deepEqual(validateEnquiry(valid).errors, {});
  assert.deepEqual(validateEnquiry({ ...valid, contact: '+92 300 1234567' }).errors, {});
  const result = validateEnquiry({ ...valid, name: '', contact: 'invalid', branches: 0, consent: false });
  for (const key of ['name', 'contact', 'branches', 'consent']) assert.ok(result.errors[key]);
  assert.equal(validateEnquiry(valid).value.branches, 2);
  assert.ok(validateEnquiry(null).errors.form);
});
test('enquiry rejects oversized inputs and control characters', () => {
  assert.ok(validateEnquiry({ ...valid, name: 'x'.repeat(101) }).errors.name);
  assert.ok(validateEnquiry({ ...valid, contact: '-------' }).errors.contact);
  assert.ok(validateEnquiry({ ...valid, contact: 'a@b.com\r\nHeader:value' }).errors.contact);
});
test('unconfigured delivery never returns success', async () => {
  const result = await deliverEnquiry(valid, { requestId: 'test' });
  assert.equal(result.ok, false); assert.equal(result.status, 503);
});
test('success requires an acknowledged upstream response and preserves idempotency', async () => {
  let options;
  const result = await deliverEnquiry(valid, { endpoint: 'https://example.com/enquiries', token: 'test-token', requestId: 'request-1', fetcher: async (url, init) => { options = init; return new Response('{}', { status: 202 }); } });
  assert.equal(result.ok, true);
  assert.equal(options.headers['Idempotency-Key'], 'request-1');
  assert.equal(options.redirect, 'error');
  assert.equal(JSON.parse(options.body).consentVersion, 'demo-enquiry-v1');
});
test('upstream rejection, redirects, timeout and network failure remain unconfirmed', async () => {
  for (const status of [204, 301, 400, 429, 500]) {
    const result = await deliverEnquiry(valid, { endpoint: 'https://example.com', requestId: 'test', fetcher: async () => ({ status }) });
    assert.equal(result.ok, false); assert.equal(result.status, 502);
  }
  const result = await deliverEnquiry(valid, { endpoint: 'https://example.com', requestId: 'test', fetcher: async () => { throw new Error('timeout'); } });
  assert.equal(result.ok, false);
});
