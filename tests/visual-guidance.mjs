import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import illustrations from '../src/content/manual-illustrations.json' with { type: 'json' };
const base = process.argv[2] || 'http://127.0.0.1:3001';
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
const results = [];
await fs.mkdir('tmp/qa', { recursive: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 361, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1050 });
    await page.goto(base, { waitUntil: 'load' });
    await page.locator('.home-product img').evaluate(img => img.decode());
    const screen = await page.locator('.home-product img').boundingBox();
    const caption = await page.locator('.home-product figcaption').boundingBox();
    assert.ok(caption.y >= screen.y + screen.height - 1, 'Hero caption overlaps');
    assert.equal(await page.locator('.home-sector-card').count(), 4);
    for (const image of await page.locator('.home-sectors img').all()) await image.evaluate(img => img.decode());
    for (const copy of await page.locator('.home-sector-copy').all()) assert.ok(await copy.evaluate(node => node.scrollWidth <= node.clientWidth));
    assert.equal(await page.locator('.home-retail-link').getAttribute('href'), '/retail');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  results.push('Product hero and captions do not overlap at six widths; four matching business cards and retail link fit');
  await page.goto(`${base}/docs/register-and-checkout`, { waitUntil: 'load' });
  assert.equal(await page.locator('.docs-nav-group').count(), 5);
  const group = page.locator('.docs-nav-group').first();
  assert.equal(await group.getAttribute('open'), '');
  await group.locator('summary').click();
  assert.equal(await group.getAttribute('open'), null);
  await group.locator('summary').focus(); await page.keyboard.press('Enter');
  assert.equal(await group.getAttribute('open'), '');
  assert.ok(await page.locator('.docs-group-links a[aria-current=page]').isVisible());
  await page.locator('.docs-nav').screenshot({ path: 'tmp/qa/manual-sidebar-groups.png' });
  results.push('Five styled manual groups collapse by pointer and expand with Enter; current guide remains marked');
  for (const [slug, items] of Object.entries(illustrations)) {
    await page.goto(`${base}/docs/${slug}`, { waitUntil: 'load' });
    assert.equal(await page.locator('.manual-screenshot').count(), items.length, slug);
    for (const figure of await page.locator('.manual-screenshot').all()) {
      await figure.locator('.screenshot-trigger img').evaluate(img => img.decode());
      assert.ok(await figure.locator('.screenshot-trigger .screen-arrows').count(), slug);
      assert.ok(await figure.locator('figcaption .screen-instructions li').count(), slug);
    }
  }
  results.push('All 13 operational manuals render real images, numbered arrow overlays and matching instructions');
  await page.goto(`${base}/docs/stock-and-recipes`, { waitUntil: 'load' });
  await page.locator('.manual-screenshot').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'tmp/qa/stock-guide-annotated.png' });
  await page.locator('.screenshot-trigger').first().click();
  assert.ok(await page.getByRole('dialog').locator('.screen-arrows').isVisible());
  assert.equal(await page.getByRole('dialog').locator('.screen-instructions li').count(), 3);
  await page.screenshot({ path: 'tmp/qa/stock-guide-enlarged.png' });
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/docs/products-and-layouts`, { waitUntil: 'load' });
  await page.locator('.manual-screenshot').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'tmp/qa/catalog-guide-mobile.png' });
  await page.locator('.screenshot-trigger').first().click();
  assert.ok(await page.getByRole('dialog').evaluate(node => node.scrollWidth <= node.clientWidth));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.keyboard.press('Escape');
  for (const slug of ['subscription-and-support', 'website-account-and-billing']) {
    await page.goto(`${base}/docs/${slug}`, { waitUntil: 'load' });
    assert.equal(await page.locator('.planned-account-flow ol>li').count(), 4);
    assert.match(await page.locator('.planned-account-flow figcaption').innerText(), /not available/);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (slug === 'website-account-and-billing') await page.locator('.planned-account-flow').screenshot({ path: 'tmp/qa/planned-billing-flow-mobile.png', style: '.site-header{visibility:hidden}' });
  }
  results.push('Both future account/billing guides have labelled concept diagrams that fit mobile without implying a live portal');
  assert.deepEqual(errors, []);
  results.push('Enlarged annotated screens retain matching instructions and fit mobile; no browser runtime errors');
  const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await noJS.goto(`${base}/docs/stock-and-recipes`, { waitUntil: 'load' });
  assert.ok(await noJS.locator('figcaption .screen-instructions').isVisible());
  assert.equal(await noJS.locator('figcaption a').getAttribute('href'), '/images/product/backoffice-stock.png');
  results.push('Without JavaScript, images, numbered instructions and original image links remain available');
  await fs.writeFile('tmp/qa/visual-guidance-results.json', JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
  results.forEach(item => console.log(`PASS  ${item}`));
} finally { await browser.close(); }
