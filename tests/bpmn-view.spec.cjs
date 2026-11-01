const { test, expect } = require("@playwright/test");
const { mockStores } = require("./mock-stores.cjs");

async function openView(page, direct = false, filtering = false, query = "") {
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "warning" && /Dialog|focus/i.test(message.text())) errors.push(message.text());
	});
	await page.route("**/src/layouts/LayoutAuthenticated.vue", (route) => route.fulfill({
		contentType: "application/javascript",
		body: "import { h } from '/node_modules/.vite/deps/vue.js'; export default { setup(_, { slots }) { return () => h('main', slots.default()); } };",
	}));
	await mockStores(page, {
		contentType: "application/javascript",
		body: `
			import { reactive } from '/node_modules/.vite/deps/vue.js';
			const instance = { id: 'demo', pending: ['ispunjavanje_prijavnice_student'], state: 'running', model: { model_path: 'strucna_praksa_A.bpmn' }, variables: {}, pending_task_info: {} };
			const student = { process_instance_id: 'demo', ime: 'Ana', prezime: 'Demo', email: 'ana@example.test', JMBAG: '001', godina_studija: { value: '3' }, Model_prakse: { value: 'A' }, process_instance_data: instance };
			const students = ${filtering} ? [
				...Array.from({ length: 12 }, (_, index) => ({ ...student, process_instance_id: 'a' + index, ime: 'Ana', prezime: 'Student ' + index, JMBAG: '00' + index })),
				{ ...student, process_instance_id: 'b', ime: 'Željko', prezime: 'Horvat', email: 'zeljko@example.test', JMBAG: '099', Model_prakse: { value: 'B' }, process_instance_data: { ...instance, pending: ['model_b_odobrenje_zadatka'] } },
				{ ...student, process_instance_id: 'done', ime: 'Iva', prezime: 'Gotova', process_instance_data: { ...instance, pending: [], state: 'finished' } },
			] : [student];
			export const mainStore = reactive({ userAdmin: true, userAuthenticated: true, table_items_per_page: 10 });
			export const adminStore = reactive({
				students: [], studentsFetched: false, filterModelState: 'AB', filterFinishedInstances: false, filterInternshipStage: 'all', selectedStudent: null, bpmn_diagram: { clicked_task_id: '' },
				setSelectedStudent(student) { this.selectedStudent = student; },
				async getStudents() { await new Promise(resolve => setTimeout(resolve, 30)); this.students = students; this.studentsFetched = true; },
				async getProcessInstanceData() { return instance; },
			});
			export const snackBarStore = { pushMessage() {} };
			export const studentStore = {};
			export const styleStore = {};
			export const layoutStore = {};
		`,
	});
	await page.goto(`/tests/bpmn-view.html${direct ? '?direct' : query}`);
	return errors;
}

