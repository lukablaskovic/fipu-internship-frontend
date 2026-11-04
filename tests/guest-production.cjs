// Run after npm run build to exercise the production chunk loading order.
const assert = require('node:assert/strict');
const { readdirSync, readFileSync } = require('node:fs');
const { preview } = require('vite');
const { chromium, expect } = require(process.env.PLAYWRIGHT_PACKAGE || '@playwright/test');

(async () => {
 for (const file of readdirSync('dist/assets').filter(file => file.endsWith('.css'))) {
  const css = readFileSync('dist/assets/' + file, 'utf8');
  assert.ok(!css.includes('theme('), 'Uncompiled theme() in ' + file);
  assert.ok(!css.includes('var(--color-fipu_'), 'Undefined FIPU CSS variable in ' + file);
 }
 const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
 let browser;
 try {
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = 'http://127.0.0.1:' + server.httpServer.address().port;
  await page.route(/^https:\/\//, route => {
   if (route.request().resourceType() === 'script') return route.fulfill({ contentType: 'text/javascript', body: route.request().url().startsWith('https://accounts.google.com/') ? 'window.google = { accounts: { id: { initialize() {}, renderButton(el, config) { if (!["outline", "filled_black", "filled_blue"].includes(config.theme)) throw new Error("Invalid Google button theme"); }, prompt() {} } } };' : '' });
   return route.fulfill({ json: { data: { results: [] } } });
  });
  await page.goto(base + '/prijava');
  await expect(page.locator('.login-page')).toHaveCSS('background-color', 'rgb(70, 186, 224)');
  await expect(page.locator('.login-page')).toHaveCSS('background-image', /background-blue\.jpg/);
  await expect(page.locator('.welcome h1 span')).toHaveCSS('color', 'rgb(70, 186, 224)');
  await expect(page.locator('.help-link').first()).toHaveCSS('color', 'rgb(70, 186, 224)');
  const background = await page.request.get(base + '/background-blue.jpg');
  assert.equal(background.status(), 200);
  assert.match(background.headers()['content-type'], /image/);
  await page.getByRole('link', { name: /Nastavi kao gost/ }).click();
  await expect(page).toHaveURL(base + '/moja-praksa');
  await expect(page.getByRole('heading', { name: 'Dostupni zadaci' })).toBeVisible();
  await page.goto(base + '/upute');
  await expect(page.getByRole('tab').first()).toBeVisible();
  await page.goto(base + '/poslodavci/novi-zadatak');
  const stepper = page.getByRole('group', { name: 'Koraci prijave zadatka' });
  for (const width of [1440, 390]) {
   await page.setViewportSize({ width, height: 900 });
   await expect(stepper).toBeVisible();
   assert.equal((await stepper.evaluate(el => getComputedStyle(el).gridTemplateColumns)).split(' ').length, 4);
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
  }
  await page.getByRole('button', { name: 'Dalje', exact: true }).click();
  await expect(page.locator('#assignment-step-title')).toHaveText(/^1\./);
  await page.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Prijavljujem zadatak kao novi partner s Fakultetom', exact: true }).click();
  await page.getByRole('button', { name: 'Dalje', exact: true }).click();
  await expect(page.locator('#assignment-step-title')).toHaveText(/^2\./);
  await expect(page.getByPlaceholder('Naziv organizacije', { exact: true })).toBeVisible();
  assert.deepEqual(errors, []);
  console.log('Production browser checks passed: guest navigation, lazy chunks, instruction tabs, four-column mobile stepper and form validation/navigation.');
 } finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
 }
})().catch(error => { console.error(error); process.exitCode = 1; });
