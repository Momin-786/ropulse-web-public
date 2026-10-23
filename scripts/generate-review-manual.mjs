import fs from 'node:fs';
import { manual } from '../src/lib/manual-manifest.mjs';
import { getArticle } from '../src/lib/content.mjs';
import { manualImage } from '../src/lib/manual-images.mjs';
const lines = ['# Ropulse website manual — illustrated review edition', '', 'Generated from the 15 canonical user-guide chapters and the website illustration layer. This is a review snapshot, not a release certification. Sample screenshots do not verify physical hardware, live payment providers or background delivery. Account/billing chapters describe planned services.', '', '## Contents', '', ...manual.map(item => `- [${item.title}](#${item.slug})`), ''];
lines.splice(4, 0, 'The website adds numbered arrows to unchanged screenshot images. This reading edition retains the original PNGs and reproduces their captions and numbered instruction lists below each image.', '');
for (const item of manual) {
  const article = getArticle(item.slug, true);
  let source = article.source.replace(/^# .+\r?\n/, '').trim();
  source = source.replace(/!\[([^\]]*)\]\((\/images\/product\/[^\s)]+) "([^"]*)"\)/g, (image, alt, file, caption) => {
    const instructions = (manualImage(file)?.callouts || []).map(item => `${item.number}. **${item.title}.** ${item.detail}`).join('\n');
    return `${image}\n\n*${caption}*\n\n${instructions}`;
  });
  source = source.replace(/^(#{2,5}) /gm, '$1# ').replaceAll('](/images/product/', '](../public/images/product/');
  source = source.replace(/\]\((\d{2}-[^)#]+\.md)(#[^)]*)?\)/g, '](user-guide/$1$2)');
  source = source.replace(/\]\(README\.md(#[^)]*)?\)/g, '](user-guide/README.md$1)');
  lines.push('---', '', `<a id="${item.slug}"></a>`, '', `## ${item.title}`, '', 'Draft · confirm against the supported release, role and platform.', '', source, '');
}
fs.writeFileSync('docs/WEBSITE_MANUAL_REVIEW.md', lines.join('\n') + '\n');
console.log('Regenerated the illustrated 15-chapter website reading edition. Canonical sources were not modified.');
