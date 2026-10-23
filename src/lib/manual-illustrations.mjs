import illustrations from '../content/manual-illustrations.json' with { type: 'json' };
import { manualImage } from './manual-images.mjs';
export function illustrateGuide(source, slug) {
  for (const item of illustrations[slug] || []) {
    if (!manualImage(item.src)) throw new Error(`Unapproved manual image: ${item.src}`);
    const image = `![${item.alt}](${item.src} "${item.caption}")`;
    if (item.appendHeading) source += `\n\n## ${item.appendHeading}\n\n${item.text}\n\n${image}\n`;
    else {
      const heading = item.afterHeading ? `## ${item.afterHeading}` : source.match(/^## .+$/m)?.[0];
      const offset = heading ? source.indexOf(heading) : -1;
      if (offset < 0) throw new Error(`Illustration heading missing in ${slug}: ${heading}`);
      const end = source.indexOf('\n', offset);
      source = source.slice(0, end + 1) + `\n${image}\n\n` + source.slice(end + 1).replace(/^\r?\n/, '');
    }
  }
  return source;
}
