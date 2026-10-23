import fs from 'node:fs';
import crypto from 'node:crypto';
const manifestFile = 'src/content/product-captures.json';
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const source = JSON.parse(fs.readFileSync('tmp/app-capture/.printer-source.json', 'utf8'));
for (const name of ['receipt-setup', 'network-printer', 'logical-printer', 'kot-routing', 'device-bindings', 'kot-history', 'kot-details']) {
  const data = fs.readFileSync(`tmp/app-capture/output/printer-manual/${name}.png`);
  const file = `/images/product/printer-${name}.png`;
  fs.writeFileSync(`public${file}`, data);
  const record = { file, width: data.readUInt32BE(16), height: data.readUInt32BE(20), sha256: crypto.createHash('sha256').update(data).digest('hex'), capturedAt: new Date().toISOString(), captureTest: 'test/website_printer_capture_test.dart', sourceCommit: manifest.sourceCommit, sourceVerification: source, fixtureData: true, pixelsRetouched: false, captureOverride: 'Segoe UI and Consolas loaded for test fonts; native printing information mocked unavailable, no physical print calls allowed; in-memory network settings use TEST-NET example addresses.', verification: '7 real-widget capture scenarios passed; no released installer, physical printer, production backend or background delivery certification' };
  manifest.captures = [...manifest.captures.filter(item => item.file !== file), record];
}
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
console.log('Published 7 printer/KOT screenshots with source hashes and demo-only provenance.');
