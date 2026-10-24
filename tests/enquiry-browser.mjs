// Run against a local production server with tests/fixtures/enquiry-providers.mjs
// preloaded and the synthetic environment documented in docs/RESEND_SETUP.md.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:3017';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({
  contentType: 'application/javascript', body: `
    let counter = 0;
    window.turnstile = {
      render(element, options) {
        element.innerHTML = '';
        const solve = document.createElement('button');
        solve.type = 'button'; solve.textContent = 'Complete test security check';
        solve.onclick = () => options.callback('browser-token-' + (++counter));
        element.append(solve);
        const expire = document.createElement('button');
        expire.type = 'button'; expire.textContent = 'Expire test security check';
        expire.onclick = () => options['expired-callback'](); element.append(expire);
        return 'test-widget';
      }, remove() {}
    };
  `,
}));
async function fill(business = 'Test Café') {
  await page.locator('[name=name]').fill('Test Owner');
  await page.locator('[name=business]').fill(business);
  await page.locator('[name=contact]').fill('visitor@example.com');
  await page.locator('[name=country]').fill('Pakistan');
  await page.locator('[name=consent]').check();
}
try {
  const response = await page.goto(`${base}/contact`);
  const csp = response.headers()['content-security-policy'];
  assert.ok(csp.includes('https://challenges.cloudflare.com'));
  assert.ok(!csp.includes('unsafe-eval'));
  const html = await page.content();
  for (const secret of ['secret-test-only', 're_test_only', 'momina7863@gmail.com']) assert.ok(!html.includes(secret));
  const button = page.getByRole('button', { name: 'Request a conversation' });
  assert.equal(await button.isDisabled(), true);
  await fill();
  await page.getByRole('button', { name: 'Complete test security check' }).click();
  assert.equal(await button.isEnabled(), true);
  await page.getByRole('button', { name: 'Expire test security check' }).click();
  assert.equal(await button.isDisabled(), true);
  await page.getByRole('button', { name: 'Complete test security check' }).click();
  const accepted = page.waitForResponse(res => res.url().endsWith('/api/enquiries'));
  await button.click();
  assert.equal((await accepted).status(), 200);
  await page.getByRole('heading', { name: 'Thank you for your enquiry.' }).waitFor();
  console.log('PASS browser → API → Turnstile verification → Resend acceptance → success UI (mock providers)');

  // Client navigation reuses the already-loaded script and must render a widget.
  await page.locator('a[href="/demo"]').first().click();
  await page.waitForURL('**/demo');
  await fill('Reject delivery');
  await page.getByRole('button', { name: 'Complete test security check' }).click();
  const rejected = page.waitForResponse(res => res.url().endsWith('/api/enquiries'));
  await button.click();
  const rejection = await rejected;
  assert.equal(rejection.status(), 502);
  const originalRequest = rejection.request();
  await page.getByRole('alert').filter({ hasText: 'We could not confirm delivery' }).waitFor();
  assert.equal(await button.isDisabled(), true);
  await page.getByRole('button', { name: 'Complete test security check' }).click();
  const retry = page.waitForResponse(res => res.url().endsWith('/api/enquiries'));
  await button.click();
  const retried = await retry;
  assert.equal(retried.status(), 502);
  assert.equal(retried.request().headers()['idempotency-key'], originalRequest.headers()['idempotency-key']);
  assert.notEqual(retried.request().postDataJSON().turnstileToken, originalRequest.postDataJSON().turnstileToken);
  console.log('PASS SPA widget remount; provider rejection; fresh token and stable email idempotency on retry');

  const data = { name: 'Test Owner', business: 'Test Café', contact: 'visitor@example.com', country: 'Pakistan', branches: 1, consent: true };
  for (const token of [undefined, 'invalid-token']) {
    const result = await page.request.post(`${base}/api/enquiries`, { headers: { Origin: base }, data: { ...data, turnstileToken: token } });
    assert.equal(result.status(), 400);
  }
  assert.equal((await page.request.post(`${base}/api/enquiries`, { headers: { Origin: 'https://evil.example' }, data })).status(), 403);
  await page.goto(`${base}/legal/privacy`);
  await page.getByRole('heading', { name: 'Who handles your enquiry' }).waitFor();
  assert.deepEqual(errors, []);
  console.log('PASS missing/invalid tokens and cross-origin requests rejected; privacy notice published; no browser errors');
} finally { await browser.close(); }
