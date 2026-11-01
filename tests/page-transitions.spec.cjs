const { test, expect } = require("@playwright/test");

for (const reducedMotion of ["no-preference", "reduce"]) {
	test(`page navigation respects ${reducedMotion} motion preference`, async ({ page }) => {
		const errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		page.on("console", (message) => {
			if (message.type() === "warning" && message.text().includes("Transition")) errors.push(message.text());
		});
		await page.emulateMedia({ reducedMotion });
		await page.addInitScript(() => sessionStorage.setItem("dev-data-mode", "local"));
		await page.route("http://localhost:8082/api/**", (route) => route.fulfill({ json: { data: { results: [] } } }));
		await page.route("http://localhost:8082/api/Zadaci_za_odabir", (route) => route.fulfill({ json: { data: { results: [{ id_zadatak: "Demo zadatak", dostupno_mjesta: 1, voditelj_odobrio: { value: "odobreno" } }] } } }));
		await page.goto("/moja-praksa");
		await expect(page.getByRole("heading", { name: "Dostupni zadaci", exact: true })).toBeVisible();
		await expect(page.getByText("Učitavanje...", { exact: true })).toHaveCount(0);
		await expect(page.locator(".page-fade-enter-active")).toHaveCount(0);
		await page.evaluate(() => {
			window.pageTransitions = [];
			document.addEventListener("transitionrun", (event) => {
				if (event.target.matches(".page-fade-enter-active, .page-fade-leave-active")) {
					window.pageTransitions.push({ property: event.propertyName, duration: getComputedStyle(event.target).transitionDuration });
				}
			}, true);
		});
		await page.getByRole("link", { name: "Upute", exact: true }).first().click();
		await expect(page).toHaveURL(/\/upute$/);
		await expect(page.getByText("O praksi", { exact: true })).toBeVisible();
		await expect(page.locator(".page-fade-enter-active, .page-fade-leave-active")).toHaveCount(0);
		expect(await page.evaluate(() => window.pageTransitions)).toEqual(reducedMotion === "reduce" ? [] : [
			{ property: "opacity", duration: "0.09s" },
			{ property: "opacity", duration: "0.16s" },
		]);
		await page.goBack();
		await expect(page.getByRole("heading", { name: "Dostupni zadaci", exact: true })).toBeVisible();
		expect(errors).toEqual([]);
	});
}
