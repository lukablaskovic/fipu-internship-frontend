const { test, expect } = require('@playwright/test');
const { mockStores } = require('./mock-stores.cjs');

for (const [action, outcome] of [['accept', true], ['decline', true], ['accept', false]]) {
	test(`assignment ${action} waits for ${outcome ? 'success' : 'failure'} without reloading`, async ({ page }) => {
		const errors = [];
		page.on('pageerror', (error) => errors.push(error.message));
		await mockStores(page, {
			contentType: 'application/javascript',
			body: `
				import { reactive } from '/node_modules/.vite/deps/vue.js';
				let saved = false;
				window.messages = []; window.refreshes = 0;
				export const mainStore = reactive({
					checkedAssignments: [], resetAssignments() {},
					async fetchAvailableAssignments() {
						window.refreshes++;
						return saved ? [] : [{ id_zadatak: 'Test task', dostupno_mjesta: 1, voditelj_odobrio: { value: 'u razradi' } }];
					},
				});
				export const adminStore = reactive({
					async handleTask(id, action) {
						window.mutation = { id, action };
						const result = await new Promise((resolve) => { window.finishUpdate = resolve; });
						saved = !!result;
						return result;
					},
				});
				export const snackBarStore = { pushMessage(text, type) { window.messages.push({ text, type }); } };
				export const studentStore = {}, layoutStore = {}, styleStore = {};
			`,
		});
		await page.goto('/tests/empty-tables.html?table=TableAssignments');
		const row = page.getByRole('row').filter({ has: page.getByRole('cell', { name: 'Test task', exact: true }) });
		await expect(row).toBeVisible();
		let navigations = 0;
		page.on('framenavigated', (frame) => { if (frame === page.mainFrame()) navigations++; });
		await row.getByRole('button').nth(action === 'accept' ? 1 : 2).click();
		await page.getByRole('dialog', { name: 'Potvrda akcije' }).getByRole('button', { name: action === 'accept' ? 'Prihvati' : 'Odbij', exact: true }).click();
		await expect.poll(() => page.evaluate(() => typeof window.finishUpdate)).toBe('function');
		expect(await page.evaluate(() => window.messages.some((message) => message.type === 'success'))).toBe(false);
		expect(await page.evaluate(() => window.refreshes)).toBe(1);
		expect(await page.evaluate(() => window.mutation.action)).toBe(action === 'accept' ? 'odobreno' : 'odbijeno');
		await page.evaluate((success) => window.finishUpdate(success ? { status: 'OK' } : null), outcome);
		await expect.poll(() => page.evaluate(() => window.messages.at(-1).type)).toBe(outcome ? 'success' : 'danger');
		if (outcome) {
			await expect(row).toHaveCount(0);
			await expect(page.getByText('Nema podataka...', { exact: true })).toBeVisible();
			expect(await page.evaluate(() => window.refreshes)).toBe(2);
		} else {
			await expect(row).toBeVisible();
			expect(await page.evaluate(() => window.refreshes)).toBe(1);
		}
		expect(navigations).toBe(0);
		expect(errors).toEqual([]);
	});
}
