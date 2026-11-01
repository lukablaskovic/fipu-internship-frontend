const { test, expect } = require("@playwright/test");

const controls = [
	["modal", (page) => page.getByRole("button", { name: "Otvori modal", exact: true }).click(), '[role="dialog"].reka-animated'],
	["select", (page) => page.locator("#select").click(), '[role="listbox"].reka-animated'],
	["combobox", (page) => page.locator('input[role="combobox"]').click(), '[role="listbox"].reka-animated'],
	["menu", (page) => page.getByRole("button", { name: "Akcije" }).click(), '[role="menu"].reka-animated'],
	["date picker", (page) => page.getByRole("button", { name: "Otvori kalendar" }).click(), '[role="dialog"].reka-animated'],
	["tooltip", (page) => page.getByRole("button", { name: "Tooltip test" }).focus(), '.reka-animated:has([role="tooltip"])'],
];

for (const [name, open, selector] of controls) {
	test(`${name} animates entry and waits for exit before unmounting`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "no-preference" });
		await page.goto("/tests/reka.html");
		await open(page);
		const content = page.locator(selector);
		await expect(content).toHaveCSS("animation-name", "reka-fade-in");
		await content.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
		// Pause the exit to prove Reka retains the element until animationend.
		await page.addStyleTag({ content: '.reka-animated[data-state="closed"] { animation-duration: 1s; animation-play-state: paused; }' });
		await page.keyboard.press("Escape");
		await expect(content).toHaveAttribute("data-state", "closed");
		await expect(content).toHaveCSS("animation-name", "reka-fade-out");
		await content.evaluate((element) => element.getAnimations().forEach((animation) => animation.finish()));
		await expect(content).toHaveCount(0);
	});

	test(`${name} respects reduced motion`, async ({ page }) => {
		await page.emulateMedia({ reducedMotion: "reduce" });
		await page.goto("/tests/reka.html");
		await open(page);
		const content = page.locator(selector);
		await expect(content).toBeVisible();
		await expect(content).toHaveCSS("animation-name", "none");
		await page.keyboard.press("Escape");
		await expect(content).toHaveCount(0);
	});
}

test("modal overlay preserves its opacity and finishes exiting with its content", async ({ page }) => {
	await page.goto("/tests/reka.html");
	await page.getByRole("button", { name: "Otvori modal", exact: true }).click();
	const overlay = page.locator(".reka-animated.opacity-90");
	await expect(overlay).toHaveCSS("animation-name", "reka-fade-in");
	await overlay.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)));
	await expect(overlay).toHaveCSS("opacity", "0.9");
	await page.keyboard.press("Escape");
	await expect(overlay).toHaveCount(0);
	await expect(page.getByRole("button", { name: "Otvori modal", exact: true })).toBeFocused();
});
