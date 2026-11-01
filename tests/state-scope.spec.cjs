const { test, expect } = require("@playwright/test");
const { mockStores } = require("./mock-stores.cjs");

test("assignment selections stay with their parent and BPMN data stays with its instance", async ({ page }) => {
	const errors = [];
	page.on("pageerror", error => errors.push(error.message));
	await mockStores(page, { contentType: "application/javascript", body: `
		export const mainStore = { allCompanies: [], fetchCompanies: async () => [], fetchAvailableAssignments: async () =>
			[1,2,3,4].map(id => ({ id_zadatak: id, preferirane_tehnologije: 'Vue', poslodavac_email: 'demo@example.test', dostupno_mjesta: 1, voditelj_odobrio: { value: 'odobreno' } })) };
	` });
	await page.goto("/tests/state-scope.html");
	const first = page.getByRole("region", { name: "First table", exact: true });
	const second = page.getByRole("region", { name: "Second table", exact: true });
	await first.getByRole("checkbox").first().click();
	await expect(page.getByRole("status", { name: "First selection" })).toHaveText("1");
	await expect(page.getByRole("status", { name: "Second selection" })).toBeEmpty();
	await expect(second.getByRole("checkbox").first()).not.toBeChecked();
	await second.getByRole("checkbox").nth(1).click();
	await expect(page.getByRole("status", { name: "Second selection" })).toHaveText("2");
	await page.getByRole("button", { name: "Toggle tables" }).click();
	await page.getByRole("button", { name: "Toggle tables" }).click();
	await expect(first.getByRole("checkbox").first()).toBeChecked();
	await expect(second.getByRole("checkbox").nth(1)).toBeChecked();
	await expect(page.getByRole("region", { name: "First process", exact: true })).toContainText("First task");
	await expect(page.getByRole("region", { name: "Second process", exact: true })).toContainText("Second process");
	await page.getByRole("button", { name: "Update process" }).click();
	await expect(page.getByRole("region", { name: "First process", exact: true })).toContainText("Updated task");
	await expect(page.getByRole("region", { name: "Second process", exact: true })).toContainText("Second process");
	expect(errors).toEqual([]);
});
