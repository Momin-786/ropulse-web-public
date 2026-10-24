import test from 'node:test';
import assert from 'node:assert/strict';
import { launchChecks } from '../src/lib/launch.mjs';
const approved = { approved: true, body: 'Reviewed policy', reviewedAt: '2026-10-21' };
const ready = { SITE_URL: 'https://ropulse.io', COMPANY_NAME: 'Confirmed seller', SUPPORT_EMAIL: 'support@ropulse.io', SUPPORT_MAILBOX_VERIFIED: 'true', DOCS_REVIEW_MODE: 'false', DEPENDENCY_SECURITY_VERIFIED: 'true', DEPLOYMENT_VERIFIED: 'true' };
test('information launch is separate from deferred payments and distribution', () => {
  const checks = launchChecks({ env: ready, policies: { privacy: approved, terms: approved }, articles: [], releases: [] });
  assert.ok(checks.every(([, pass]) => pass));
  const paid = launchChecks({ env: ready, policies: { privacy: approved, terms: approved }, articles: [], releases: [], mode: 'paid' });
  assert.ok(paid.some(([, pass]) => !pass));
});
test('a configured URL cannot certify real enquiry delivery', () => {
  const checks = launchChecks({ env: { ...ready, CONTACT_ENDPOINT: 'https://service.example/enquiries' }, policies: { privacy: approved, terms: approved }, articles: [], releases: [], mode: 'enquiries' });
  assert.equal(checks.find(([name]) => name.includes('Durable enquiry'))[1], false);
});
test('Resend configuration satisfies delivery setup but not verification evidence', () => {
  const env = { ...ready, RESEND_API_KEY: 're_test', CONTACT_FROM_EMAIL: 'website@notify.ropulse.io', CONTACT_TO_EMAIL: 'support@ropulse.io,momina7863@gmail.com' };
  const checks = launchChecks({ env, policies: { privacy: approved, terms: approved }, articles: [], releases: [], mode: 'enquiries' });
  assert.equal(checks.find(([name]) => name === 'Enquiry delivery configuration')[1], true);
  assert.equal(checks.find(([name]) => name.includes('Durable enquiry'))[1], false);
});
