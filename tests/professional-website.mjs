import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:3019';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
await fs.mkdir('tmp/qa', { recursive: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.evaluate(() => document.fonts.check('600 24px Manrope')));
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.home-sector-card').count(), 4);
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded(); await image.evaluate(img => img.decode());
    }
    assert.match(await page.locator('.home-product img').evaluate(img => img.currentSrc), width <= 700 ? /mobile-light\.png$/ : /desktop-light\.png$/);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Home overflows at ${width}`);
    for (const card of await page.locator('.home-sector-copy, .home-feature-copy').all()) assert.ok(await card.evaluate(node => node.scrollWidth <= node.clientWidth), `Card clips at ${width}`);
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    if ([390, 1440].includes(width)) await page.screenshot({ path: `tmp/qa/professional-home-${width}.png`, fullPage: true, caret: 'initial' });
    for (const route of ['/contact', '/resources', '/pricing', '/docs/hardware-and-printing']) {
      assert.equal((await page.goto(`${base}${route}`)).status(), 200);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} overflows at ${width}`);
    }
  }
  await page.goto(`${base}/docs`);
  assert.equal(await page.locator('.docs-banner').count(), 0);
  assert.equal(await page.locator('.guide-card').count(), 15);
  await page.getByRole('searchbox').fill('printer');
  await page.getByRole('heading', { name: 'Printers, receipts & KOT' }).waitFor();
  await page.goto(`${base}/docs/hardware-and-printing`);
  assert.equal(await page.locator('.manual-screenshot').count(), 7);
  await page.locator('.screenshot-trigger').first().click();
  assert.equal(await page.getByRole('dialog').locator('.screen-instructions li').count(), 3);
  await page.keyboard.press('Escape');
  assert.equal((await page.request.post(`${base}/api/revalidate`, { data: { _type: 'homepage' } })).status(), 404);
  await page.goto(base);
  await page.locator('.home-faq summary').first().click();
  assert.equal(await page.locator('.home-faq details').first().getAttribute('open'), '');
  assert.deepEqual(errors, []);
  console.log('PASS: five responsive widths, brand font, real images, readable cards, manual/search/screenshots, FAQ and no CMS endpoint; no browser errors');
} finally { await browser.close(); }
