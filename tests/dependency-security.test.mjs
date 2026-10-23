import test from 'node:test';
import assert from 'node:assert/strict';
import { dependencySecurityErrors } from '../src/lib/dependency-security.mjs';
const patched = { declaredNext: '16.4.2', lockedNext: '16.4.2', installedNext: '16.4.2', lockedSharp: '0.35.5', installedSharp: '0.35.5' };
test('release security gate rejects vulnerable framework and image library versions', () => {
  assert.deepEqual(dependencySecurityErrors(patched), []);
  assert.ok(dependencySecurityErrors({ ...patched, declaredNext: '16.3.1', lockedNext: '16.3.1', installedNext: '16.3.1' }).length);
  assert.ok(dependencySecurityErrors({ ...patched, lockedSharp: '0.35.4', installedSharp: '0.35.4' }).length);
});
test('updating the manifest cannot disguise an outdated installed build dependency', () => {
  assert.ok(dependencySecurityErrors({ ...patched, installedNext: '16.3.1' }).some(error => error.includes('must match')));
  assert.ok(dependencySecurityErrors({ ...patched, installedSharp: '0.35.4' }).some(error => error.includes('must match')));
});
test('unreviewed majors and non-pinned or prerelease versions fail closed', () => {
  for (const version of ['^16.4.2', '16.4.2-canary.1', '17.0.0', 'invalid']) assert.ok(dependencySecurityErrors({ ...patched, declaredNext: version, lockedNext: version, installedNext: version }).length);
});
