const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
	// Keep the actual components isolated from application startup and remote services.
	await page.route("**/src/main.js", (route) => route.fulfill({
		contentType: "application/javascript",
		body: 'export const mainStore = { fetchCompanies: async () => [{ logo: [{ url: "/No-Logo.png" }] }] };',
	}));
	await page.goto("/tests/assignment-details.html");
	await page.getByRole("button", { name: "Otvori zadatak" }).click();
});

test("long fields expand independently with keyboard controls and reset for another task", async ({ page }) => {
	const dialog = page.getByRole("dialog");
	const description = dialog.locator("section").filter({ has: page.getByRole("heading", { name: "Opis zadatka" }) });
	const technologies = dialog.locator("section").filter({ has: page.getByRole("heading", { name: "Preferirane tehnologije" }) });
	const more = description.getByRole("button", { name: "Pročitaj više...", exact: true });
	await expect(more).toHaveAttribute("aria-expanded", "false");
	const preview = await description.locator("p").boundingBox();
	await more.focus();
	await page.keyboard.press("Enter");
	const less = description.getByRole("button", { name: "Prikaži manje" });
	await expect(less).toHaveAttribute("aria-expanded", "true");
	expect((await description.locator("p").boundingBox()).height).toBeGreaterThan(preview.height);
	await expect(technologies.getByRole("button")).toHaveAttribute("aria-expanded", "false");
	await less.press("Space");
	await expect(more).toHaveAttribute("aria-expanded", "false");
	await more.click();
	await dialog.getByRole("button", { name: "Sljedeći zadatak" }).click();
	await expect(description.locator("p")).toHaveText("Kratak opis.");
	await expect(dialog.getByRole("button", { name: /Pročitaj više|Prikaži manje/ })).toHaveCount(0);
	await dialog.getByRole("button", { name: "Zatvori", exact: true }).click();
	await expect(dialog).toHaveCount(0);
	await expect(page.getByRole("button", { name: "Otvori zadatak" })).toBeFocused();
});

test("task dialog is wider on desktop and fits mobile without horizontal scrolling", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	const dialog = page.getByRole("dialog");
	expect((await dialog.boundingBox()).width).toBe(1152);
	await dialog.evaluate((element) => { element.scrollTop = 0; });
	await page.screenshot({ path: "/tmp/assignment-details-desktop.png" });
	await dialog.getByRole("button", { name: "Zatvori", exact: true }).scrollIntoViewIfNeeded();
	await expect(dialog.getByRole("button", { name: "Zatvori", exact: true })).toBeInViewport();
	await page.setViewportSize({ width: 390, height: 844 });
	await dialog.evaluate((element) => { element.scrollTop = 0; });
	expect((await dialog.boundingBox()).width).toBe(390);
	expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
	await expect(dialog.getByRole("button", { name: "Pročitaj više...", exact: true })).toHaveCount(3);
	await page.screenshot({ path: "/tmp/assignment-details-mobile.png" });
});
