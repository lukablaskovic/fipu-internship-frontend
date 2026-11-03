// Run after npm run build to exercise the production chunk loading order.
const { preview } = require('vite');
const { chromium, expect } = require(process.env.PLAYWRIGHT_PACKAGE || '@playwright/test');

(async () => {
 const server = await preview({ preview: { host: '127.0.0.1', port: 0, open: false } });
 let browser;
 try {
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const page = await browser.newPage();
  const base = 'http://127.0.0.1:' + server.httpServer.address().port;
  await page.route(/^https:\/\//, route => route.fulfill({ json: { data: { results: [] } } }));
  await page.goto(base + '/prijava');
  await page.getByRole('link', { name: /Nastavi kao gost/ }).click();
  await expect(page).toHaveURL(base + '/moja-praksa');
  await expect(page.getByRole('heading', { name: 'Dostupni zadaci' })).toBeVisible();
 } finally {
  await browser?.close();
  await new Promise(resolve => server.httpServer.close(resolve));
 }
})().catch(error => { console.error(error); process.exitCode = 1; });
