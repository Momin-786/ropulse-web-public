import fs from 'node:fs';
import { dependencySecurityErrors } from '../src/lib/dependency-security.mjs';
const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
const installed = name => {
  try { return JSON.parse(fs.readFileSync(`node_modules/${name}/package.json`, 'utf8')).version; } catch { return null; }
};
const errors = dependencySecurityErrors({ declaredNext: manifest.dependencies.next, lockedNext: lock.packages['node_modules/next']?.version, installedNext: installed('next'), lockedSharp: lock.packages['node_modules/sharp']?.version, installedSharp: installed('sharp') });
if (errors.length) {
  console.error('DEPLOYMENT BLOCKED:\n' + errors.map(error => `- ${error}`).join('\n') + '\nUpdate dependencies and run clean-install CI. See docs/PUBLIC_LAUNCH.md.');
  process.exitCode = 1;
} else console.log('Next.js baseline patch gate passed. A current dependency audit and CI are still required.');
