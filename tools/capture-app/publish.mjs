import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const source = 'tmp/app-capture/output/register-redesign';
const target = 'public/images/product';
fs.mkdirSync(target, { recursive: true });
const files = ['desktop-light.png', 'desktop-dark.png', 'mobile-light.png', 'floor-1440.png'];
const provenance = JSON.parse(fs.readFileSync('tmp/app-capture/.capture-source.json', 'utf8'));
const captures = files.map(file => {
  const bytes = fs.readFileSync(path.join(source, file));
  fs.writeFileSync(path.join(target, file), bytes);
  return { file: `/images/product/${file}`, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
});
fs.writeFileSync('src/content/product-captures.json', JSON.stringify({
  capturedAt: new Date().toISOString(), sourceCommit: provenance.sourceCommit,
  appVersion: fs.readFileSync('tmp/app-capture/pubspec.yaml', 'utf8').match(/^version:\s*(.+)$/m)?.[1]?.trim() || null, method: 'Flutter widget rendering from isolated app source snapshot',
  test: 'test/register_redesign_test.dart', fixtureData: true, pixelsRetouched: false,
  verification: 'Record the actual capture test result in docs/WEBSITE_QA.md; this manifest does not certify a live backend or physical hardware', captures,
}, null, 2) + '\n');
console.log('Published four unretouched app captures with provenance and SHA-256 hashes.');
