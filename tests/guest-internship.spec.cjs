const { test, expect } = require("@playwright/test");

test("guest internship renders and the sidebar expands without console errors", async ({ page }) => {
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (["warning", "error"].includes(message.type())) errors.push(message.text());
	});
	await page.addInitScript(() => sessionStorage.setItem("dev-data-mode", "local"));
	await page.route("http://localhost:8082/api/**", (route) => route.fulfill({ json: { data: { results: [] } } }));
	await page.route("http://localhost:8082/api/Zadaci_za_odabir", (route) => route.fulfill({ json: { data: { results: [{ id_zadatak: "Demo zadatak", dostupno_mjesta: 1, voditelj_odobrio: { value: "odobreno" } }] } } }));
	await page.goto("/moja-praksa");
	await expect(page.getByRole("heading", { name: "Dostupni zadaci", exact: true })).toBeVisible();
	await expect(page.getByText("Učitavanje...", { exact: true })).toHaveCount(0);
	await page.getByRole("button", { name: "Proširi izbornik", exact: true }).press("Enter");
	await expect(page.getByRole("button", { name: "Smanji izbornik", exact: true })).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("button", { name: "Proširi izbornik", exact: true })).toBeVisible();
	expect(errors).toEqual([]);
});
