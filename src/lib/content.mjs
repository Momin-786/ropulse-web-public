import fs from 'node:fs';
import path from 'node:path';
import { lexer } from 'marked';
import { availableArticles, articlePath } from './manual-manifest.mjs';
import { illustrateGuide } from './manual-illustrations.mjs';

export function headingId(text) {
  return text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-');
}
export function safeLink(href, review = false) {
  if (!href || /[\u0000-\u0020\\]/.test(href)) return null;
  if (href.startsWith('//')) return null;
  if (href.startsWith('#')) return href;
  if (/\.md(?:#|$)/.test(href)) {
    const [file, fragment] = href.split('#');
    return articlePath(file, review) + (fragment && articlePath(file, review) !== '/docs' ? `#${fragment}` : '');
  }
  if (href.startsWith('/')) return href;
  try { const url = new URL(href); return ['https:', 'mailto:'].includes(url.protocol) ? href : null; } catch { return null; }
}
export function getArticle(slug, review = false) {
  const meta = availableArticles(review).find(article => article.slug === slug || article.file === slug);
  if (!meta) return null;
  const source = illustrateGuide(fs.readFileSync(path.join(process.cwd(), 'docs', 'user-guide', meta.file), 'utf8'), meta.slug);
  const tokens = lexer(source);
  const seen = new Map();
  const headings = [];
  for (const token of tokens) {
    if (token.type === 'heading') {
      const base = headingId(token.text);
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      token.id = count ? `${base}-${count}` : base;
      if (token.depth > 1) headings.push({ id: token.id, text: token.text, depth: token.depth });
    }
  }
  return { ...meta, tokens, headings, source, readingMinutes: Math.max(1, Math.ceil(source.split(/\s+/).length / 220)) };
}
export function searchDocuments(review = false) {
  return availableArticles(review).map(meta => {
    const article = getArticle(meta.slug, review);
    return {
      slug: meta.slug, title: meta.title, group: meta.group, description: meta.description, status: meta.status,
      headings: article.headings.map(h => h.text).join(' '),
      text: article.source.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[#*`>|]/g, '').replace(/\s+/g, ' '),
    };
  });
}
