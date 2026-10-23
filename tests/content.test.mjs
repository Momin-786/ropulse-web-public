import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { lexer } from 'marked';
import { availableArticles, approvedArticle, manual, articlePath } from '../src/lib/manual-manifest.mjs';
import { getArticle, safeLink, headingId, searchDocuments } from '../src/lib/content.mjs';
import { searchArticles } from '../src/lib/search.mjs';
import { getSite, httpsUrl, email, siteOrigin } from '../src/lib/site.mjs';
import { releaseErrors } from '../src/lib/releases.mjs';

test('all 15 source chapters are explicitly mapped, unique and readable in review mode', () => {
  assert.equal(manual.length, 15);
  assert.equal(new Set(manual.map(a => a.slug)).size, 15);
  for (const meta of manual) {
    const article = getArticle(meta.slug, true);
    assert.ok(article.source.length > 1000);
    assert.ok(article.headings.length > 2);
    assert.equal(new Set(article.headings.map(h => h.id)).size, article.headings.length);
    assert.ok(article.readingMinutes > 1);
  }
});
test('approved-only lookup excludes unreviewed guides from content and search', () => {
  assert.ok(availableArticles(false).every(approvedArticle));
  assert.equal(searchDocuments(false).length, availableArticles(false).length);
  for (const article of manual.filter(a => !approvedArticle(a))) assert.equal(getArticle(article.slug), null);
  for (const slug of ['../WEBSITE_AND_PAYMENTS_PLAN.md', '../../README', 'CONTENT_REVIEW_AND_PUBLICATION.md', 'BRAND_GUIDELINES_EXTRACTED.md', 'constructor', '__proto__']) assert.equal(getArticle(slug), null);
  assert.equal(getArticle('../../README', true), null);
});
test('publication requires reviewer, date and release', () => {
  assert.equal(approvedArticle({ status: 'published' }), false);
  assert.equal(approvedArticle({ status: 'published', reviewer: 'Owner', reviewedAt: '2026-10-21', release: '1.0' }), true);
});
test('chapter links resolve through known slugs and unavailable links return to the manual', () => {
  assert.equal(articlePath('05-register-and-checkout.md', true), '/docs/register-and-checkout');
  assert.equal(articlePath('user-guide/05-register-and-checkout.md', false), '/docs/register-and-checkout');
  assert.equal(safeLink('user-guide/05-register-and-checkout.md#charge-and-settle', true), '/docs/register-and-checkout#charge-and-settle');
  assert.equal(safeLink('README.md', true), '/docs');
});
test('links reject scripts, control characters, protocol-relative and unsupported schemes', () => {
  for (const href of ['javascript:alert(1)', 'data:text/html,hi', '//evil.example', 'http://evil.example', 'https://user name.com', '\\evil', 'java\nscript:alert(1)']) assert.equal(safeLink(href), null);
  assert.equal(safeLink('https://example.com/help'), 'https://example.com/help');
  assert.equal(safeLink('#prepare'), '#prepare');
});
test('every Markdown chapter link has a known target and heading anchor', () => {
  for (const meta of manual) {
    const article = getArticle(meta.slug, true);
    const visit = tokens => { for (const token of tokens) {
      if (token.type === 'link' && /\.md(?:#|$)/.test(token.href)) {
        const [file, fragment] = token.href.split('#');
        const name = file.split('/').at(-1);
        assert.ok(name === 'README.md' || manual.some(a => a.file === name), `${meta.file}: ${file}`);
        if (fragment && name !== 'README.md') assert.ok(getArticle(name, true).headings.some(h => h.id === fragment), `${file}#${fragment}`);
      }
      if (token.tokens) visit(token.tokens);
      if (token.items) token.items.forEach(item => visit(item.tokens));
    }};
    visit(lexer(article.source));
  }
});
test('full text search handles tasks, title weighting, multiple terms and empty results', () => {
  const docs = searchDocuments(true);
  assert.equal(searchArticles(docs, 'printer')[0].slug, 'hardware-and-printing');
  assert.ok(searchArticles(docs, 'held order').some(a => a.slug === 'register-and-checkout'));
  assert.equal(searchArticles(docs, 'zzzznothingherezzzz').length, 0);
  assert.equal(searchArticles(docs, '   ').length, 15);
});
test('headings normalize punctuation and support readable anchors', () => assert.equal(headingId('Charge & settle!'), 'charge-settle'));
test('site configuration prevents unsafe URLs and review indexing', () => {
  assert.equal(httpsUrl('javascript:alert(1)'), null);
  assert.equal(httpsUrl('https://user:secret@example.com'), null);
  assert.equal(siteOrigin('https://example.com/path'), 'http://localhost:3000');
  assert.equal(email('bad\r\nBcc:a@example.com'), null);
  assert.equal(getSite({ SITE_URL: 'https://example.com', SITE_INDEXABLE: 'true', DOCS_REVIEW_MODE: 'true' }).indexable, false);
  assert.equal(getSite({ SITE_URL: 'https://example.com', SITE_INDEXABLE: 'true' }).indexable, true);
});
test('downloads need real HTTPS URLs, requirements, release details and a complete hash', () => {
  assert.ok(releaseErrors({}).length > 0);
  assert.deepEqual(releaseErrors({ platform: 'Windows', version: '1.0', publishedAt: '2026-10-21', requirements: 'Approved device', notes: 'First release', url: 'https://example.com/app.exe', sha256: 'a'.repeat(64) }), []);
});
test('no repository source or internal documents were copied to public assets', () => {
  const files = fs.readdirSync('public', { recursive: true });
  assert.ok(!files.some(file => /\.(?:md|pdf|zip|env)$/i.test(String(file))));
});
