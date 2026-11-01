const { test, expect } = require("@playwright/test");

for (const width of [1280, 390]) {
	for (const theme of ["light", "dark"]) {
		test(`logout dialog supports cancellation, keyboard focus and sign-out at ${width}px in ${theme} mode`, async ({ page }) => {
			const errors = [];
			page.on("pageerror", (error) => errors.push(error.message));
			await page.setViewportSize({ width, height: 844 });
			await page.emulateMedia({ reducedMotion: "reduce" });
			await page.addInitScript((theme) => {
				sessionStorage.setItem("dev-data-mode", "local");
				localStorage.setItem("darkMode", theme === "dark" ? "1" : "0");
			}, theme);
			await page.route("http://localhost:8082/api/**", (route) => route.fulfill({ json: { data: { results: [] } } }));
			await page.goto("/prijava");
			await page.evaluate(() => {
				sessionStorage.setItem("token", "local-logout-test");
				sessionStorage.setItem("main", JSON.stringify({ currentUser: {
					ime: "Demo", prezime: "Korisnik", email: "student@local.test",
					internship_process: { id: null, pending_user_task: null },
				} }));
			});
			await page.goto("/profil");
			if (width < 1024) await page.getByRole("button", { name: "Navigacijski izbornik", exact: true }).click();
			const trigger = page.locator("nav").getByRole("button", { name: "Odjava", exact: true }).last();
			const dialog = page.getByRole("dialog", { name: "Jeste li sigurni da se želite odjaviti?", exact: true });
			const back = dialog.getByRole("button", { name: "Natrag", exact: true });
			const confirm = dialog.getByRole("button", { name: "Odjava", exact: true });

			await trigger.press("Enter");
			await expect(dialog).toBeVisible();
			await expect(back).toBeFocused();
			await expect(dialog).toHaveCSS("background-color", theme === "dark" ? "rgb(15, 23, 42)" : "rgb(255, 255, 255)");
			const bounds = await dialog.boundingBox();
			expect(bounds.width).toBeLessThanOrEqual(448);
			expect(bounds.x).toBeGreaterThanOrEqual(16);
			expect(bounds.x + bounds.width).toBeLessThanOrEqual(width - 16);
			for (const button of [back, confirm]) expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
			await page.screenshot({ path: `/tmp/logout-dialog-${theme}-${width}.png` });
			await page.keyboard.press("ArrowRight");
			await expect(confirm).toBeFocused();
			await page.keyboard.press("Tab");
			await expect(dialog.locator(":focus")).toHaveCount(1);
			await page.keyboard.press("Escape");
			await expect(dialog).toHaveCount(0);
			await expect(trigger).toBeFocused();

			await trigger.click();
			await back.click();
			await expect(dialog).toHaveCount(0);
			await expect(trigger).toBeFocused();
			expect(await page.evaluate(() => sessionStorage.getItem("token"))).toBe("local-logout-test");
			await trigger.click();
			await confirm.click();
			await expect(page).toHaveURL(/\/prijava$/);
			expect(await page.evaluate(() => sessionStorage.getItem("token"))).toBeNull();
			expect(errors).toEqual([]);
		});
	}
}
