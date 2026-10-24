import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEnquiry } from '../src/lib/contact.mjs';
import { deliverEnquiry, deliverVerifiedEnquiry, enquiryDeliveryConfigured, enquiryDeliveryConfig } from '../src/lib/enquiry-delivery.mjs';
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

const resend = {
  RESEND_API_KEY: 're_test_not_a_real_key',
  CONTACT_FROM_EMAIL: 'Ropulse Website <website@notify.ropulse.io>',
  CONTACT_TO_EMAIL: 'support@ropulse.io, momina7863@gmail.com',
};
test('Resend configuration validates every recipient and fails closed on partial setup', () => {
  assert.equal(enquiryDeliveryConfigured(resend), true);
  assert.deepEqual(enquiryDeliveryConfig(resend).to, ['support@ropulse.io', 'momina7863@gmail.com']);
  assert.deepEqual(enquiryDeliveryConfig({ ...resend, CONTACT_TO_EMAIL: 'support@ropulse.io,support@ropulse.io' }).to, ['support@ropulse.io']);
  for (const overrides of [
    { RESEND_API_KEY: '' }, { CONTACT_FROM_EMAIL: '' }, { CONTACT_TO_EMAIL: '' },
    { CONTACT_TO_EMAIL: 'support@ropulse.io,bad' }, { CONTACT_TO_EMAIL: 'support@ropulse.io,' },
    { CONTACT_TO_EMAIL: 'support@ropulse.io\r\nBcc:bad@example.com' },
    { CONTACT_FROM_EMAIL: 'Ropulse\r\nBcc: bad@example.com <website@notify.ropulse.io>' },
    { CONTACT_FROM_EMAIL: 'Ropulse <bad>' }, { RESEND_API_KEY: 'key\r\nInjected:value' },
  ]) assert.equal(enquiryDeliveryConfigured({ ...resend, CONTACT_ENDPOINT: 'https://example.com', ...overrides }), false);
});
test('Resend sends to both recipients with email reply-to, consent and a stable retry key', async () => {
  const calls = [];
  const fetcher = async (url, init) => {
    calls.push({ url, init });
    return Response.json({ id: 'email-receipt' });
  };
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await deliverEnquiry(valid, { env: resend, requestId: 'enquiry-123', fetcher });
    assert.equal(result.ok, true);
    assert.ok(!JSON.stringify(result).includes(resend.RESEND_API_KEY));
  }
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  assert.equal(calls[0].init.headers.Authorization, `Bearer ${resend.RESEND_API_KEY}`);
  assert.equal(calls[0].init.headers['Idempotency-Key'], 'enquiry-123');
  assert.equal(calls[0].init.redirect, 'error');
  assert.equal(calls[0].init.cache, 'no-store');
  assert.equal(calls[0].init.body, calls[1].init.body);
  const body = JSON.parse(calls[0].init.body);
  assert.deepEqual(body.to, ['support@ropulse.io', 'momina7863@gmail.com']);
  assert.equal(body.from, resend.CONTACT_FROM_EMAIL);
  assert.equal(body.reply_to, valid.contact);
  assert.match(body.text, /Business: Test Café/);
  assert.match(body.text, /no marketing subscription/);
  assert.match(body.text, /enquiry-123/);
  assert.ok(!JSON.stringify(body).includes(resend.RESEND_API_KEY));
});
test('phone-only enquiries keep the phone number without an invalid reply-to', async () => {
  let body;
  await deliverEnquiry({ ...valid, contact: '+92 300 1234567' }, {
    env: resend, requestId: 'phone-123', fetcher: async (_url, init) => {
      body = JSON.parse(init.body); return Response.json({ id: 'email-receipt' });
    },
  });
  assert.equal(Object.hasOwn(body, 'reply_to'), false);
  assert.match(body.text, /Contact: \+92 300 1234567/);
});
test('Resend requires a receipt and never exposes provider failures', async () => {
  for (const response of [
    Response.json({}), Response.json({ id: '' }), Response.json({ id: 123 }),
    new Response('invalid JSON'), new Response(null, { status: 204 }),
    Response.json({ message: 'sensitive provider error' }, { status: 401 }),
    Response.json({ message: 'rate limited' }, { status: 429 }),
    new Response(null, { status: 302 }), new Response(null, { status: 500 }),
  ]) {
    const result = await deliverEnquiry(valid, { env: resend, requestId: 'test', fetcher: async () => response });
    assert.equal(result.ok, false);
    assert.equal(result.status, 502);
    assert.ok(!result.message.includes('sensitive'));
  }
  const result = await deliverEnquiry(valid, { env: resend, requestId: 'test', fetcher: async () => { throw new Error('timeout'); } });
  assert.equal(result.ok, false);
});
test('incomplete Resend configuration never makes an upstream request', async () => {
  const result = await deliverEnquiry(valid, {
    env: { ...resend, CONTACT_TO_EMAIL: 'invalid' }, requestId: 'test',
    fetcher: async () => { assert.fail('Must not send with invalid recipients'); },
  });
  assert.equal(result.status, 503);
});
test('the protected flow never calls Resend after a failed security check', async () => {
  const calls = [];
  const env = { ...resend, SITE_URL: 'https://ropulse.io', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'site-test', TURNSTILE_SECRET_KEY: 'secret-test' };
  const result = await deliverVerifiedEnquiry(valid, { env, requestId: 'test', turnstileToken: 'expired-token', fetcher: async url => {
    calls.push(url); return Response.json({ success: false, 'error-codes': ['timeout-or-duplicate'] });
  } });
  assert.equal(result.status, 400);
  assert.deepEqual(calls, ['https://challenges.cloudflare.com/turnstile/v0/siteverify']);
});
test('the protected flow verifies first, then sends only enquiry data to Resend', async () => {
  const calls = [];
  const env = { ...resend, SITE_URL: 'https://ropulse.io', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'site-test', TURNSTILE_SECRET_KEY: 'secret-test' };
  const result = await deliverVerifiedEnquiry(valid, { env, requestId: 'test', turnstileToken: 'verified-token', fetcher: async (url, options) => {
    calls.push(url);
    if (url.includes('siteverify')) return Response.json({ success: true, hostname: 'ropulse.io', action: 'business_enquiry' });
    assert.ok(!options.body.includes('verified-token'));
    assert.ok(!options.body.includes('secret-test'));
    return Response.json({ id: 'email-accepted' });
  } });
  assert.equal(result.ok, true);
  assert.deepEqual(calls, ['https://challenges.cloudflare.com/turnstile/v0/siteverify', 'https://api.resend.com/emails']);
});
