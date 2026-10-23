import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:3001';
await fs.mkdir('tmp/qa', { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: 'reduce' });
try {
  for (const route of ['features', 'restaurant']) {
    await page.goto(`${base}/${route}`, { waitUntil: 'load' });
    await page.locator('.showcase-frame img').scrollIntoViewIfNeeded();
    await page.locator('.showcase-frame img').evaluate(img => img.decode());
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); });
    await page.screenshot({ path: `tmp/qa/${route}-desktop.png`, fullPage: true, caret: 'initial' });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['support', 'demo']) {
    await page.goto(`${base}/${route}`, { waitUntil: 'load' });
    await page.screenshot({ path: `tmp/qa/${route}-mobile.png`, fullPage: true, caret: 'initial' });
  }
  console.log('Captured showcase pages from top and mobile support/enquiry pages.');
} finally { await browser.close(); }
