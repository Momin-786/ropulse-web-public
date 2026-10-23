import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
const root = process.cwd();
const target = path.join(root, '.next', 'standalone');
await fs.access(path.join(target, 'server.js'));
await fs.cp(path.join(root, 'public'), path.join(target, 'public'), { recursive: true });
await fs.cp(path.join(root, '.next', 'static'), path.join(target, '.next', 'static'), { recursive: true });
const child = spawn(process.execPath, [path.join(target, 'server.js')], {
  cwd: target, stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production', HOSTNAME: '127.0.0.1', PORT: process.argv[2] || '3001' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code || 0; });
