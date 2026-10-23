import fs from 'node:fs';
const file = 'tmp/app-capture/test/pay_test.dart';
const before = 'child: MaterialApp(\n              theme: previewTheme(),';
const after = 'child: MaterialApp(\n              debugShowCheckedModeBanner: false,\n              theme: previewTheme(),';
const source = fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n');
if (!source.includes(before) && !source.includes(after)) throw new Error('Checkout preview harness changed; inspect before capturing.');
fs.writeFileSync(file, source.replace(before, after).replace("labelStyle: const TextStyle(fontFamily: 'Segoe UI'),", "labelStyle: (theme.chipTheme.labelStyle ?? const TextStyle()).copyWith(fontFamily: 'Segoe UI'),"));
console.log('Disabled the development banner in the isolated checkout capture harness only. App UI/source are unchanged.');
