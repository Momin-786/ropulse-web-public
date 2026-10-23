import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:3001';
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
await fs.mkdir('tmp/qa', { recursive: true });
const results = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
  page.setDefaultNavigationTimeout(60000);
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/docs`, { waitUntil: 'load' });
  await page.locator('.printer-guide-feature img').evaluate(img => img.decode());
  await page.screenshot({ caret: 'initial', path: 'tmp/qa/printer-guide-entry-desktop.png', fullPage: false });
  for (const query of ['KOT', 'USB', 'network printer', 'bindings']) {
    await page.getByRole('searchbox', { name: 'Search the user manual' }).fill(query);
    await page.waitForFunction(query => document.querySelector('.search-status')?.textContent.includes(query), query);
    assert.ok(await page.locator('.guide-card[href="/docs/hardware-and-printing"]').count(), query);
  }
  const feature = page.locator('.printer-guide-feature');
  await feature.focus(); await page.keyboard.press('Enter'); await page.waitForURL('**/docs/hardware-and-printing');
  assert.equal(await page.locator('h1').innerText(), 'Printers, receipts & KOT');
  assert.match(await page.locator('meta[name=robots]').getAttribute('content'), /noindex/);
  assert.equal(await page.locator('.manual-screenshot').count(), 7);
  for (let number = 1; number <= 14; number++) assert.ok(await page.locator('.article-prose h2').filter({ hasText: new RegExp(`^${number}\\. `) }).count(), `Section ${number}`);
  for (const image of await page.locator('.screenshot-trigger img').all()) await image.evaluate(img => img.decode());
  for (const anchor of await page.locator('.article-toc a').all()) {
    const id = (await anchor.getAttribute('href')).slice(1);
    assert.equal(await page.evaluate(id => [...document.querySelectorAll('[id]')].filter(node => node.id === id).length, id), 1);
  }
  const bindings = page.locator('.manual-screenshot').filter({ has: page.locator('img[src="/images/product/printer-device-bindings.png"]') }).first();
  await bindings.scrollIntoViewIfNeeded();
  await page.screenshot({ caret: 'initial', path: 'tmp/qa/printer-bindings-guide-desktop.png' });
  await bindings.locator('.screenshot-trigger').click();
  const dialog = page.getByRole('dialog');
  assert.equal(await dialog.locator('.screen-instructions li').count(), 3);
  assert.ok(await dialog.locator('.screen-arrows').isVisible());
  await page.screenshot({ caret: 'initial', path: 'tmp/qa/printer-bindings-enlarged.png' });
  await page.keyboard.press('Escape');
  assert.ok(await bindings.locator('.screenshot-trigger').evaluate(node => node === document.activeElement));
  results.push('Featured guide and task search work; all 14 numbered sections and seven annotated screenshots render; every TOC anchor resolves; enlargement and focus restoration work');
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${base}/docs`, { waitUntil: 'load' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Index at ${width}`);
    if (width === 390) { await page.locator('.printer-guide-feature').scrollIntoViewIfNeeded(); await page.screenshot({ caret: 'initial', path: 'tmp/qa/printer-guide-entry-mobile.png' }); }
    await page.goto(`${base}/docs/hardware-and-printing`, { waitUntil: 'load' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Article at ${width}`);
    await page.locator('.manual-screenshot').first().scrollIntoViewIfNeeded();
    if (width === 390) await page.screenshot({ caret: 'initial', path: 'tmp/qa/printer-guide-mobile.png' });
    await page.locator('.screenshot-trigger').first().click();
    assert.ok(await page.getByRole('dialog').evaluate(node => node.scrollWidth <= node.clientWidth));
    await page.keyboard.press('Escape');
  }
  assert.equal((await page.goto(`${base}/docs/PRINTER_AND_KOT_WEBSITE_HANDOFF.md`)).status(), 404);
  assert.deepEqual(errors, []);
  results.push('320/390/768px: index, long guide, reference tables and screenshot dialogs fit; implementation handoff is not publicly exposed; no runtime errors');
  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto(`${base}/docs/hardware-and-printing`, { waitUntil: 'load' });
  assert.equal(await noJS.locator('figcaption .screen-instructions').count(), 7);
  assert.equal(await noJS.locator('figcaption a[href^="/images/product/printer-"]').count(), 7);
  results.push('Without JavaScript: all seven image instruction lists and original image links remain available');
  await fs.writeFile('tmp/qa/printer-guide-results.json', JSON.stringify({ checkedAt: new Date().toISOString(), base, results }, null, 2));
  results.forEach(item => console.log(`PASS  ${item}`));
} finally { await browser.close(); }
