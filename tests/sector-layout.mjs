import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:3001';
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
await fs.mkdir('tmp/qa', { recursive: true });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'load' });
  for (const width of [320, 361, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1050 });
    await page.locator('.business-sectors').scrollIntoViewIfNeeded();
    for (const image of await page.locator('.business-sectors img').all()) await image.evaluate(img => img.decode());
    assert.equal(await page.locator('.sector-card').count(), 4);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    for (const art of await page.locator('.sector-art').all()) {
      assert.ok(await art.evaluate(node => {
        const bounds = node.getBoundingClientRect();
        return [...node.children].every(child => { const rect = child.getBoundingClientRect(); return rect.top >= bounds.top && rect.bottom <= bounds.bottom + 1 && child.scrollWidth <= child.clientWidth + 1; });
      }), `Artwork clips at ${width}px`);
    }
    if ([390, 1440].includes(width)) await page.locator('.business-sectors').screenshot({ path: `tmp/qa/unified-sectors-${width}.png`, style: '.site-header{visibility:hidden}' });
  }
  const link = page.locator('.sector-card').first();
  await link.focus(); await page.keyboard.press('Enter'); await page.waitForURL('**/restaurant');
  assert.deepEqual(errors, []);
  await fs.writeFile('tmp/qa/sector-layout-results.json', JSON.stringify({ checkedAt: new Date().toISOString(), base, widths: [320, 361, 390, 768, 1024, 1440], result: 'PASS: no clipped artwork or horizontal overflow; logos decode; card keyboard navigation works; no runtime errors' }, null, 2));
  console.log('PASS: unified sector cards fit six widths; logos load, keyboard navigation works and no browser errors');
} finally { await browser.close(); }
