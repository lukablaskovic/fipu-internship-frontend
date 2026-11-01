const { test, expect } = require("@playwright/test");

async function openProfile(page, admin = false) {
	await page.route(/\/src\/main(?:\.js)?(?:\?.*)?$/, route => route.fulfill({ contentType: "application/javascript", body: `
		import { reactive } from '/node_modules/.vite/deps/vue.js';
		export const adminStore = {}, studentStore = {}, styleStore = {}, layoutStore = {}, snackBarStore = {};
		export const mainStore = reactive({ userAdmin: ${admin}, currentUser: {
			ime: 'Demo', prezime: 'Korisnik', email: 'student@local.test', JMBAG: '1234567890', godina_studija: '3_prijediplomski', avatar: 'https://images.example/old.png'
		} });` }));
	await page.route("**/src/layouts/LayoutAuthenticated.vue", route => route.fulfill({ contentType: "application/javascript", body: "import { h } from '/node_modules/.vite/deps/vue.js'; export default { setup(_, { slots }) { return () => h('main', slots.default()); } };" }));
	await page.route("https://images.example/**", route => route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#2563eb"/></svg>' }));
	await page.goto("/tests/profile.html");
}

test("profile is compact on desktop and mobile, with role-specific details", async ({ page }) => {
	await openProfile(page);
	await expect(page.getByText("JMBAG", { exact: true })).toBeVisible();
	await expect(page.getByRole("link", { name: "Moja praksa" })).toBeVisible();
	await page.setViewportSize({ width: 1280, height: 800 });
	await expect(page.getByRole("link", { name: "Stanje procesa" })).toBeInViewport();
	await page.screenshot({ path: "/tmp/profile-desktop.png" });
	await page.setViewportSize({ width: 390, height: 844 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.screenshot({ path: "/tmp/profile-mobile.png" });
	await openProfile(page, true);
	await expect(page.getByText("JMBAG", { exact: true })).toHaveCount(0);
	await expect(page.getByRole("link", { name: "Baserow" })).toBeVisible();
});

test("avatar preview, validation, failed save, successful save and cancel", async ({ page }) => {
	await openProfile(page);
	await page.getByRole("button", { name: "Promijeni avatar" }).click();
	const input = page.getByRole("textbox", { name: "URL profilne slike" });
	const save = page.getByRole("button", { name: "Spremi sliku" });
	await input.fill("http://images.example/new.png");
	await expect(save).toBeDisabled();
	await input.fill("https://images.example/new.png");
	await expect(save).toBeEnabled();
	await page.route("**/api/student/avatar", route => route.fulfill({ status: 500, body: "error" }));
	await save.click();
	await expect(page.getByRole("alert")).toContainText("nije spremljena");
	await expect(page.getByAltText("Demo Korisnik")).toHaveAttribute("src", "https://images.example/old.png");
	await page.route("**/api/student/avatar", route => {
		expect(route.request().method()).toBe("PATCH");
		expect(route.request().postDataJSON()).toEqual({ avatar: "https://images.example/new.png" });
		return route.fulfill({ contentType: "application/json", body: JSON.stringify({ avatar: "https://images.example/new.png" }) });
	});
	await save.click();
	await expect(page.getByRole("status")).toContainText("spremljena");
	await expect(page.getByAltText("Demo Korisnik")).toHaveAttribute("src", "https://images.example/new.png");
	await page.getByRole("button", { name: "Promijeni avatar" }).click();
	await input.fill("https://images.example/other.png");
	await page.getByRole("button", { name: "Odustani" }).click();
	await expect(page.getByAltText("Demo Korisnik")).toHaveAttribute("src", "https://images.example/new.png");
});

test("failed avatar previews show a fallback and cannot be saved, then recover with a valid URL", async ({ page }) => {
	await openProfile(page);
	await page.route("https://images.example/broken.png", route => route.fulfill({ status: 404, body: "missing" }));
	await page.getByRole("button", { name: "Promijeni avatar" }).click();
	const input = page.getByRole("textbox", { name: "URL profilne slike" });
	const save = page.getByRole("button", { name: "Spremi sliku" });
	await input.fill("https://images.example/broken.png");
	await expect(page.getByRole("alert")).toContainText("Sliku nije moguće učitati");
	await expect(save).toBeDisabled();
	await expect(page.getByRole("img", { name: "Pregled nove profilne slike" })).toHaveJSProperty("tagName", "SPAN");
	await input.fill("https://images.example/recovered.png");
	await expect(page.getByRole("alert")).toHaveCount(0);
	await expect(save).toBeEnabled();
	await expect(page.getByRole("img", { name: "Pregled nove profilne slike" })).toHaveAttribute("src", "https://images.example/recovered.png");
});


test("camera button sits over the avatar and opens the editor with the keyboard", async ({ page }) => {
	await openProfile(page);
	await page.setViewportSize({ width: 390, height: 844 });
	const camera = page.getByRole("button", { name: "Promijeni avatar" });
	await expect(camera).toHaveCount(1);
	await expect(camera).toHaveAttribute("aria-expanded", "false");
	await expect(camera.locator("svg")).toBeVisible();
	const photo = await page.getByRole("img", { name: "Demo Korisnik" }).boundingBox();
	const button = await camera.boundingBox();
	expect(photo.width).toBe(112);
	expect(photo.height).toBe(112);
	expect(button.width).toBeGreaterThanOrEqual(44);
	expect(button.height).toBeGreaterThanOrEqual(44);
	expect(button.x + button.width).toBe(photo.x + photo.width);
	expect(button.y + button.height).toBe(photo.y + photo.height);
	await camera.focus();
	await expect(camera).toBeFocused();
	await camera.press("Enter");
	await expect(camera).toHaveAttribute("aria-expanded", "true");
	await expect(page.getByRole("textbox", { name: "URL profilne slike" })).toBeVisible();
	await page.screenshot({ path: "/tmp/profile-camera-editor-mobile.png" });
	await page.getByRole("button", { name: "Odustani" }).click();
	await expect(camera).toHaveAttribute("aria-expanded", "false");
	await expect(page.locator("#avatar-editor")).toHaveCount(0);
});
