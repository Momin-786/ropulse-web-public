import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Runs against a local website build with intercepted API responses.
// It never signs in to or charges a real subscriber.
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3105';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const terminal of [
    { invoiceStatus: 'PAID', fulfilmentStatus: 'COMPLETED' },
    { invoiceStatus: 'PAID', fulfilmentStatus: 'FAILED' },
    { invoiceStatus: 'EXPIRED', fulfilmentStatus: null },
  ]) {
    const page = await browser.newPage();
    await page.clock.install();
    let calls = 0;
    let pendingRoute;
    await page.route('**/api/subscriber/**', async route => {
      const url = route.request().url();
      if (url.endsWith('/auth/session')) return route.fulfill({ json: { authenticated: true } });
      if (url.endsWith('/catalog')) return route.fulfill({ json: { planVersions: [], addOns: [] } });
      if (url.endsWith('/fulfilment')) { calls++; pendingRoute = route; return; }
      return route.fulfill({ status: 404, json: { message: 'Unexpected test request' } });
    });
    await page.goto(base + '/checkout?invoiceId=polling-qa', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'We are confirming your payment.' }).waitFor();
    for (let i = 0; i < 50 && !pendingRoute; i++) await new Promise(resolve => setTimeout(resolve, 50));
    // Next development Strict Mode mounts the effect twice; cleanup aborts
    // the first request. Neither mount may overlap its own status reads.
    assert.ok(calls >= 1 && calls <= 2, 'Initial status request(s)');
    const initialCalls = calls;
    await page.clock.fastForward(31000);
    assert.equal(calls, initialCalls, 'Slow status must not overlap');
    await pendingRoute.fulfill({ json: { ...terminal, recoveryMessage: 'Terminal QA state' } });
    await page.getByRole('heading', { name: terminal.fulfilmentStatus === 'COMPLETED' ? 'Your workspace is ready.' : 'Payment and setup status' }).waitFor();
    await page.clock.fastForward(61000);
    assert.equal(calls, initialCalls, 'Terminal state must stop polling');
    await page.close();
  }
  console.log('Passed: slow request deduplication and terminal stop for completed, failed and expired invoices.');
} finally {
  await browser.close();
}
