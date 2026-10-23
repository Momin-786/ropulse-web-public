import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import captures from '../src/content/product-captures.json' with { type: 'json' };
import { manualImage } from '../src/lib/manual-images.mjs';
import { getArticle } from '../src/lib/content.mjs';
import { getSite } from '../src/lib/site.mjs';
import callouts from '../src/content/screenshot-callouts.json' with { type: 'json' };
import illustrations from '../src/content/manual-illustrations.json' with { type: 'json' };
test('manual images require exact allowlisted local paths and preserve capture hashes', () => {
  for (const item of captures.captures) {
    assert.equal(manualImage(item.file)?.width, item.width);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(`public${item.file}`)).digest('hex'), item.sha256);
  }
  for (const src of ['https://evil.example/track.png', '/images/product/../../secret', 'javascript:alert(1)', '/images/product/desktop-light.png?tracking=1', '//evil.example/a.png']) assert.equal(manualImage(src), null);
});
test('illustration overlays attach to real tasks without changing release approval', () => {
  const register = getArticle('register-and-checkout', true);
  assert.ok(register.source.includes('![RoPulse Register'));
  assert.ok(register.source.includes('/images/product/checkout-1440.png'));
  assert.ok(register.headings.some(item => item.id === 'register-on-a-smaller-screen'));
  assert.equal(register.status, 'published');
  assert.ok(getArticle('register-and-checkout', false));
});
test('public draft visibility is separate from site-wide review and indexing', () => {
  const publicDrafts = getSite({ SITE_URL: 'https://ropulse.io', SITE_INDEXABLE: 'true', DOCS_REVIEW_MODE: 'false' });
  assert.equal(publicDrafts.review, false);
  assert.equal(publicDrafts.manualReview, true);
  assert.equal(publicDrafts.indexable, true);
  assert.equal(getSite({ DOCS_PUBLIC_DRAFTS: 'false' }).manualReview, false);
});
test('guidance arrows reference real captures and stay within each image', () => {
  for (const [file, items] of Object.entries(callouts)) {
    const capture = manualImage(file);
    assert.ok(capture, file);
    assert.equal(new Set(items.map(item => item.number)).size, items.length);
    for (const item of items) {
      assert.ok(item.title && item.detail);
      for (const [x, y] of [item.from, item.to]) assert.ok(x >= 0 && y >= 0 && x <= capture.width && y <= capture.height, `${file}: ${item.number}`);
    }
  }
  assert.equal(Object.keys(illustrations).length, 13, 'All operational chapters have real visual guidance');
  for (const items of Object.values(illustrations)) for (const item of items) assert.ok(manualImage(item.src)?.callouts.length, item.src);
});
test('expanded printer chapter preserves installation and recovery instructions with task-specific screenshots', () => {
  const article = getArticle('hardware-and-printing', true);
  const raw = fs.readFileSync('docs/user-guide/11-hardware-and-printing.md', 'utf8');
  for (const paragraph of raw.split(/\r?\n/).filter(line => line.trim())) assert.ok(article.source.includes(paragraph), paragraph);
  for (let number = 1; number <= 14; number++) assert.ok(article.headings.some(heading => heading.text.startsWith(`${number}. `)));
  assert.equal(illustrations['hardware-and-printing'].length, 7);
  assert.ok(article.source.includes('Receipt Center → Preview & Test → Printer on this register'));
  assert.ok(article.source.includes('System / PDF printers cannot print KOT bytes'));
  assert.ok(article.source.includes('Creating a cancellation ticket does not itself void'));
  assert.equal(getArticle('PRINTER_AND_KOT_WEBSITE_HANDOFF.md', true), null);
});
