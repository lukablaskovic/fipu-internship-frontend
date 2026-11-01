const { test, expect } = require("@playwright/test");

async function openView(page, direct = false) {
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "warning" && /Dialog|focus/i.test(message.text())) errors.push(message.text());
	});
	await page.route("**/src/layouts/LayoutAuthenticated.vue", (route) => route.fulfill({
		contentType: "application/javascript",
		body: "import { h } from '/node_modules/.vite/deps/vue.js'; export default { setup(_, { slots }) { return () => h('main', slots.default()); } };",
	}));
	await page.route("**/src/main.js", (route) => route.fulfill({
		contentType: "application/javascript",
		body: `
			import { reactive } from '/node_modules/.vite/deps/vue.js';
			const instance = { id: 'demo', pending: ['ispunjavanje_prijavnice_student'], state: 'running', model: { model_path: 'strucna_praksa_A.bpmn' }, variables: {}, pending_task_info: {} };
			const student = { process_instance_id: 'demo', ime: 'Ana', prezime: 'Demo', email: 'ana@example.test', JMBAG: '001', godina_studija: { value: '3' }, Model_prakse: { value: 'A' }, process_instance_data: instance };
			export const mainStore = reactive({ userAdmin: true, userAuthenticated: true, table_items_per_page: 10 });
			export const adminStore = reactive({
				students: [], studentsFetched: false, filterModelState: 'AB', filterFinishedInstances: false, filterInternshipStage: 'all', selectedStudent: null, bpmn_diagram: { clicked_task_id: '' },
				setSelectedStudent(student) { this.selectedStudent = student; },
				async getStudents() { await new Promise(resolve => setTimeout(resolve, 30)); this.students = [student]; this.studentsFetched = true; },
				async getProcessInstanceData() { return instance; },
			});
			export const snackBarStore = { pushMessage() {} };
			export const studentStore = {};
			export const styleStore = {};
			export const layoutStore = {};
		`,
	}));
	await page.goto(`/tests/bpmn-view.html${direct ? '?direct' : ''}`);
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
