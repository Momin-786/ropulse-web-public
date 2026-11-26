import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const origin = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3027';
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' });
const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
const root = '**/api/subscriber/subscriber';
const tenant = root + '/tenants/qa';
let activation, change;

try {
  await page.route(root + '/auth/session', route => route.fulfill({ json: { authenticated: true } }));
  await page.route(root + '/owner-invitations/activate', route => {
    activation = route.request().postDataJSON();
    return route.fulfill({ json: { pin: '014583' } });
  });
  await page.route(root + '/tenants', route => route.fulfill({
    json: [{ tenantId: 'qa', workspaceCode: 'qa-restaurant', displayName: 'QA Restaurant' }],
  }));
  await page.route(root + '/billing/invoices', route => route.fulfill({ json: [] }));
  await page.route(tenant + '/licensing', route => route.fulfill({ json: { subscription: { provider: 'MANUAL', status: 'PILOT' } } }));
  await page.route(tenant + '/readiness', route => route.fulfill({ json: { ready: true, prerequisites: {
    businessIdentityConfirmed: true, receiptIdentityConfigured: true, taxReviewed: true,
  } } }));
  await page.route(tenant + '/owner-credentials', route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { pinSet: true, adminPasswordSet: true } });
    change = route.request().postDataJSON();
    return route.fulfill({ json: { pin: '3129' } });
  });

  await page.goto(origin + '/owner-invitation?token=qa-invitation');
  await page.getByLabel('Register PIN length').selectOption('6');
  const pass = page.getByLabel('Back Office password', { exact: true });
  await pass.fill('Local test passphrase');
  await page.getByRole('button', { name: 'Show Back Office password' }).click();
  assert.equal(await pass.getAttribute('type'), 'text');
  await page.getByRole('button', { name: 'Activate workspace' }).click();
  await page.getByText('014583', { exact: true }).waitFor();
  assert.equal(await pass.count(), 0);
  assert.deepEqual(activation, { token: 'qa-invitation', pinLength: 6, adminPassword: 'Local test passphrase' });
  await page.getByRole('link', { name: 'I saved my PIN. Open account' }).click();
  await page.getByRole('button', { name: 'Set up workspace' }).click();
  await page.getByText('Register and Back Office sign-in', { exact: true }).click();
  assert.equal(await page.getByText('014583', { exact: true }).count(), 0);
  await page.getByRole('checkbox', { name: 'Generate a new Register PIN' }).check();
  await page.getByLabel('Register PIN length').selectOption('4');
  await page.getByLabel('Confirm website password').fill('Website test passphrase');
  await page.getByRole('button', { name: 'Update sign-in credentials' }).click();
  await page.getByText('3129', { exact: true }).waitFor();
  assert.deepEqual(change, { websitePassword: 'Website test passphrase', regeneratePin: true, pinLength: 4 });
  await page.getByRole('button', { name: 'I saved my PIN' }).click();
  assert.equal(await page.getByText('3129', { exact: true }).count(), 0);
  assert.equal(await page.getByLabel('Confirm website password').inputValue(), '');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  console.log('Generated owner PIN, Back Office password setup, rotation and one-time display passed.');
} finally {
  await browser.close();
}
