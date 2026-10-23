import fs from 'node:fs';
import crypto from 'node:crypto';
const file = 'src/content/product-captures.json';
const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const name of ['dashboard', 'staff', 'products', 'customers', 'stock', 'reports', 'hardware', 'payments', 'shifts', 'orders']) {
  const data = fs.readFileSync(`tmp/app-capture/output/backoffice-captures/${name}.png`);
  const asset = `/images/product/backoffice-${name}.png`;
  fs.writeFileSync(`public${asset}`, data);
  const record = { file: asset, sha256: crypto.createHash('sha256').update(data).digest('hex'), width: data.readUInt32BE(16), height: data.readUInt32BE(20), capturedAt: new Date().toISOString(), captureTest: 'test/website_backoffice_capture_test.dart', fixtureData: true, sourceCommit: manifest.sourceCommit, captureOverride: 'Segoe UI font family specified for test rendering, including typography and dashboard chart labels; development banner disabled. Real app widgets with seeded repositories.', verification: '9-screen capture suite passed; additional Orders capture passed separately. No live backend, provider or hardware certification' };
  manifest.captures = [...manifest.captures.filter(item => item.file !== asset), record];
}
fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n');
console.log('Published 10 real Backoffice screens with SHA-256 provenance.');
