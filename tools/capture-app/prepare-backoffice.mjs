import fs from 'node:fs';
// Font-only capture shim: Flutter's test font otherwise renders unqualified
// TextPainter/Dropdown labels as Ahem boxes. Never modify the original app.
for (const path of ['packages/ropulse_design_system/lib/src/tokens/typography.dart', 'packages/ropulse_backoffice/lib/src/dashboard/dashboard_screen.dart']) {
  const target = `tmp/app-capture/${path}`;
  let source = fs.readFileSync(target, 'utf8');
  if (path.endsWith('typography.dart')) source = source.replaceAll('fontFamilyFallback: fallback,', "fontFamily: 'Segoe UI', fontFamilyFallback: fallback,").replaceAll("fontFamily: 'Segoe UI', fontFamily: 'Segoe UI',", "fontFamily: 'Segoe UI',");
  else source = source.replace('TextStyle(fontSize: 11, color: labelColor)', "TextStyle(fontSize: 11, color: labelColor, fontFamily: 'Segoe UI')");
  fs.writeFileSync(target, source);
}
fs.copyFileSync('tools/capture-app/backoffice_capture_test.dart', 'tmp/app-capture/test/website_backoffice_capture_test.dart');
console.log('Prepared real-widget Backoffice capture tests in the isolated app snapshot.');
