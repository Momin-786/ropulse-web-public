import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const css = fs.readFileSync('src/app/globals.css', 'utf8');
const token = name => css.match(new RegExp(`--${name}:(#[a-fA-F0-9]{6})`))[1];
function luminance(hex) {
  const channels = hex.replace('#', '').match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a, b) { const values = [luminance(a), luminance(b)].sort((x, y) => y - x); return (values[0] + 0.05) / (values[1] + 0.05); }
test('brand reading and primary action pairs meet normal-text AA contrast', () => {
  for (const [a, b] of [[token('ink'), token('page')], [token('muted'), token('page')], ['#ffffff', token('plum')], ['#ffffff', token('magenta')]]) assert.ok(contrast(a, b) >= 4.5, `${a}/${b} contrast: ${contrast(a, b)}`);
});
test('interactive input boundaries meet 3:1 against white and page surfaces', () => {
  for (const background of ['#ffffff', token('page')]) assert.ok(contrast(token('control-border'), background) >= 3);
});
