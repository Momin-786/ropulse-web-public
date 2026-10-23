import releases from '../content/releases.json' with { type: 'json' };
import { httpsUrl } from './site.mjs';
export function releaseErrors(release) {
  const errors = [];
  for (const key of ['platform', 'version', 'publishedAt', 'requirements', 'notes']) if (typeof release[key] !== 'string' || !release[key].trim()) errors.push(`Missing ${key}`);
  if (!httpsUrl(release.url)) errors.push('Download URL must be HTTPS');
  if (!/^[a-f0-9]{64}$/i.test(release.sha256 || '')) errors.push('Installer requires a SHA-256 hash');
  if (Number.isNaN(Date.parse(release.publishedAt))) errors.push('Invalid publication date');
  return errors;
}
/** @returns {Array<{platform:string,version:string,publishedAt:string,requirements:string,notes:string,url:string,sha256:string}>} */
export function getReleases() { return releases.filter(release => releaseErrors(release).length === 0); }
