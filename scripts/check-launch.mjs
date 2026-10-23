import policies from '../src/content/policies.json' with { type: 'json' };
import releases from '../src/content/releases.json' with { type: 'json' };
import { availableArticles } from '../src/lib/manual-manifest.mjs';
import { launchChecks } from '../src/lib/launch.mjs';
const mode = process.argv[2] || 'site';
try {
  const checks = launchChecks({ policies, releases, articles: availableArticles(false), mode });
  console.log(`RoPulse ${mode} launch readiness\n`);
  for (const [name, passes] of checks) console.log(`${passes ? 'PASS' : 'MISSING'}  ${name}`);
  console.log('\nVerification flags record completed evidence; do not set them to silence failures. See docs/PUBLIC_LAUNCH.md.');
  if (checks.some(([, pass]) => !pass)) process.exitCode = 1;
} catch (error) { console.error(error.message); process.exitCode = 1; }
