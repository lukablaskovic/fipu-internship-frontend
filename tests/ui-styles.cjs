const assert = require('node:assert/strict');
const { createServer } = require('vite');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { chromium, expect } = require(process.env.PLAYWRIGHT_PACKAGE || '@playwright/test');

(async () => {
 const cacheDir = mkdtempSync(join(tmpdir(), 'fipu-ui-styles-'));
 const client = `
 import { createApp, h, ref } from 'vue';
 import { createPinia } from 'pinia';
 import { TooltipProvider } from 'reka-ui';
 import FormField from '/src/components/Form/FormField.vue';
 import FormControl from '/src/components/Form/FormControl.vue';
 import FormCheckRadio from '/src/components/Form/FormCheckRadio.vue';
 import FormTechnologyPicker from '/src/components/Form/FormTechnologyPicker.vue';
 import BasePagination from '/src/components/Base/BasePagination.vue';
 import '/src/css/main.css';
 createApp({ setup() {
  const checked = ref(false), selected = ref([]), page = ref(1);
  return () => h(TooltipProvider, {}, () => h('main', { style: 'padding: 24px; display: grid; gap: 24px' }, [
   h(FormField, { name: 'text', label: 'Text' }, () => h(FormControl, { id: 'text', modelValue: 'Test' })),
   h(FormField, { name: 'select', label: 'Choice' }, () => h(FormControl, { id: 'select', options: ['First', 'Second'], modelValue: 'First' })),
   h(FormCheckRadio, { type: 'checkbox', name: 'accept', label: 'Accept', modelValue: checked.value, 'onUpdate:modelValue': v => checked.value = v }),
   h(FormField, { name: 'technology', label: 'Technology' }, () => h(FormTechnologyPicker, { modelValue: selected.value, 'onUpdate:modelValue': v => selected.value = v })),
   h(BasePagination, { page: page.value, total: 100, itemsPerPage: 10, 'onUpdate:page': v => page.value = v }),
  ]));
 }}).use(createPinia()).mount('#app');`;
 const server = await createServer({ cacheDir, server: { host: '127.0.0.1', port: 0 }, plugins: [{
  name: 'ui-styles-test',
  resolveId(id) { if (id === '/__ui-styles.js') return id; },
  load(id) { if (id === '/__ui-styles.js') return client; },
  configureServer(server) { server.middlewares.use((req, res, next) => {
   if (req.url === '/__ui-styles') { res.setHeader('Content-Type', 'text/html'); res.end('<meta name="viewport" content="width=device-width, initial-scale=1"><div id="app"></div><script type="module" src="/__ui-styles.js"></script>'); }
   else next();
  }); },
 }] });
 let browser;
 try {
  await server.listen();
  browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  await page.route(/^https:\/\//, route => route.fulfill({ json: { data: { results: [] } } }));
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__ui-styles`);
  const text = page.locator('#text');
  await expect(text).toBeVisible();
  await expect(text).toHaveCSS('border-radius', '10px');
  await expect(text).toHaveCSS('caret-color', 'rgb(70, 186, 224)');
  await text.focus();
  await expect(page.locator('.form-control-surface').first()).toHaveCSS('border-color', 'rgb(70, 186, 224)');
  const select = page.locator('#select');
  await expect(select).toHaveCSS('border-radius', '10px');
  await select.click();
  await expect(page.getByRole('option', { name: 'Second' })).toBeVisible();
  await page.keyboard.press('Escape');
  const checkbox = page.getByRole('checkbox', { name: 'Accept' });
  await expect(checkbox).toHaveCSS('width', '20px');
  await expect(checkbox).toHaveCSS('border-radius', '4px');
  await checkbox.click();
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toHaveCSS('border-width', '4px');
  const technology = page.getByRole('combobox').last();
  await technology.fill('Python');
  const option = page.getByRole('option', { name: 'Python', exact: true });
  await expect(option).toBeVisible();
  await expect.poll(() => option.locator('img').evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  await option.click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Ukloni Python', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Ukloni Python', exact: true }).click();
  await page.keyboard.press('Escape');
  const next = page.getByRole('button', { name: 'Sljedeća stranica', exact: true });
  await expect(next).toHaveCSS('height', '36px');
  await next.click();
  await expect(page.getByRole('button', { name: 'Stranica 2', exact: true })).toHaveAttribute('aria-current', 'page');
  const light = await text.evaluate(el => getComputedStyle(el).backgroundColor);
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await expect.poll(() => text.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(light);
  for (const width of [390, 768]) {
   await page.setViewportSize({ width, height: 844 });
   await expect(next).toHaveCSS('height', '44px');
   assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
  }
  assert.deepEqual(errors, []);
  console.log('UI styles passed: input radii, select portal, checkbox state, SVG assets, technology selection/removal, pagination, dark mode and mobile layout.');
 } finally { await browser?.close(); await server.close(); rmSync(cacheDir, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
