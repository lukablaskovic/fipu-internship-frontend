const { test, expect } = require('@playwright/test');
const { mockStores } = require('./mock-stores.cjs');

async function openAssignments(page, fail = false) {
	const errors = [];
	page.on('pageerror', error => errors.push(error.message));
	await page.route('**/src/layouts/LayoutAuthenticated.vue', route => route.fulfill({
		contentType: 'application/javascript',
		body: "import { h } from '/node_modules/.vite/deps/vue.js'; export default { setup(_, { slots }) { return () => h('main', slots.default()); } };",
	}));
	await mockStores(page, {
		contentType: 'application/javascript',
		body: `
			import { reactive } from '/node_modules/.vite/deps/vue.js';
			window.fetches = 0;
			window.failAssignments = ${fail};
			const assignments = Array.from({ length: 24 }, (_, index) => ({
				id_zadatak: 'Zadatak ' + (index + 1), poslodavac_email: 'demo@example.test',
				Poslodavac: [{ id: 1, value: 'Demo poduzeće' }],
				preferirane_tehnologije: index % 2 ? 'Python' : 'Vue', trajanje_sati: 160,
				lokacija: index % 2 ? 'Zagreb' : 'Pula', broj_studenata: 3,
				dostupno_mjesta: index % 2 ? 0 : 3,
				voditelj_odobrio: { value: ['u razradi', 'odobreno', 'odbijeno'][index % 3] },
			}));
			export const mainStore = reactive({ userAuthenticated: true, userAdmin: true,
				async fetchAvailableAssignments() { window.fetches++; return window.failAssignments ? undefined : structuredClone(assignments); },
			});
			export const adminStore = reactive({ async handleTask(id, value) {
				assignments.find(task => task.id_zadatak === id).voditelj_odobrio.value = value;
				return { status: 'OK' };
			} });
			export const snackBarStore = { pushMessage() {} }, studentStore = {}, layoutStore = {}, styleStore = {};
		`,
	});
	await page.goto('/tests/empty-tables.html?table=AvailableAssignments');
	return errors;
}

async function select(page, name, option) {
	await page.getByRole('combobox', { name, exact: true }).click();
	await page.getByRole('option', { name: option, exact: true }).click();
}

test('one task table combines statuses, search, filters, sorting and pagination', async ({ page }) => {
	const errors = await openAssignments(page);
	await expect(page.getByRole('table')).toHaveCount(1);
	await expect(page.locator('tbody tr')).toHaveCount(10);
	await expect(page.getByText('24 od 24 zadataka · Stranica 1 od 3')).toBeVisible();
	for (const status of ['Neodobren', 'Odobren', 'Odbijen']) await expect(page.getByText(status, { exact: true }).first()).toBeVisible();
	await page.getByRole('button', { name: 'Stranica 3', exact: true }).click();
	await expect(page.locator('tbody tr')).toHaveCount(4);
	await select(page, 'Status zadatka', 'Odobreni');
	await expect(page.locator('tbody tr')).toHaveCount(8);
	await expect(page.getByText('8 od 24 zadataka · Stranica 1 od 1')).toBeVisible();
	await select(page, 'Dostupnost mjesta', 'Slobodna mjesta');
	await expect(page.locator('tbody tr')).toHaveCount(4);
	await page.getByRole('searchbox', { name: 'Pretraži zadatke' }).fill(' PULA ');
	await expect(page.locator('tbody tr')).toHaveCount(4);
	await page.getByRole('searchbox').fill('Python');
	await expect(page.getByText('Nema podataka...', { exact: true })).toBeVisible();
	await expect(page.getByRole('navigation')).toHaveCount(0);
	await select(page, 'Dostupnost mjesta', 'Popunjeni zadaci');
	await expect(page.locator('tbody tr')).toHaveCount(4);
	await page.getByRole('searchbox').fill('DEMO@EXAMPLE.TEST');
	await expect(page.locator('tbody tr')).toHaveCount(4);
	await page.getByRole('searchbox').fill('demo poduzeće');
	await expect(page.locator('tbody tr')).toHaveCount(4);
	await page.getByRole('searchbox').fill('');
	await select(page, 'Status zadatka', 'Svi statusi');
	await select(page, 'Dostupnost mjesta', 'Sva mjesta');
	await page.getByRole('columnheader', { name: 'ID Zadatka', exact: true }).getByRole('button').click();
	await expect(page.getByRole('columnheader', { name: 'ID Zadatka', exact: true })).toHaveAttribute('aria-sort', 'descending');
	await expect(page.locator('tbody tr').first()).toContainText('Zadatak 24');
	await page.getByRole('button', { name: 'Otvori izbornik', exact: true }).click();
	await page.getByRole('menuitem', { name: '30 stavki po stranici', exact: true }).click();
	await expect(page.locator('tbody tr')).toHaveCount(24);
	expect(await page.evaluate(() => window.fetches)).toBe(1);
	expect(errors).toEqual([]);
});

test('approval moves a pending task into the approved filter without reloading', async ({ page }) => {
	const errors = await openAssignments(page);
	await select(page, 'Status zadatka', 'Neodobreni');
	await page.getByRole('button', { name: 'Prihvati zadatak Zadatak 1', exact: true }).click();
	await page.getByRole('dialog').getByRole('button', { name: 'Prihvati', exact: true }).click();
	await expect(page.locator('tbody tr')).toHaveCount(7);
	await select(page, 'Status zadatka', 'Odobreni');
	const row = page.getByRole('row').filter({ has: page.getByRole('cell', { name: 'Zadatak 1', exact: true }) });
	await expect(row).toContainText('Odobren');
	await expect(row.getByRole('button')).toHaveCount(1);
	expect(await page.evaluate(() => window.fetches)).toBe(2);
	expect(errors).toEqual([]);
});

test('failed task loading offers a working retry', async ({ page }) => {
	const errors = await openAssignments(page, true);
	await expect(page.getByRole('alert')).toContainText('Zadatke nije moguće učitati');
	await page.evaluate(() => { window.failAssignments = false; });
	await page.getByRole('button', { name: 'Pokušaj ponovno' }).click();
	await expect(page.getByRole('table')).toBeVisible();
	expect(errors).toEqual([]);
});

for (const width of [1440, 390]) {
	test(`task controls and rows fit at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		const errors = await openAssignments(page);
		await expect(page.getByRole('table')).toBeVisible();
		for (const dark of [false, true]) {
			await page.evaluate(enabled => document.documentElement.classList.toggle('dark', enabled), dark);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
			await page.screenshot({ path: `/tmp/assignments-${width}-${dark ? 'dark' : 'light'}.png` });
		}
		expect(errors).toEqual([]);
	});
}

test('old task URLs redirect to protected new routes and keep deep links', async ({ page }) => {
	await openAssignments(page);
	const routes = await page.evaluate(async () => {
		const { routes } = await import('/src/router/routes.js');
		const { createRouter, createMemoryHistory } = await import('/node_modules/.vite/deps/vue-router.js');
		const router = createRouter({ history: createMemoryHistory(), routes: routes.map(route => ({ ...route, component: {} })) });
		const resolved = [];
		for (const path of ['/dostupni-zadaci', '/dostupni-zadaci/Zadatak%2024?source=search#task']) {
			await router.push(path);
			const { fullPath, meta } = router.currentRoute.value;
			resolved.push({ fullPath, meta });
		}
		return resolved;
	});
	expect(routes.map(route => route.fullPath)).toEqual(['/zadaci', '/zadaci/Zadatak%2024?source=search#task']);
	for (const route of routes) expect(route.meta).toMatchObject({ requiresAuth: true, requiresAdmin: true });
});
