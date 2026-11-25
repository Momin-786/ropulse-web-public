import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3019';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const invoices = [];
const replacements = [];

try {
  await page.route('**/api/subscriber/subscriber/auth/session', route =>
    route.fulfill({ json: { authenticated: true } }));
  await page.route('**/api/subscriber/subscriber/billing/catalog', route => route.fulfill({ json: {
    planVersions: [{ id: 'restaurant-plan', name: 'Restaurant', code: 'RESTAURANT', currency: 'PKR', monthlyPrice: '1000' }],
    addOns: [
      { code: 'KITCHEN_DISPLAY_BRANCH', versionId: 'kitchen-base', name: 'RoPulse Kitchen', currency: 'PKR', unitPrice: '100' },
      { code: 'ADDITIONAL_KITCHEN_DISPLAY', versionId: 'kitchen-extra', name: 'Additional kitchen screen', currency: 'PKR', unitPrice: '80' },
    ],
  } }));
  await page.route('**/api/subscriber/subscriber/billing/invoices', async route => {
    invoices.push(route.request().postDataJSON());
    await route.fulfill({ status: 201, json: { id: 'qa', status: 'PENDING_PAYMENT', currency: 'PKR', total: '1260' } });
  });
  await page.route('**/api/subscriber/subscriber/tenants/qa-tenant/licensing/kitchen-checkout', route => route.fulfill({ json: {
    workspaceName: 'QA Kitchen', planVersionId: 'restaurant-plan', currency: 'PKR', branchQuantity: 2,
    additionalTerminalQuantity: 3, addOnVersionIds: ['existing-extra-terminal'],
    branches: [
      { branchId: 'original-branch', name: 'Main Kitchen', included: true, extraScreens: 1 },
      { branchId: 'second-branch', name: 'Terrace Kitchen', included: false, extraScreens: 0 },
    ],
  } }));
  await page.route('**/api/subscriber/subscriber/billing/tenants/qa-tenant/replacement-invoices', async route => {
    replacements.push(route.request().postDataJSON());
    await route.fulfill({ status: 201, json: { id: 'replacement', status: 'PENDING_PAYMENT', currency: 'PKR', total: '3580' } });
  });

  await page.goto(`${baseUrl}/checkout`);
  const plan = page.getByRole('combobox').nth(0);
  const profile = page.getByRole('combobox').nth(1);
  await plan.selectOption('restaurant-plan');
  await profile.selectOption('RETAIL');
  assert.equal(await page.getByRole('checkbox', { name: /Add RoPulse Kitchen/ }).count(), 0);
  await profile.selectOption('RESTAURANT');
  await page.getByRole('checkbox', { name: /Add RoPulse Kitchen/ }).check();
  await page.getByLabel(/Additional screens/).fill('2');
  await page.getByRole('button', { name: 'Create purchase summary' }).click();
  await page.getByText(/PKR 1260 due now/).waitFor();
  assert.deepEqual(invoices[0].addOnVersionIds, []);
  assert.deepEqual(invoices[0].kitchenDisplays, [{
    branchId: null, baseVersionId: 'kitchen-base', extraVersionId: 'kitchen-extra', extraScreens: 2,
  }]);
  assert.equal(await page.getByRole('button', { name: 'Continue to Safepay' }).isEnabled(), false);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

  await page.goto(`${baseUrl}/checkout?kitchenTenant=qa-tenant`);
  const original = page.getByRole('group', { name: 'Main Kitchen' });
  const second = page.getByRole('group', { name: 'Terrace Kitchen' });
  assert.equal(await original.getByRole('checkbox').isChecked(), true);
  assert.equal(await page.getByRole('button', { name: 'Review recurring total' }).isEnabled(), false);
  await second.getByRole('checkbox').check();
  await second.getByRole('spinbutton').fill('2');
  await page.getByRole('button', { name: 'Review recurring total' }).click();
  await page.getByText(/PKR 3580 per month/).waitFor();
  assert.equal(replacements[0].additionalTerminalQuantity, 3);
  assert.deepEqual(replacements[0].addOnVersionIds, ['existing-extra-terminal']);
  assert.deepEqual(replacements[0].kitchenDisplays.map(branch => [branch.branchId, branch.extraScreens]), [
    ['original-branch', 1], ['second-branch', 2],
  ]);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  console.log('Kitchen signup and replacement selections, invoice payloads, summaries, and mobile layout passed.');
} finally {
  await browser.close();
}
