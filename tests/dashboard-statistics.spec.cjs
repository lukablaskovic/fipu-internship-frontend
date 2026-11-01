const { test, expect } = require("@playwright/test");

for (const width of [1280, 390]) {
	test(`dashboard shows only the selected statistics at ${width}px`, async ({ page }) => {
		const errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		await page.setViewportSize({ width, height: 844 });
		await page.addInitScript(() => {
			sessionStorage.setItem("dev-data-mode", "local");
			sessionStorage.setItem("token", JSON.stringify({ email: "admin@local.test" }));
			sessionStorage.setItem("main", JSON.stringify({ userAuthenticated: true, userAdmin: true, currentUser: { email: "admin@local.test", name: "Demo Admin", internship_process: {} } }));
		});
		await page.route("http://localhost:8082/api/**", (route) => route.fulfill({ json: { data: { results: [] } } }));
		await page.route("http://localhost:8080/**", (route) => route.fulfill({ json: { results: route.request().url().endsWith("/events") ? [
			{ activity_id: "start_event_student", instance_id: "demo", model_name: "strucna_praksa_A.bpmn", timestamp: "2026-11-01T12:00:00Z" },
		] : [] } }));
		await page.goto("/dashboard");
		const tabs = page.getByRole("tablist", { name: "Statistika po modelu prakse" });
		await expect(tabs.getByRole("tab")).toHaveText(["A", "B", "Sve"]);
		await expect(tabs.getByRole("tab", { name: "Sve", exact: true })).toHaveAttribute("aria-selected", "true");
		const general = page.getByRole("heading", { name: "Uspješno odrađenih praksi (A + B)", exact: true });
		const modelA = page.getByRole("heading", { name: "Uspješno odrađenih praksi (A)", exact: true });
		const modelB = page.getByRole("heading", { name: "Uspješno odrađenih praksi (B)", exact: true });
		await expect(general).toBeVisible();
		await expect(modelA).toHaveCount(0);
		await expect(modelB).toHaveCount(0);
		await tabs.getByRole("tab", { name: "A", exact: true }).click();
		await expect(modelA).toBeVisible();
		await expect(general).toHaveCount(0);
		await expect(modelB).toHaveCount(0);
		await tabs.getByRole("tab", { name: "A", exact: true }).press("ArrowRight");
		await expect(tabs.getByRole("tab", { name: "B", exact: true })).toBeFocused();
		await expect(modelB).toBeVisible();
		await expect(modelA).toHaveCount(0);
		await expect(general).toHaveCount(0);
		await tabs.getByRole("tab", { name: "Sve", exact: true }).click();
		await expect(general).toBeVisible();
		await expect(modelA).toHaveCount(0);
		await expect(modelB).toHaveCount(0);
		await expect(page.getByRole("tablist", { name: "Prikaz događaja" })).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
		await page.screenshot({ path: `/tmp/dashboard-statistics-${width}.png` });
		expect(errors).toEqual([]);
	});
}
