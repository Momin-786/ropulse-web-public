import captures from '../content/product-captures.json' with { type: 'json' };
import callouts from '../content/screenshot-callouts.json' with { type: 'json' };
export function manualImage(source) {
  if (typeof source !== 'string' || !source.startsWith('/images/product/')) return null;
  const image = captures.captures.find(image => image.file === source);
  return image ? { ...image, callouts: callouts[source] || [] } : null;
}
