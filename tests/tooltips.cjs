const assert = require('node:assert/strict');
const { createServer } = require('vite');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { chromium, expect } = require(process.env.PLAYWRIGHT_PACKAGE || '@playwright/test');

(async () => {
 const cacheDir = mkdtempSync(join(tmpdir(), 'fipu-tooltip-test-'));
 const client = `
 import { createApp, h, ref } from 'vue';
 import { TooltipProvider, ToolbarRoot, ToolbarButton, PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent } from 'reka-ui';
 import Tooltip from '/src/components/Base/Tooltip.vue';
 import BaseButtons from '/src/components/Base/BaseButtons.vue';
 import BaseButton from '/src/components/Base/BaseButton.vue';
 import Diagram from '/vendor/fipu-bpmn/BpmnDiagram.vue';
 import '/src/css/main.css';
 const model = { processId: 'test', pools: [], lanes: [], flows: [], nodes: [{ id: 'task', type: 'userTask', name: 'Testni zadatak', x: 40, y: 40, width: 130, height: 80 }] };
 createApp({setup() {
  const clicks = ref(0);
  const tip = (content, child) => h(Tooltip, { content }, () => child);
  return () => h(TooltipProvider, { delayDuration: 30 }, () => h('main', { style: 'padding: 60px; display: grid; gap: 30px' }, [
   h(BaseButtons, {}, () => [tip('Detalji zadatka', h(BaseButton, { label: 'Detalji', onClick: () => clicks.value++ }))]),
   h('output', { id: 'clicks' }, String(clicks.value)),
   h(ToolbarRoot, {}, () => [tip('Umanji', h(ToolbarButton, { asChild: true }, () => h(BaseButton, { label: 'Minus' }))), tip('Uvećaj', h(ToolbarButton, { asChild: true }, () => h(BaseButton, { label: 'Plus' })))]),
   h(PopoverRoot, {}, () => [tip('Promijeni avatar', h(PopoverTrigger, { asChild: true }, () => h(BaseButton, { label: 'Avatar' }))), h(PopoverPortal, {}, () => h(PopoverContent, {}, () => 'Uređivanje avatara'))]),
   tip('Izbornik', h('button', { id: 'nested' }, [tip('Neodobren zadatak', h('span', { tabindex: 0, id: 'pending', onPointermove: event => event.stopPropagation() }, '●')), ' Zadaci'])),
   tip('Status zadatka', h('span', { tabindex: 0, role: 'img', 'aria-label': 'Status' }, '●')),
   h(Diagram, { model, tooltipComponent: Tooltip, style: 'height: 250px; width: 500px' }),
   h(Diagram, { model, style: 'height: 150px; width: 300px', id: 'fallback' }),
  ]));
 }}).mount('#app');`;
 const server = await createServer({ cacheDir, server: { host: '127.0.0.1', port: 0 }, plugins: [{
  name: 'tooltip-test-fixture',
  resolveId(id) { if (id === '/__tooltip-test.js') return id; },
  load(id) { if (id === '/__tooltip-test.js') return client; },
  configureServer(server) { server.middlewares.use((req, res, next) => {
   if (req.url === '/__tooltip-test') { res.setHeader('Content-Type', 'text/html'); res.end('<div id="app"></div><script type="module" src="/__tooltip-test.js"></script>'); }
   else next();
  }); },
 }] });
 let browser;
 try {
  await server.listen();
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__tooltip-test`);
  const details = page.getByRole('button', { name: 'Detalji', exact: true });
  await details.hover();
  const tooltip = () => page.getByRole('tooltip');
  const expectTip = async text => {
   await expect(page.getByRole('tooltip', { name: text, exact: true })).toBeAttached();
   await expect(tooltip()).toHaveCount(1);
  };
  await expectTip('Detalji zadatka');
  assert.equal(await details.getAttribute('title'), null);
  await expect(details).toHaveClass(/mr-3/);
  assert.equal(await tooltip().evaluate(el => el.closest('#app')), null, 'Tooltip must be portalled outside clipping containers');
  assert.notEqual(await tooltip().evaluate(el => getComputedStyle(el.parentElement).backgroundColor), 'rgba(0, 0, 0, 0)');
  await page.keyboard.press('Escape');
  await expect(tooltip()).toHaveCount(0);
  await details.click();
  await expect(page.locator('#clicks')).toHaveText('1');
  await page.mouse.move(0, 0);
  await page.getByRole('img', { name: 'Status', exact: true }).focus();
  await expectTip('Status zadatka');
  await page.keyboard.press('Escape');
  const minus = page.getByRole('button', { name: 'Minus' });
  await minus.focus();
  await expectTip('Umanji');
  await minus.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Plus' })).toBeFocused();
  await expectTip('Uvećaj');
  await page.keyboard.press('Escape');
  const avatar = page.getByRole('button', { name: 'Avatar', exact: true });
  await avatar.hover();
  await expectTip('Promijeni avatar');
  await avatar.click();
  await expect(page.getByText('Uređivanje avatara', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByText('Uređivanje avatara', { exact: true })).toHaveCount(0);
  await page.mouse.move(0, 0);
  await page.locator('#pending').hover();
  await expectTip('Neodobren zadatak');
  await page.keyboard.press('Escape');
  const node = page.locator('svg:not(#fallback) .bpmn-node');
  await node.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await node.hover();
  await expectTip('Testni zadatak · userTask');
  assert.equal(await node.locator('title').count(), 0, 'No duplicate native SVG tooltip');
  await page.keyboard.press('Escape');
  await page.mouse.move(0, 0);
  await node.focus();
  await expectTip('Testni zadatak · userTask');
  await expect(page.locator('#fallback .bpmn-node title')).toHaveText('Testni zadatak · userTask');
  assert.deepEqual(errors, []);
  console.log('Tooltip checks passed: hover, focus, Escape, portal, styling, clicks, toolbar arrows, popover and SVG fallback.');
 } finally { await browser?.close(); await server.close(); rmSync(cacheDir, { recursive: true, force: true }); }
})().catch(error => { console.error(error); process.exitCode = 1; });
