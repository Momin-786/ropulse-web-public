import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const origin = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3026';
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' });
const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
const subscriber = '**/api/subscriber/subscriber';
const tenant = subscriber + '/tenants/owner-qa';
let setup;
let device;
let pairingRequests = 0;
let signedIn = true;

try {
  await page.route(subscriber + '/auth/session', route => {
    if (route.request().method() === 'DELETE') {
      signedIn = false;
      return route.fulfill({ status: 204 });
    }
    return route.fulfill({ json: { authenticated: signedIn } });
  });
  await page.route(subscriber + '/billing/invoices', route => route.fulfill({ json: [] }));
  await page.route(subscriber + '/tenants', route => route.fulfill({
    json: [{ tenantId: 'owner-qa', workspaceCode: 'owner-qa', displayName: 'Owner QA Restaurant' }],
  }));
  await page.route(tenant + '/licensing', route => route.fulfill({ json: {
    subscription: { planCode: 'RESTAURANT', status: 'PILOT', provider: 'MANUAL' },
    entitlement: { terminalSlotCount: 2, occupiedTerminalCount: device ? 1 : 0 },
    riskStatus: { pairingRestricted: false },
    branches: [{ branchId: 'main', name: 'Main' }, { branchId: 'terrace', name: 'Terrace' }],
    devices: device ? [device] : [],
  } }));
  await page.route(tenant + '/readiness', route => route.fulfill({ json: {
    ready: Boolean(setup && device),
    prerequisites: {
      subscriptionActive: true, businessIdentityConfirmed: Boolean(setup), receiptIdentityConfigured: Boolean(setup),
      taxReviewed: Boolean(setup), branchConfigured: true, productExists: true, terminalSlotLicensed: true,
      registerPaired: Boolean(device),
    },
  } }));
  await page.route(tenant + '/owner-setup', async route => {
    assert.equal(route.request().method(), 'POST');
    setup = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });
  await page.route(tenant + '/licensing/branches/terrace/pairing-sessions', async route => {
    assert.equal(route.request().method(), 'POST');
    pairingRequests++;
    await route.fulfill({ json: {
      code: 'DEMO-CODE', expiresAt: new Date(Date.now() + 60_000).toISOString(), branchId: 'terrace',
    } });
  });

  await page.goto(origin + '/account');
  await page.getByRole('button', { name: 'Set up workspace' }).click();
  const setupPanel = page.getByRole('region', { name: 'Workspace setup' });
  await setupPanel.getByText('Confirm your setup').waitFor();
  for (const checkbox of await setupPanel.getByRole('checkbox').all()) await checkbox.check();
  await setupPanel.getByRole('button', { name: 'Save setup confirmations' }).click();
  await setupPanel.getByText('Setup confirmations saved.').waitFor();
  assert.deepEqual(setup, {
    legalNameConfirmed: true, displayNameConfirmed: true, receiptIdentityConfigured: true,
    taxReviewed: true, policiesVersion: '2026-09',
  });
  await setupPanel.getByRole('button', { name: 'Manage Registers' }).click();
  await page.getByText('0 of 2 Register slots in use across this workspace').waitFor();
  await page.getByLabel('Branch').selectOption('terrace');
  await page.getByRole('button', { name: 'Generate pairing code' }).click();
  await page.getByText('DEMO-CODE', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Generate pairing code' }).isEnabled(), false);
  assert.equal(pairingRequests, 1);
  assert.equal(await page.getByRole('button', { name: 'Cancel future renewal' }).count(), 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  device = { deviceId: 'register-qa', name: 'Terrace Register', branchId: 'terrace', platform: 'ANDROID', status: 'ACTIVE' };
  await page.getByRole('button', { name: 'Done with this code' }).click();
  await page.getByText('Terrace Register · Terrace').waitFor();
  assert.equal(await page.getByText('DEMO-CODE', { exact: true }).count(), 0);
  await page.getByRole('button', { name: 'Set up workspace' }).click();
  await page.getByRole('heading', { name: 'Workspace is ready' }).waitFor();
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.waitForURL('**/login');
  assert.equal(signedIn, false);
  console.log('Owner setup, branch pairing, device refresh, mobile layout and sign-out passed.');
} finally {
  await browser.close();
}
