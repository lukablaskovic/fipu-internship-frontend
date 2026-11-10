// Run after npm run build. All remote traffic is intercepted; no accounts are changed.
const assert = require('node:assert/strict');
const { preview } = require('vite');
const { chromium, expect } = require(process.env.PLAYWRIGHT_PACKAGE || '@playwright/test');

(async () => {
 const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
 let browser;
 try {
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const page = await browser.newPage();
  const errors = [];
  const writes = [];
  let failWrite = false;
  let signedInEmail = 'lblaskovi@unipu.hr';
  let emails = ['lblaskovi@unipu.hr', 'coordinator@unipu.hr'];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => sessionStorage.setItem('google-id-token', 'synthetic-test-token'));
  await page.route(/^https:\/\//, route => {
   const request = route.request();
   if (request.resourceType() === 'script') return route.fulfill({ contentType: 'text/javascript', body: request.url().startsWith('https://accounts.google.com/') ? 'window.google = { accounts: { id: { initialize() {}, renderButton() {}, prompt() {} } } };' : '' });
   const path = new URL(request.url()).pathname;
   if (path.endsWith('/api/session')) return route.fulfill({ json: { email: signedInEmail, coordinator: true, student: { id: 42, email: signedInEmail, ime: 'Test', prezime: 'Administrator' } } });
   if (path.endsWith('/api/administratori')) {
    if (request.method() !== 'GET') {
     writes.push({ method: request.method(), ...request.postDataJSON() });
     if (failWrite) return route.fulfill({ status: 503, body: 'unavailable' });
     const { email } = request.postDataJSON();
     emails = request.method() === 'POST' ? [...new Set([...emails, email])] : emails.filter(value => value !== email);
    }
    return route.fulfill({ json: emails });
   }
   return route.fulfill({ json: { data: { results: [] }, results: [] } });
  });
  const base = 'http://127.0.0.1:' + server.httpServer.address().port;
  await page.goto(base + '/administratori');
  const input = page.getByRole('textbox', { name: 'E-mail novog administratora' });
  await expect(input).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ukloni administratora lblaskovi@unipu.hr', exact: true })).toHaveCount(0);
  for (const width of [1440, 390]) {
   await page.setViewportSize({ width, height: 900 });
   await expect(input).toBeVisible();
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
  }
  await input.fill('outsider@example.org');
  await page.getByRole('button', { name: 'Dodaj administratora', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('institucionalnu');
  assert.equal(writes.length, 0);
  await input.fill('New.Admin@UNIPU.HR');
  await page.getByRole('button', { name: 'Dodaj administratora', exact: true }).click();
  await expect(page.getByRole('cell', { name: /^(E-mail )?new\.admin@unipu\.hr$/ })).toBeVisible();
  assert.deepEqual(writes[0], { method: 'POST', email: 'new.admin@unipu.hr' });
  await expect(input).toHaveValue('');
  const remove = page.getByRole('button', { name: 'Ukloni administratora new.admin@unipu.hr', exact: true });
  await remove.click();
  await page.getByRole('dialog').getByRole('button', { name: 'Natrag', exact: true }).click();
  assert.equal(writes.length, 1, 'Cancelling does not revoke access');
  await expect(remove).toBeFocused();
  await remove.click();
  failWrite = true;
  await page.getByRole('dialog').getByRole('button', { name: 'Ukloni pristup', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Promjena nije potvrđena');
  await expect(remove).toBeVisible();
  failWrite = false;
  await remove.click();
  await page.getByRole('dialog').getByRole('button', { name: 'Ukloni pristup', exact: true }).click();
  await expect(remove).toHaveCount(0);
  assert.deepEqual(writes[2], { method: 'DELETE', email: 'new.admin@unipu.hr' });
  await page.reload();
  await expect(page.getByRole('cell', { name: /^(E-mail )?coordinator@unipu\.hr$/ })).toBeVisible();
  await expect(remove).toHaveCount(0);
  signedInEmail = 'coordinator@unipu.hr';
  await page.goto(base + '/administratori');
  await expect(page).toHaveURL(base + '/dashboard');
  await expect(page.getByRole('button', { name: 'Dodaj administratora', exact: true })).toHaveCount(0);
  assert.deepEqual(errors, []);
  console.log('Administrator browser checks passed: validation, add, cancel, remove, errors, reload, role guard, keyboard focus and mobile layout.');
 } finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
 }
})().catch(error => { console.error(error); process.exitCode = 1; });
