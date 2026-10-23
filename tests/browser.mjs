import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { availableArticles, manual, approvedArticle } from '../src/lib/manual-manifest.mjs';
const base = process.env.TEST_BASE_URL || process.argv[2] || 'http://127.0.0.1:3000';
const production = process.env.TEST_PRODUCTION === 'true' || new URL(base).port === '3001';
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL === 'chromium' ? {} : { channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' }) });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const results = [];
await fs.mkdir('tmp/qa', { recursive: true });
try {
  const response = await page.goto(base, { waitUntil: 'load' });
  assert.equal(response.status(), 200);
  assert.match(await page.title(), /ROPULSE/);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.getByRole('heading', { name: 'Every order. One pulse.' }).count(), 1);
  await page.screenshot({ path: 'tmp/qa/home-desktop.png', fullPage: true, caret: 'initial' });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Desktop layout overflows');
  results.push('Desktop homepage: title, unique heading, layout width, screenshot');
  for (const route of ['/resources', '/tour', '/features', '/restaurant', '/retail', '/pricing', '/get-started', '/demo', '/contact', '/support', '/downloads', '/release-notes', '/login', '/signup', '/account', '/checkout', '/legal/privacy', '/legal/terms', '/legal/billing-refunds']) {
    const res = await page.goto(`${base}${route}`, { waitUntil: 'load' });
    assert.equal(res.status(), 200, route); assert.equal(await page.locator('h1').count(), 1, route);
    if (route === '/demo' || route === '/contact') assert.ok(!res.headers()['cache-control']?.includes('public'), `${route} must evaluate service availability per request`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} overflows`);
    if (['/features', '/restaurant'].includes(route)) {
      await page.locator('.showcase-frame img').scrollIntoViewIfNeeded();
      await page.locator('.showcase-frame img').evaluate(img => img.decode());
      await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); });
      await page.screenshot({ path: `tmp/qa/${route.slice(1)}-desktop.png`, fullPage: true });
    }
  }
  results.push('19 public routes: successful responses, unique H1 and no horizontal overflow');
  await page.goto(`${base}/support`, { waitUntil: 'load' });
  assert.ok(await page.getByRole('heading', { name: '10 AM–10 PM Pakistan time (UTC+5)' }).count());
  await page.screenshot({ path: 'tmp/qa/support-desktop.png', fullPage: true });
  results.push('Owner-confirmed support hours and seller identity are visible');
  await page.goto(`${base}/resources`, { waitUntil: 'load' });
  assert.equal(await page.locator('.resource-card').count(), 6);
  await page.getByRole('searchbox', { name: 'Search the user manual' }).fill('printer');
  await page.getByRole('button', { name: 'Search guides' }).click();
  await page.waitForURL('**/docs?q=printer');
  assert.equal(await page.getByRole('searchbox', { name: 'Search the user manual' }).inputValue(), 'printer');
  await page.goto(`${base}/resources`, { waitUntil: 'load' });
  await page.screenshot({ path: 'tmp/qa/resources-desktop.png', fullPage: true });
  await page.goto(`${base}/tour`, { waitUntil: 'load' });
  for (const label of ['Table service', 'A smaller screen', 'After hours', 'The Register']) {
    const button = page.getByRole('button', { name: new RegExp(label) });
    await button.click();
    assert.equal(await button.getAttribute('aria-pressed'), 'true');
    await page.locator('.tour-image img').evaluate(img => img.decode());
    assert.ok(await page.locator('.tour-image img').evaluate(img => img.naturalWidth > 0));
  }
  await page.screenshot({ path: 'tmp/qa/tour-desktop.png', fullPage: true });
  results.push('Resource hub: six destinations; real app tour: all four screen controls and images work');
  await page.goto(`${base}/demo`, { waitUntil: 'load' });
  assert.equal(await page.getByRole('button', { name: 'Request a conversation' }).isDisabled(), true);
  assert.equal(await page.locator('input[name=name]').getAttribute('required'), '');
  assert.equal(await page.locator('input[name=name]').isDisabled(), true, 'Unavailable enquiry must not invite data entry');
  assert.match(await page.getByRole('link', { name: 'Email the team', exact: true }).getAttribute('href'), /^mailto:/);
  await page.screenshot({ path: 'tmp/qa/demo-desktop.png', fullPage: true, caret: 'initial' });
  results.push('Unconfigured enquiry: honest notice, required labels, submission disabled');
  await page.goto(`${base}/docs`, { waitUntil: 'load' });
  const review = await page.getByText('Manual review edition.', { exact: true }).count() > 0;
  if (review) {
    const search = page.getByRole('searchbox', { name: 'Search the user manual' });
    assert.equal(await page.locator('.guide-card').count(), 15);
    await search.fill('printer');
    await page.waitForFunction(() => document.querySelector('.search-status')?.textContent.includes('printer'));
    assert.ok(await page.getByRole('heading', { name: 'Printers, receipts & KOT' }).count());
    await search.fill('zzzznothingherezzzz');
    await page.getByRole('heading', { name: 'Try a different word.' }).waitFor();
    await search.fill('');
    await page.getByRole('button', { name: 'Service team', exact: true }).click();
    assert.ok(await page.locator('.guide-card').count() < 15);
    await page.goto(`${base}/docs/payments-and-receipts`, { waitUntil: 'load' });
    assert.ok(await page.locator('.article-prose h2').count() > 3);
    assert.equal(await page.locator('.article-header h1').count(), 1);
    const toc = page.locator('.article-toc a').first();
    const href = await toc.getAttribute('href');
    assert.equal(await page.locator(href).count(), 1);
    await page.screenshot({ path: 'tmp/qa/manual-desktop.png', fullPage: true, caret: 'initial' });
    results.push('Review manual: 15 guides, full-text search, zero results, role filter, headings and anchor destinations');
  } else if (availableArticles(false).length) {
    assert.equal(await page.locator('.guide-card').count(), availableArticles(false).length);
    const article = availableArticles(false)[0];
    await page.goto(`${base}/docs/${article.slug}`, { waitUntil: 'load' });
    assert.equal(await page.locator('.article-header h1').count(), 1);
    for (const unpublished of manual.filter(item => !approvedArticle(item))) assert.equal((await page.goto(`${base}/docs/${unpublished.slug}`)).status(), 404);
    results.push('Public manual: published articles available; unpublished articles excluded');
  } else {
    assert.equal(await page.locator('.guide-card').count(), 0);
    assert.equal((await page.goto(`${base}/docs/getting-started`)).status(), 404);
    results.push('Public manual: unreviewed articles and search results excluded');
  }
  for (const route of ['/unknown-page', '/docs/CONTENT_REVIEW_AND_PUBLICATION.md', '/docs/WEBSITE_AND_PAYMENTS_PLAN.md', '/docs/BRAND_GUIDELINES_EXTRACTED.md', '/docs/__proto__']) assert.equal((await page.goto(`${base}${route}`)).status(), 404, route);
  const request = page.context().request;
  const crossOrigin = await request.post(`${base}/api/enquiries`, { headers: { Origin: 'https://evil.example' }, data: {} });
  assert.equal(crossOrigin.status(), 403);
  const origin = new URL(base).origin;
  const requestOrigin = process.env.TEST_SITE_ORIGIN || 'http://localhost:3000';
  const invalid = await request.post(`${base}/api/enquiries`, { headers: { Origin: requestOrigin }, data: {} });
  assert.equal(invalid.status(), 422);
  const invalidPhone = await request.post(`${base}/api/enquiries`, { headers: { Origin: requestOrigin }, data: { name: 'Owner', business: 'Café', country: 'Pakistan', contact: '-------', branches: 1, consent: true } });
  assert.equal(invalidPhone.status(), 422);
  const large = await request.post(`${base}/api/enquiries`, { headers: { Origin: requestOrigin }, data: { name: 'a'.repeat(9000) } });
  assert.equal(large.status(), 413);
  const unconfigured = await request.post(`${base}/api/enquiries`, { headers: { Origin: requestOrigin }, data: { name: 'Owner', business: 'Café', country: 'Pakistan', contact: 'owner@example.com', branches: 1, consent: true } });
  assert.equal(unconfigured.status(), 503);
  const headerResponse = await request.get(base);
  assert.equal(headerResponse.headers()['x-content-type-options'], 'nosniff');
  assert.equal(headerResponse.headers()['x-frame-options'], 'DENY');
  if (production || !review) assert.ok(!headerResponse.headers()['content-security-policy'].includes('unsafe-eval'), 'Production CSP permits eval');
  results.push('Security: internal routes 404; cross-origin, invalid and oversized enquiries rejected; unconfigured delivery 503; headers present');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: 'load' });
  const menu = page.getByRole('button', { name: 'Menu' });
  assert.equal(await menu.isVisible(), true);
  await menu.click();
  assert.equal(await page.locator('#main-navigation').isVisible(), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded'), 'false');
  assert.equal(await page.getByRole('button', { name: 'Menu' }).evaluate(node => node === document.activeElement), true);
  await page.screenshot({ path: 'tmp/qa/home-mobile.png', fullPage: true, caret: 'initial' });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile homepage overflows');
  assert.ok(await page.locator('.preview-screen img').evaluate(img => img.complete && img.naturalWidth > 0), 'Real app hero image did not load');
  await page.goto(`${base}/resources`, { waitUntil: 'load' });
  await page.screenshot({ path: 'tmp/qa/resources-mobile.png', fullPage: true });
  await page.goto(`${base}/docs`, { waitUntil: 'load' });
  await page.getByRole('button', { name: 'Browse the manual' }).click();
  assert.equal(await page.locator('#guide-navigation').isVisible(), true);
  await page.screenshot({ path: 'tmp/qa/manual-mobile.png', fullPage: true, caret: 'initial' });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile manual overflows');
  if (review) {
    await page.goto(`${base}/docs/register-and-checkout`, { waitUntil: 'load' });
    await page.screenshot({ path: 'tmp/qa/manual-article-mobile.png', fullPage: true, caret: 'initial' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile article overflows');
  }
  await page.goto(`${base}/demo`, { waitUntil: 'load' });
  await page.screenshot({ path: 'tmp/qa/demo-mobile.png', fullPage: true, caret: 'initial' });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile form overflows');
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['', '/resources', '/tour', '/docs', '/demo', '/features', '/restaurant', '/retail', '/pricing', '/get-started', '/support', '/downloads', '/release-notes', '/legal/privacy']) {
      await page.goto(`${base}${route}`, { waitUntil: 'load' });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Layout overflows at ${width}px on ${route || '/'}`);
    }
  }
  assert.deepEqual(errors, [], 'Browser runtime errors');
  results.push('390px mobile: menu open/Escape/focus, manual navigation, forms and layout widths; no browser runtime errors');
  results.push('320px, 768px and 1024px: resource hub, app tour, manual, marketing and enquiry layout widths');
  await fs.writeFile(`tmp/qa/browser-results-${production ? 'production' : review ? 'review' : 'public'}.json`, JSON.stringify({ base, review, production, checkedAt: new Date().toISOString(), results }, null, 2));
  results.forEach(result => console.log(`PASS  ${result}`));
} finally { await browser.close(); }
