const { test, expect } = require("@playwright/test");
test.beforeEach(async ({ page }) => {
	await page.goto("/tests/toast.html");
	await page.waitForFunction(() => window.snacks);
});
test("timed toast pauses on hover, expires and clears the store", async ({ page }) => {
	await page.evaluate(() => window.snacks.pushMessage("Saved", "success", 1000));
	const toast = page.locator("li[data-state=open]");
	await expect(toast).toContainText("Saved");
	await toast.hover();
	await page.waitForTimeout(1200);
	await expect(toast).toBeVisible();
	await page.mouse.move(0, 0);
	await expect(toast).toHaveCount(0);
	await expect.poll(() => page.evaluate(() => window.snacks.messages.length)).toBe(0);
});
test("persistent error toast supports keyboard dismissal and mobile layout", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.evaluate(() => window.snacks.pushMessage("Failed", "error", 0));
	const toast = page.locator("li[data-state=open]");
	await expect(toast).toHaveClass(/bg-red-600/);
	await page.waitForTimeout(1200);
	await expect(toast).toBeVisible();
	const box = await toast.boundingBox();
	expect(box.x).toBeGreaterThanOrEqual(0);
	expect(box.x + box.width).toBeLessThanOrEqual(390);
	await page.keyboard.press("F8");
	await page.keyboard.press("Escape");
	await expect(toast).toHaveCount(0);
	await expect.poll(() => page.evaluate(() => window.snacks.messages.length)).toBe(0);
});
test("close button removes only its toast", async ({ page }) => {
	await page.evaluate(() => window.snacks.pushMessage("First", "info", 0));
	await expect(page.locator("li[data-state=open]")).toHaveCount(1);
	await page.evaluate(() => window.snacks.pushMessage("Second", "warning", 0));
	await page.locator("li[data-state=open]").filter({ hasText: "First" }).getByRole("button", { name: "Zatvori obavijest" }).click();
	await expect(page.locator("li[data-state=open]")).toHaveText("Second×");
	await expect.poll(() => page.evaluate(() => window.snacks.messages.map(m => m.text))).toEqual(["Second"]);
});
