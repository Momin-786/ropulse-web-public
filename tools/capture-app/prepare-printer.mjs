import fs from 'node:fs';
import crypto from 'node:crypto';
const paths = ['hardware/hardware_screen.dart', 'hardware/kot_operations_panel.dart', 'hardware/kot_operations_controller.dart', 'hardware/kot_printer_bindings_controller.dart', 'receipts/receipt_center_screen.dart', 'receipts/receipt_center_controller.dart', 'pos_shell/receipt_printer.dart'];
const hashes = {};
for (const file of paths) {
  const relative = `packages/ropulse_backoffice/lib/src/${file}`;
  const current = fs.readFileSync(`../app/${relative}`);
  const snapshot = fs.readFileSync(`tmp/app-capture/${relative}`);
  if (!current.equals(snapshot)) throw new Error(`Capture snapshot differs from current app: ${relative}`);
  hashes[relative] = crypto.createHash('sha256').update(snapshot).digest('hex');
}
fs.writeFileSync('tmp/app-capture/.printer-source.json', JSON.stringify({ comparedAt: new Date().toISOString(), method: 'Exact hash comparison of printer UI/controller files in current worktree and isolated source snapshot; no sibling app changes', files: hashes }, null, 2));
fs.copyFileSync('tools/capture-app/printer_capture_test.dart', 'tmp/app-capture/test/website_printer_capture_test.dart');
console.log('Verified current printer sources match the isolated snapshot and prepared 7 capture scenarios.');
