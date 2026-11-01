const { test, expect } = require("@playwright/test");

const image = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#2563eb"/></svg>';

test("avatars keep their size, overlay and accessible fallback while loading, failing and changing URLs", async ({ page }) => {
	await page.route("https://images.example/**", route => route.request().url().endsWith("broken.png")
		? route.fulfill({ status: 404, body: "missing" })
		: route.fulfill({ contentType: "image/svg+xml", body: image }));
	await page.goto("/tests/avatar.html");
	const avatar = page.getByRole("img", { name: "Demo Korisnik" });
	const input = page.getByRole("textbox", { name: "Avatar URL" });
	await expect(avatar).toBeVisible();
	await expect(avatar).toHaveJSProperty("tagName", "SPAN");
	const root = page.getByTestId("overlay").locator("..");
	expect((await root.boundingBox()).width).toBe(24);
	expect((await root.boundingBox()).height).toBe(24);
	await page.setViewportSize({ width: 390, height: 844 });
	expect((await root.boundingBox()).width).toBe(96);
	expect((await root.boundingBox()).height).toBe(96);

	let finishLoading;
	await page.route("https://images.example/slow.png", async route => {
		await new Promise(resolve => { finishLoading = resolve; });
		await route.fulfill({ contentType: "image/svg+xml", body: image });
	});
	await input.fill("https://images.example/slow.png");
	await expect(page.locator("output")).toHaveText("loading");
	await expect(avatar).toHaveJSProperty("tagName", "SPAN");
	await expect.poll(() => typeof finishLoading).toBe("function");
	await page.unroute("https://images.example/slow.png");
	finishLoading();
	await expect(page.locator("output")).toHaveText("loaded");
	await expect(avatar).toHaveJSProperty("tagName", "IMG");
	await expect(avatar).toHaveAttribute("referrerpolicy", "no-referrer");
	await expect(page.getByTestId("overlay")).toBeVisible();

	await input.fill("https://images.example/broken.png");
	await expect(page.locator("output")).toHaveText("error");
	await expect(avatar).toHaveJSProperty("tagName", "SPAN");
	await input.fill("https://images.example/recovered.png");
	await expect(page.locator("output")).toHaveText("loaded");
	await expect(avatar).toHaveAttribute("src", "https://images.example/recovered.png");
	await input.fill("");
	await expect(avatar).toHaveJSProperty("tagName", "SPAN");
});
