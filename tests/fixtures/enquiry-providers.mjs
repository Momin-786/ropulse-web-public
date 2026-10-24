// Test-process preload only. Never imported by application code.
import assert from 'node:assert/strict';
if (process.env.ROPULSE_TEST_PROVIDERS !== 'true') throw new Error('Test provider preload requires explicit test mode');
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  if (String(url) === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
    const body = JSON.parse(options.body);
    assert.equal(body.secret, 'secret-test-only');
    return Response.json({ success: body.response.startsWith('browser-token-'), hostname: '127.0.0.1', action: 'business_enquiry' });
  }
  if (String(url) === 'https://api.resend.com/emails') {
    assert.equal(options.headers.Authorization, 'Bearer re_test_only');
    const body = JSON.parse(options.body);
    assert.deepEqual(body.to, ['support@ropulse.io', 'momina7863@gmail.com']);
    assert.equal(body.reply_to, 'visitor@example.com');
    assert.ok(!options.body.includes('browser-token-'));
    if (body.text.includes('Business: Reject delivery')) return Response.json({ message: 'provider test failure' }, { status: 429 });
    return Response.json({ id: 'test-email-accepted' });
  }
  return originalFetch(url, options);
};
