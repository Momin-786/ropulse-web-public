import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const source = path.resolve(root, '../app');
const target = path.resolve(root, 'tmp/app-capture');
if (!target.startsWith(root + path.sep)) throw new Error('Capture destination must stay in this workspace.');
fs.mkdirSync(target, { recursive: true });
const gitArgs = ['-c', `safe.directory=${source.replaceAll('\\', '/')}`, '-C', source];
const sourceCommit = execFileSync('git', [...gitArgs, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const modified = execFileSync('git', [...gitArgs, 'status', '--porcelain'], { encoding: 'utf8' }).trim();
if (modified) throw new Error('Capture requires a clean app source checkout so the revision is reproducible.');
const excluded = new Set(['.git', 'build', '.dart_tool', 'node_modules', 'output']);
for (const directory of ['lib', 'packages', 'test']) {
  fs.cpSync(path.join(source, directory), path.join(target, directory), {
    recursive: true,
    filter: file => !excluded.has(path.basename(file)),
  });
}
for (const file of ['pubspec.yaml', 'pubspec.lock', 'dart_test.yaml', '.flutter-plugins-dependencies']) {
  if (fs.existsSync(path.join(source, file))) fs.copyFileSync(path.join(source, file), path.join(target, file));
}
fs.mkdirSync(path.join(target, '.dart_tool'), { recursive: true });
const configFile = path.join(source, '.dart_tool/package_config.json');
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
const sourceUrl = pathToFileURL(source + path.sep).href;
const targetUrl = pathToFileURL(target + path.sep).href;
for (const pkg of config.packages) {
  const resolved = new URL(pkg.rootUri, pathToFileURL(configFile)).href;
  pkg.rootUri = resolved.startsWith(sourceUrl) ? targetUrl + resolved.slice(sourceUrl.length) : resolved;
}
fs.writeFileSync(path.join(target, '.dart_tool/package_config.json'), JSON.stringify(config, null, 2));
for (const file of ['package_graph.json', 'version']) {
  if (fs.existsSync(path.join(source, '.dart_tool', file))) fs.copyFileSync(path.join(source, '.dart_tool', file), path.join(target, '.dart_tool', file));
}
console.log('Prepared isolated app-source capture workspace. The sibling app is read-only.');
fs.writeFileSync(path.join(target, '.capture-source.json'), JSON.stringify({ sourceCommit, preparedAt: new Date().toISOString() }, null, 2));
console.log('Run Flutter capture tests from tmp/app-capture; outputs remain in this workspace.');
