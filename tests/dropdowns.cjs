const assert = require('node:assert/strict');
const { createServer } = require('vite');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { chromium, expect } = require(process.env.PLAYWRIGHT_PACKAGE || '@playwright/test');

(async () => {
 const cacheDir = mkdtempSync(join(tmpdir(), 'fipu-dropdowns-'));
 const client = `
 import { createApp, h, ref } from 'vue';
 import { createPinia } from 'pinia';
 import { createRouter, createMemoryHistory } from 'vue-router';
 import { RovingFocusGroup, TooltipProvider } from 'reka-ui';
 import Select from '/src/components/Form/FormControlListbox.vue';
 import Combo from '/src/components/Form/FormCombobox.vue';
 import ButtonMenu from '/src/components/Base/ButtonMenu.vue';
 import Filter from '/src/components/PillTag/PillTagFilter.vue';
 import SearchOptions from '/src/components/SearchOptions.vue';
 import NavItem from '/src/components/Navbar/NavBarItem.vue';
 import { useAdminStore } from '/src/stores/admin_store';
 import '/src/css/main.css';
 const app = createApp({ setup() {
  const choice = ref(''), company = ref(''), action = ref(''), nav = ref('');
  const options = ['', 0, false, { id: 7, label: 'Object option' }, { id: 8, label: 'Disabled option', disabled: true }];
  const admin = useAdminStore(); admin.selectedEvents = ['first'];
  return () => h(TooltipProvider, {}, () => h('main', { style: 'padding:24px;display:grid;grid-template-columns:minmax(0,1fr);gap:20px;max-width:500px;overflow-wrap:anywhere' }, [
   h('div', { id: 'filter-layout', class: 'table-filter-bar' }, ['Svi modeli', 'Aktivne instance', 'Relativno vrijeme'].map(label => h(Select, { options: [label], modelValue: label, buttonClass: 'table-filter-select' }))),
   h('form', { id: 'test-form' }, [h(Select, { id: 'choice', name: 'choice', options, modelValue: choice.value, 'onUpdate:modelValue': v => choice.value = v, 'aria-label': 'Choice' })]),
   h('output', { id: 'choice-value' }, JSON.stringify(choice.value)),
   h(Select, { options, modelValue: '', disabled: true, 'aria-label': 'Disabled' }),
   h(Select, { options, modelValue: '', readonly: true, 'aria-label': 'Readonly' }),
   h(Combo, { list: [{label:'Alpha company',id:1},{label:'Beta company',id:2},{label:'Unavailable company',id:3,unavailable:true}], labelName:'label', emitName:'id', modelValue:company.value, 'onUpdate:modelValue':v=>company.value=v }),
   h('output', {id:'company-value'}, JSON.stringify(company.value)),
   h(ButtonMenu, { label:'Actions', options:[[{id:'run',label:'Run'},{id:'blocked',label:'Blocked',disabled:true}]], 'onUpdate:modelValue':v=>action.value=v.id }),
   h('output', {id:'action-value'}, action.value),
   h(Filter, {trend:'Events',trendType:'filter',options:[[{id:'first',label:'First event'},{id:'second',label:'Second event'},{id:'disabled',label:'Disabled event',disabled:true}]]}),
   h('output', {id:'events-value'}, JSON.stringify(admin.selectedEvents)),
   h(RovingFocusGroup, {}, () => h(NavItem, {item:{label:'Navigation',menu:[{label:'Profile',to:'/profile'},{label:'Sign out',isLogout:true}]},'onMenu-click':(event,item)=>nav.value=item.label})),
   h('output',{id:'nav-value'},nav.value),
   h(SearchOptions),
  ]));
 }});
 app.use(createPinia()).use(createRouter({history:createMemoryHistory(),routes:[{path:'/:pathMatch(.*)*',component:{render:()=>null}}]})).mount('#app');`;
 const server = await createServer({ cacheDir, server: { host:'127.0.0.1',port:0 }, plugins:[{
  name:'dropdown-test', resolveId(id){if(id==='/__dropdowns.js')return id;},load(id){if(id==='/__dropdowns.js')return client;},
  configureServer(server){server.middlewares.use((req,res,next)=>{if(req.url==='/__dropdowns'){res.setHeader('Content-Type','text/html');res.end('<meta name="viewport" content="width=device-width, initial-scale=1"><div id="app"></div><script type="module" src="/__dropdowns.js"></script>');}else next();});},
 }] });
 let browser;
 try {
  await server.listen(); browser=await chromium.launch(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH}:{});
  const page=await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.route(/^https:\/\//,route=>route.fulfill({json:{data:{results:[]}}}));
  await page.goto('http://127.0.0.1:'+server.httpServer.address().port+'/__dropdowns');
  const filterBoxes = await page.locator('#filter-layout [data-slot=select-trigger]').evaluateAll(elements => elements.map(el => ({top:el.getBoundingClientRect().top,width:el.getBoundingClientRect().width})));
  assert.ok(filterBoxes.every(box => box.top === filterBoxes[0].top && box.width < 200), 'Filters stay compact and side by side');
  const select=page.getByRole('combobox',{name:'Choice',exact:true});
  await expect(select).toHaveAttribute('data-slot','select-trigger');
  await expect(page.getByRole('combobox',{name:'Disabled',exact:true})).toBeDisabled();
  await expect(page.getByRole('combobox',{name:'Readonly',exact:true})).toBeDisabled();
  for(const [label,value] of [['0','0'],['false','false'],['Object option','{"id":7,"label":"Object option"}']]) {
   await select.click(); await expect(page.getByRole('option',{name:'Disabled option',exact:true})).toHaveAttribute('data-disabled','');
   await page.getByRole('option',{name:label,exact:true}).click(); await expect(page.locator('#choice-value')).toHaveText(value);
  }
  await select.focus(); await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', {name:'Object option', exact:true})).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('option').first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#choice-value')).toHaveText('""');
  assert.equal(await page.locator('#test-form').evaluate(el=>new FormData(el).get('choice')), '');
  const company=page.getByRole('combobox',{name:'Odaberi opciju'});
  await company.fill('beta'); await page.getByRole('option',{name:'Beta company'}).click(); await expect(page.locator('#company-value')).toHaveText('2');
  await expect(company).toHaveValue('Beta company');
  await company.fill('no match'); await expect(page.getByText('Nema rezultata.',{exact:true})).toBeVisible();
  await company.fill(''); await page.keyboard.press('Escape'); await expect(page.locator('#company-value')).toHaveText('2'); await expect(company).toHaveValue('Beta company');
  await page.getByRole('button',{name:'Actions',exact:true}).click();
  await expect(page.getByRole('menuitem',{name:'Blocked'})).toHaveAttribute('data-disabled','');
  await page.getByRole('menuitem',{name:'Run',exact:true}).click(); await expect(page.locator('#action-value')).toHaveText('run');
  await expect(page.getByRole('menu')).toHaveCount(0);
  const events=page.getByRole('button',{name:'Events',exact:true}); await events.click();
  await expect(page.getByRole('menuitemcheckbox',{name:'First event'})).toBeChecked();
  await page.getByRole('menuitemcheckbox',{name:'Second event'}).click(); await expect(page.locator('#events-value')).toHaveText('["first","second"]');
  await expect(page.getByRole('menu')).toBeVisible(); await page.getByRole('menuitemcheckbox',{name:'First event'}).click();
  await expect(page.getByRole('menuitemcheckbox',{name:'First event'})).not.toBeChecked();
  await page.getByRole('menuitem',{name:'Resetiraj'}).click(); await expect(page.locator('#events-value')).not.toHaveText('["second"]');
  await page.keyboard.press('Escape'); await expect(events).toBeFocused();
  await page.getByRole('button',{name:'Navigation',exact:true}).click(); await page.getByRole('menuitem',{name:'Sign out'}).click(); await expect(page.locator('#nav-value')).toHaveText('Sign out');
  await expect(page.getByRole('button',{name:'Navigation',exact:true})).toBeFocused();
  await page.keyboard.press('Control+k');
  const search=page.getByRole('combobox',{name:'Pretraživanje',exact:true}); await expect(search).toBeFocused();
  await page.getByRole('option',{name:'Student po imenu'}).click(); await expect(search).toHaveValue('student:'); await expect(search).toBeFocused();
  await page.keyboard.press('Backspace'); await expect(search).toHaveValue(''); await page.keyboard.press('Escape');
  await page.setViewportSize({width:390,height:844}); await events.click();
  const panel=page.locator('[data-slot="dropdown-menu-content"]'); const light=await panel.evaluate(el=>getComputedStyle(el).backgroundColor);
  const box=await panel.boundingBox(); assert.ok(box.x>=0 && box.x+box.width<=390,'Menu fits mobile viewport');
  await page.evaluate(()=>document.documentElement.classList.add('dark')); await expect.poll(()=>panel.evaluate(el=>getComputedStyle(el).backgroundColor)).not.toBe(light);
  await expect(panel).toHaveCSS('opacity','1');
  if(process.env.SCREENSHOT_PATH) await page.screenshot({path:process.env.SCREENSHOT_PATH,fullPage:true});
  assert.deepEqual(errors,[]); console.log('Dropdowns passed: original value types, disabled/readonly, keyboard, form value, combobox filtering/clear, actions, event toggle/reset, navigation, mobile and dark mode.');
 } finally {await browser?.close();await server.close();rmSync(cacheDir,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
