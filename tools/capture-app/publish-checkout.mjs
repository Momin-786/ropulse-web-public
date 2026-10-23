import fs from 'node:fs';
import crypto from 'node:crypto';
const file = 'src/content/product-captures.json';
const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const name of ['checkout-1440.png', 'checkout-390.png']) {
  const data = fs.readFileSync(`tmp/app-capture/output/register-redesign/${name}`);
  fs.writeFileSync(`public/images/product/${name}`, data);
  const record = { file: `/images/product/${name}`, sha256: crypto.createHash('sha256').update(data).digest('hex'), width: data.readUInt32BE(16), height: data.readUInt32BE(20), capturedAt: new Date().toISOString(), captureTest: 'test/pay_test.dart', captureOverride: 'Development banner disabled; preview font override preserves original chip label color', verification: 'Run capture tests and record their actual result in docs/WEBSITE_QA.md' };
  manifest.captures = [...manifest.captures.filter(item => item.file !== record.file), record];
}
fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
console.log('Published real checkout captures and their SHA-256 provenance. No app UI pixels were retouched.');
