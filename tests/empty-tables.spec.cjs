const { test, expect } = require('@playwright/test');
const { mockStores } = require('./mock-stores.cjs');

async function openTable(page, table, populated = false) {
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
			const populated = ${populated};
			const assignment = { id_zadatak: 1, poslodavac_email: 'demo@example.test', preferirane_tehnologije: 'Vue', trajanje_sati: 160, lokacija: 'Pula', broj_studenata: 3, dostupno_mjesta: 3, voditelj_odobrio: { value: 'odobreno' } };
			export const mainStore = reactive({
				userAdmin: true, userAuthenticated: true, checkedAssignments: [], clients: [], allCompanies: [],
				fetchCompanies: async () => populated ? [{ id: 1, naziv: 'Demo', web: 'https://example.test', OIB: '123', maticni_broj: '456', adresa: 'Pula', logo: [] }] : [],
				fetchAvailableAssignments: async () => populated ? [assignment] : [], resetAssignments() {},
				bpmn_process_name_A: 'A', bpmn_process_name_B: 'B',
			});
			export const adminStore = reactive({
				students: [], studentsFetched: true, filterModelState: 'AB', filterActiveInstances: true, selectedEvents: null,
				availableAssignmentsFilter: true, bpmn_diagram: { clicked_task_id: '' },
				selectedStudent: { process_instance_data: { variables: { id_preferencije: 1 } } },
				setSelectedStudent(student) { this.selectedStudent = student; },
				getPreferencesDetailed: async () => ({ data: { Prvi_odabir: [], Drugi_odabir: populated ? [{ details: assignment }] : [], Treci_odabir: [] } }),
				getStudents: async () => {}, searchModels: async () => {}, dashboard_data: {},
				getEvents: async () => populated ? [
					{ instance_id: 1, student_ime: 'Željko', student_JMBAG: '002', student_email: 'a@example.test', model_name: 'strucna_praksa_A.bpmn', activity_id: 'start_event_student', timestamp: '2026-01-01T12:00:00Z' },
					{ instance_id: 2, student_ime: 'Ana', student_JMBAG: '001', student_email: 'z@example.test', model_name: 'strucna_praksa_B.bpmn', activity_id: 'end_event_student', timestamp: '2026-02-01T12:00:00Z' },
				] : [],
			});
			export const studentStore = { getAllocationsPublic: async () => [] };
			export const snackBarStore = { pushMessage() {} };
			export const styleStore = {};
			export const layoutStore = {};
		`,
	});
	await page.goto(`/tests/empty-tables.html?table=${table}`);
	return errors;
}

for (const table of ['TableCompanies', 'TableNewCompanies', 'TableAvailableAssignments', 'TableAssignments', 'TableStudents', 'TableAllocations', 'TableSampleClients', 'TableStudentPreferences', 'TableInstanceData', 'DashboardView']) {
	test(`${table} shows the shared empty state without pagination`, async ({ page }) => {
		const errors = await openTable(page, table);
		if (table === 'DashboardView') await page.getByRole('tab', { name: 'Tablica', exact: true }).click();
		await expect(page.getByText('Nema podataka...', { exact: true })).toHaveCount(1);
		await expect(page.getByText('Učitavanje...', { exact: true })).toHaveCount(0);
		await expect(page.getByRole('navigation')).toHaveCount(0);
		await expect(page.getByText(/Stranica \d+ od/)).toHaveCount(0);
		await expect(page.getByRole('button', { name: 'Otvori izbornik', exact: true })).toHaveCount(0);
		await expect(page.getByRole('table')).toHaveCount(0);
		expect(errors).toEqual([]);
	});
}

test('dashboard event headers toggle sorting and stay in sync with the dropdown', async ({ page }) => {
	const errors = await openTable(page, 'DashboardView', true);
	await expect(page.getByRole('heading', { name: 'Događaji (logs)', exact: true })).toBeVisible();
	const sort = page.getByRole('combobox', { name: 'Sortiranje događaja', exact: true });
	await expect(sort).toBeVisible();
	await page.getByRole('tab', { name: 'Tablica', exact: true }).click();
	await expect(sort).toHaveCount(0);
	const firstRow = page.locator('tbody tr').first();
	await expect(page.getByRole('columnheader', { name: 'Vrijeme', exact: true })).toHaveAttribute('aria-sort', 'descending');
	await expect(firstRow).toContainText('Ana');
	for (const [label, firstStudent] of [['Student', 'Ana'], ['JMBAG', 'Ana'], ['Email', 'Željko'], ['Model', 'Željko'], ['Događaj', 'Željko'], ['Vrijeme', 'Željko']]) {
		const header = page.getByRole('columnheader', { name: label, exact: true });
		const button = header.getByRole('button', { name: label, exact: true });
		await button.focus();
		await page.keyboard.press('Enter');
		await expect(header).toHaveAttribute('aria-sort', 'ascending');
		await expect(firstRow).toContainText(firstStudent);
		await button.click();
		await expect(header).toHaveAttribute('aria-sort', 'descending');
		await expect(firstRow).toContainText(firstStudent === 'Ana' ? 'Željko' : 'Ana');
	}
	await page.getByRole('tab', { name: 'Popis', exact: true }).click();
	await expect(sort).toBeVisible();
	await expect(sort).toContainText('Najnoviji prvo');
	await sort.click();
	await page.getByRole('option', { name: 'Student ↑', exact: true }).click();
	await page.getByRole('tab', { name: 'Tablica', exact: true }).click();
	await expect(sort).toHaveCount(0);
	await expect(page.getByRole('columnheader', { name: 'Student', exact: true })).toHaveAttribute('aria-sort', 'ascending');
	await expect(firstRow).toContainText('Ana');
	await page.getByRole('searchbox', { name: 'Pretraži događaje' }).fill('Željko');
	await expect(page.locator('tbody tr')).toHaveCount(1);
	expect(errors).toEqual([]);
});

for (const width of [1440, 390]) {
	for (const dark of [false, true]) {
		test(`event multiselect matches adjacent controls and preserves selection at ${width}px (${dark ? 'dark' : 'light'})`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 });
			const errors = await openTable(page, 'DashboardView', true);
			await page.evaluate((enabled) => document.documentElement.classList.toggle('dark', enabled), dark);
			const trigger = page.getByRole('button', { name: 'Događaji', exact: true });
			const neighbor = page.getByRole('combobox', { name: 'Format vremena', exact: true });
			const styles = (element) => {
				const style = getComputedStyle(element);
				return [style.height, style.borderRadius, style.backgroundColor, style.fontSize, style.color];
			};
			expect(await trigger.evaluate(styles)).toEqual(await neighbor.evaluate(styles));
			await trigger.focus();
			await trigger.press('Enter');
			const options = page.getByRole('menuitemcheckbox');
			await expect(options.first()).toHaveText('Pokrenut proces');
			await expect(options.nth(1)).toHaveText('Prijavljene preferencije');
			await expect(options.last()).toHaveText('Student se prijavio');
			const reset = page.getByRole('menuitem', { name: 'Resetiraj', exact: true });
			await expect(reset).toBeVisible();
			const resetPosition = await reset.boundingBox();
			const eventList = page.getByRole('menu').locator('.fipu_vertical_scrollbar');
			await eventList.evaluate((element) => { element.scrollTop = element.scrollHeight; });
			expect((await reset.boundingBox()).y).toBeCloseTo(resetPosition.y, 0);
			await eventList.evaluate((element) => { element.scrollTop = 0; });
			await expect(options.first()).toBeFocused();
			await expect(options.first()).toHaveAttribute('aria-checked', 'true');
			await page.keyboard.press('Space');
			await expect(options.first()).toHaveAttribute('aria-checked', 'false');
			await expect(page.getByRole('menu')).toBeVisible();
			await expect(options.first().locator('[data-state="checked"]')).toHaveCount(0);
			await expect(page.getByText('1 događaja', { exact: true })).toBeVisible();
			await options.nth(1).click();
			await expect(options.nth(1)).toHaveAttribute('aria-checked', 'false');
			await expect(options.first()).toHaveAttribute('aria-checked', 'false');
			await expect(page.getByRole('menu')).toBeVisible();
			await page.getByRole('menuitem', { name: 'Resetiraj', exact: true }).click();
			await expect(options.first()).toHaveAttribute('aria-checked', 'true');
			await expect(options.first().locator('[data-state="checked"]')).toHaveCount(1);
			await expect(options.nth(1)).toHaveAttribute('aria-checked', 'true');
			await expect(page.getByText('2 događaja', { exact: true })).toBeVisible();
			await page.keyboard.press('Escape');
			await expect(trigger).toBeFocused();
			await expect(page.getByRole('menu')).toHaveCount(0);
			await trigger.click();
			await expect(page.getByRole('menu')).toHaveCSS('opacity', '1');
			const bounds = await page.getByRole('menu').boundingBox();
			expect(bounds.x).toBeGreaterThanOrEqual(0);
			expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
			await page.screenshot({ path: `/tmp/event-filter-${width}-${dark ? 'dark' : 'light'}.png` });
			expect(errors).toEqual([]);
		});
	}
}

test('searching to zero rows hides pagination, and clearing search restores it', async ({ page }) => {
	const errors = await openTable(page, 'TableAvailableAssignments', true);
	await expect(page.getByRole('navigation')).toBeVisible();
	await expect(page.getByText('Stranica 1 od 1', { exact: true })).toBeVisible();
	const search = page.getByPlaceholder('Pretraži zadatke...');
	await search.fill('no matching assignment');
	await expect(page.getByText('Nema podataka...', { exact: true })).toBeVisible();
	await expect(page.getByRole('navigation')).toHaveCount(0);
	await expect(page.getByText(/Stranica \d+ od/)).toHaveCount(0);
	await expect(page.getByRole('button', { name: 'Otvori izbornik', exact: true })).toHaveCount(0);
	await search.fill('');
	await expect(page.getByRole('navigation')).toBeVisible();
	await expect(page.getByRole('table')).toContainText('demo@example.test');
	await expect(page.getByText('Nema podataka...', { exact: true })).toHaveCount(0);
	expect(errors).toEqual([]);
});

test('populated company and partial preference tables retain their rows', async ({ page }) => {
	let errors = await openTable(page, 'TableCompanies', true);
	await expect(page.getByRole('table')).toContainText('Demo');
	await expect(page.getByRole('navigation')).toBeVisible();
	await expect(page.getByText('Nema podataka...', { exact: true })).toHaveCount(0);
	expect(errors).toEqual([]);
	errors = await openTable(page, 'TableStudentPreferences', true);
	await expect(page.getByRole('table')).toContainText('demo@example.test');
	await expect(page.getByRole('row')).toHaveCount(2);
	await expect(page.locator('td[data-label="Odabir"]')).toHaveText('2');
	await expect(page.getByText('Nema podataka...', { exact: true })).toHaveCount(0);
	expect(errors).toEqual([]);
});
