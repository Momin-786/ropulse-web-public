import test from 'node:test';
import assert from 'node:assert/strict';
import { turnstileConfigured, verifyTurnstile } from '../src/lib/turnstile.mjs';

const env = { SITE_URL: 'https://ropulse.io', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'site-test', TURNSTILE_SECRET_KEY: 'secret-test' };
test('Turnstile requires both keys and a bounded nonempty token', async () => {
  assert.equal(turnstileConfigured({}), false);
  assert.equal(turnstileConfigured({ ...env, TURNSTILE_SECRET_KEY: '' }), false);
  assert.equal((await verifyTurnstile('token', { env: {} })).status, 503);
  for (const token of [undefined, null, 123, '', ' ', 'x'.repeat(2049)]) {
    const result = await verifyTurnstile(token, { env, fetcher: async () => assert.fail('Invalid token must not be sent') });
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  }
});
test('Turnstile verifies with the fixed endpoint and checks hostname and action', async () => {
  let options;
  const result = await verifyTurnstile('token', { env, fetcher: async (url, init) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    options = init;
    return Response.json({ success: true, hostname: 'ropulse.io', action: 'business_enquiry' });
  } });
  assert.equal(result.ok, true);
  assert.equal(options.redirect, 'error');
  assert.equal(options.cache, 'no-store');
  assert.deepEqual(JSON.parse(options.body), { secret: 'secret-test', response: 'token' });
  assert.ok(!JSON.stringify(result).includes('secret-test'));
});
test('failed, expired, replayed and wrong-origin/action challenges are rejected', async () => {
  for (const response of [
    { success: false, 'error-codes': ['timeout-or-duplicate'] },
    { success: 'true', hostname: 'ropulse.io', action: 'business_enquiry' },
    { success: true, hostname: 'evil.example', action: 'business_enquiry' },
    { success: true, hostname: 'ropulse.io', action: 'other' },
    { success: true }, {},
  ]) {
    const result = await verifyTurnstile('token', { env, fetcher: async () => Response.json(response) });
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  }
});
test('Turnstile network, provider and malformed-response failures fail closed', async () => {
  for (const fetcher of [
    async () => { throw new Error('timeout'); },
    async () => new Response(null, { status: 500 }),
    async () => new Response('invalid json'),
  ]) {
    const result = await verifyTurnstile('token', { env, fetcher });
    assert.equal(result.ok, false);
    assert.equal(result.status, 502);
    assert.ok(!JSON.stringify(result).includes('secret-test'));
  }
});
