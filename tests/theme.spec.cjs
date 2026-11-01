const { test, expect } = require("@playwright/test");

const toggle = (page) => page.getByRole("button", { name: "Tamni način rada", exact: true });

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => sessionStorage.setItem("dev-data-mode", "local"));
	await page.route("http://localhost:8082/api/**", (route) => route.fulfill({ json: { data: { results: [] } } }));
});

for (const width of [1280, 390]) {
	test(`theme switch works with the keyboard and persists through navigation and reload at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
		await page.goto("/prijava");
		await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
		await page.screenshot({ path: `/tmp/theme-login-light-${width}.png` });
		await toggle(page).focus();
		await page.keyboard.press("Enter");
		await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
		await expect(page.locator("html")).toHaveClass(/dark/);
		await expect(page.locator("html")).toHaveCSS("color-scheme", "dark");
		await expect(page.locator(".login-panel")).toHaveCSS("background-color", width === 1280 ? "rgb(30, 41, 59)" : "rgba(0, 0, 0, 0)");
		await expect(page.locator(".login-note")).toHaveCSS("color", "rgb(203, 213, 225)");
		await expect(page.locator(".faculty-logo")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
		await expect(page.locator(".faculty-logo")).toHaveCSS("filter", "brightness(0) invert(1)");
		await page.screenshot({ path: `/tmp/theme-login-dark-${width}.png` });
		await page.getByRole("link", { name: "Nastavi kao gost" }).click();
		await expect(page.locator("nav")).toBeVisible();
		await expect(toggle(page)).toBeInViewport();
		await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
		await expect(page.locator("nav")).toHaveCSS("background-color", "rgb(30, 41, 59)");
		await page.screenshot({ path: `/tmp/theme-guest-dark-${width}.png` });
		await page.reload();
		await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
		await toggle(page).press("Space");
		await expect(page.locator("html")).not.toHaveClass(/dark/);
		await expect(page.locator("nav")).toHaveCSS("background-color", "rgb(249, 250, 251)");
		await page.emulateMedia({ colorScheme: "dark" });
		await page.reload();
		await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
		expect(await page.evaluate(() => localStorage.getItem("darkMode"))).toBe("0");
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	});
}

for (const width of [1280, 390]) {
	test(`Google sign-in follows the saved theme and updates when toggled at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		await page.addInitScript(() => {
			sessionStorage.setItem("dev-data-mode", "real");
			localStorage.setItem("darkMode", "1");
		});
		await page.route("https://accounts.google.com/gsi/client", (route) => route.fulfill({
			contentType: "application/javascript",
			body: `window.google = { accounts: { id: {
				initialize() {},
				renderButton(element, options) {
					const button = document.createElement("button");
					button.textContent = "Google sign-in";
					button.dataset.theme = options.theme;
					button.dataset.size = options.size;
					element.replaceChildren(button);
				}
			} } };`,
		}));
		await page.goto("/prijava");
		const googleButton = page.getByRole("button", { name: "Google sign-in", exact: true });
		await expect(googleButton).toHaveAttribute("data-theme", "filled_black");
		await expect(googleButton).toHaveAttribute("data-size", "large");
		await expect(page.locator(".g-btn-wrapper")).toHaveCSS("color-scheme", "light");
		await toggle(page).click();
		await expect(googleButton).toHaveAttribute("data-theme", "outline");
		await expect(page.locator(".faculty-logo")).toHaveCSS("filter", "none");
		await toggle(page).click();
		await expect(googleButton).toHaveAttribute("data-theme", "filled_black");
		await expect(googleButton).toHaveCount(1);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	});
}

test("uses the device theme until a preference is saved", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/prijava");
	await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
	expect(await page.evaluate(() => localStorage.getItem("darkMode"))).toBeNull();
	await page.emulateMedia({ colorScheme: "light" });
	await page.reload();
	await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
	await page.evaluate(() => localStorage.setItem("darkMode", "1"));
	await page.reload();
	await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
});

test("still switches when local storage is blocked", async ({ page }) => {
	await page.addInitScript(() => Object.defineProperty(window, "localStorage", {
		get() { throw new DOMException("Storage blocked", "SecurityError"); },
	}));
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/prijava");
	await toggle(page).click();
	await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
	await toggle(page).click();
	await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
});

for (const role of ["admin", "student"]) {
	test(`${role} navigation and portaled dialogs inherit the theme`, async ({ page }) => {
		await page.addInitScript((role) => {
			sessionStorage.setItem("token", "local-theme-test");
			sessionStorage.setItem("main", JSON.stringify({ currentUser: {
				ime: "Demo", prezime: "Korisnik", email: `${role}@local.test`,
				internship_process: { id: null, pending_user_task: null },
			} }));
			localStorage.setItem("darkMode", "1");
		}, role);
		await page.goto("/profil");
		await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
		const account = page.locator("nav").getByRole("button", { name: "Demo Korisnik", exact: true });
		const help = page.locator("nav").getByRole("button", { name: "Pomoć", exact: true });
		const accountBox = await account.boundingBox();
		const toggleBox = await toggle(page).boundingBox();
		const helpBox = await help.boundingBox();
		expect(toggleBox.x).toBeGreaterThanOrEqual(accountBox.x + accountBox.width);
		expect(toggleBox.x + toggleBox.width).toBeLessThanOrEqual(helpBox.x);
		await account.focus();
		await page.keyboard.press("ArrowRight");
		await expect(toggle(page)).toBeFocused();
		const logout = page.locator("nav").getByRole("button", { name: "Odjava", exact: true }).last();
		await logout.click();
		const dialog = page.getByRole("dialog");
		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveCSS("background-color", "rgb(15, 23, 42)");
		await page.screenshot({ path: `/tmp/theme-${role}-dialog-dark.png` });
		await page.keyboard.press("Escape");
		await toggle(page).click();
		await logout.click();
		await expect(dialog).toHaveCSS("background-color", "rgb(255, 255, 255)");
	});
}