for (const width of [1280, 390]) {
	test(`BPMN dialog locks scrolling and preserves task dialogs at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		const errors = await openView(page);
		const trigger = page.getByRole("button", { name: "Otvori BPMN prikaz: Ana Demo", exact: true });
		const viewer = page.getByRole("dialog", { name: "BPMN dijagram", exact: true });
		await expect(page.locator(".fipu-bpmn-canvas")).toHaveCount(0);
		await trigger.click();
		await expect(viewer).toBeVisible();
		await expect(viewer.getByText("Ana Demo", { exact: true })).toBeVisible();
		const canvas = viewer.locator(".fipu-bpmn-canvas");
		await expect(canvas).toBeVisible();
		await page.screenshot({ path: `/tmp/fipu-bpmn-${width}.png`, animations: "disabled" });
		await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
		expect(await viewer.evaluate((el) => ({ horizontal: el.scrollWidth > el.clientWidth, vertical: el.scrollHeight > el.clientHeight }))).toEqual({ horizontal: false, vertical: false });
		const viewBox = await canvas.getAttribute("viewBox");
		const controls = viewer.getByRole("toolbar", { name: "Prikaz dijagrama" });
		await expect(controls).toBeVisible();
		await controls.getByRole("button", { name: "Umanji", exact: true }).click();
		await expect(canvas).not.toHaveAttribute("viewBox", viewBox);
		expect(Number((await canvas.getAttribute("viewBox")).split(" ")[2])).toBeGreaterThan(Number(viewBox.split(" ")[2]));
		await controls.getByRole("button", { name: "Prikaži cijeli model", exact: true }).click();
		await expect(canvas).toHaveAttribute("viewBox", viewBox);
		await page.keyboard.press("ArrowRight");
		await expect(controls.getByRole("button", { name: "Uvećaj", exact: true })).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(canvas).not.toHaveAttribute("viewBox", viewBox);
		expect(Number((await canvas.getAttribute("viewBox")).split(" ")[2])).toBeLessThan(Number(viewBox.split(" ")[2]));
		await controls.getByRole("button", { name: "Prikaži cijeli model", exact: true }).click();
		await expect(canvas).toHaveAttribute("viewBox", viewBox);
		await expect(canvas).not.toHaveAttribute("aria-label", /Povucite/);
		const box = await canvas.boundingBox();
		for (const y of [box.y + 10, box.y + box.height / 2]) {
			await page.mouse.move(box.x + 10, y);
			await page.mouse.down();
			await page.mouse.move(box.x + 90, y + 40, { steps: 5 });
			await page.mouse.up();
			await expect(canvas).toHaveAttribute("viewBox", viewBox);
		}
		const scrollY = await page.evaluate(() => window.scrollY);
		await canvas.hover();
		await page.mouse.wheel(100, 300);
		await expect(canvas).toHaveAttribute("viewBox", viewBox);
		expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
		await page.keyboard.down("Control");
		await page.mouse.wheel(0, -200);
		await page.keyboard.up("Control");
		await expect(canvas).not.toHaveAttribute("viewBox", viewBox);
		const current = viewer.getByRole("button", { name: "userTask: Ispunjavanje prijavnice", exact: true });
		await current.focus();
		await page.keyboard.press("Enter");
		const taskDialog = page.getByRole("dialog", { name: "Ispunjena prijavnica", exact: true });
		await expect(taskDialog).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(taskDialog).toHaveCount(0);
		await expect(viewer).toBeVisible();
		await expect(current).toBeFocused();
		for (const [nodeName, title] of [
			["userTask: Odabir preferencija za praksu", "Prijavljene preferencije"],
			["sendTask: Obavještavanje studenta o prihvaćanju (email)", "Ponovno slanje emaila"],
		]) {
			const node = viewer.getByRole("button", { name: nodeName, exact: true });
			await node.focus();
			await page.keyboard.press("Enter");
			const details = page.getByRole("dialog", { name: title, exact: true });
			await expect(details).toBeVisible();
			await page.keyboard.press("Escape");
			await expect(details).toHaveCount(0);
			await expect(node).toBeFocused();
			await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
		}
		await page.keyboard.press("Escape");
		await expect(viewer).toHaveCount(0);
		await expect(trigger).toBeFocused();
		await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
		await trigger.click();
		await viewer.getByRole("button", { name: "Zatvori BPMN prikaz" }).click();
		await expect(viewer).toHaveCount(0);
		await expect(trigger).toBeFocused();
		expect(errors).toEqual([]);
	});
}

test("direct student link opens the BPMN dialog after students load", async ({ page }) => {
	const errors = await openView(page, true);
	await expect(page.getByRole("dialog", { name: "BPMN dijagram", exact: true })).toBeVisible();
	await expect(page.locator(".fipu-bpmn-canvas")).toBeVisible();
	expect(errors).toEqual([]);
});

for (const width of [1280, 390]) {
	test(`student search and dropdown filters compose at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		const errors = await openView(page, false, true);
		const count = page.getByRole("status").filter({ hasText: /studenata/ });
		const search = page.getByRole("searchbox", { name: "Pretraži studente" });
		const select = async (label, option) => {
			await page.getByRole("combobox", { name: label, exact: true }).click();
			await page.getByRole("option", { name: option, exact: true }).click();
		};
		await expect(count).toHaveText("13 studenata");
		await page.getByRole("button", { name: "Sljedeća stranica", exact: true }).click();
		await search.fill(" ŽELJKO HORVAT ");
		await expect(count).toHaveText("1 studenata");
		await expect(page.getByText("Stranica 1 od 1", { exact: true })).toBeVisible();
		for (const term of ["099", "ZELJKO@EXAMPLE.TEST"]) {
			await search.fill(term);
			await expect(page.locator("tbody tr")).toHaveCount(1);
			await expect(page.locator("tbody tr")).toContainText("Horvat");
		}
		await select("Model prakse", "Model A");
		await expect(count).toHaveText("0 studenata");
		await expect(page.getByText("Nema podataka...", { exact: true })).toBeVisible();
		await expect(page.getByRole("navigation")).toHaveCount(0);
		await select("Model prakse", "Model B");
		await select("Faza procesa", "Čeka odobrenje (B)");
		await expect(count).toHaveText("1 studenata");
		await search.fill("");
		await select("Faza procesa", "Čeka alokaciju (A)");
		await expect(count).toHaveText("0 studenata");
		await select("Faza procesa", "Sve faze procesa");
		await select("Model prakse", "Svi modeli");
		await select("Status instance", "Sve instance");
		await expect(count).toHaveText("14 studenata");
		await search.fill("Iva Gotova");
		await expect(page.locator("tbody tr")).toContainText("Gotova");
		await select("Status instance", "Aktivne instance");
		await expect(count).toHaveText("0 studenata");
		await search.fill("");
		await expect(count).toHaveText("13 studenata");
		await page.screenshot({ path: `/tmp/fipu-students-${width}.png`, animations: "disabled", fullPage: true });
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
		expect(errors).toEqual([]);
	});
}

test("student filters honour dashboard query links", async ({ page }) => {
	const errors = await openView(page, false, true, "?model=B&stage=ceka_odobrenje");
	await expect(page.getByRole("combobox", { name: "Model prakse", exact: true })).toContainText("Model B");
	await expect(page.getByRole("combobox", { name: "Faza procesa", exact: true })).toContainText("Čeka odobrenje (B)");
	await expect(page.locator("tbody tr")).toHaveCount(1);
	await expect(page.locator("tbody tr")).toContainText("Horvat");
	expect(errors).toEqual([]);
});
