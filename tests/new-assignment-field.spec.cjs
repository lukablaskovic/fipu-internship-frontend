const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
	await page.addInitScript(() => sessionStorage.setItem("dev-data-mode", "local"));
	await page.route("**/api/**", (route) => route.fulfill({ json: { data: { results: [] } } }));
	await page.route("**/api/Poslodavac*", (route) => route.fulfill({ json: { data: { results: [{ id: 1, naziv: "Test partner" }] } } }));
	await page.goto("/poslodavci/novi-zadatak");
	await expect(page.getByRole("heading", { name: /Prijava projekta/ })).toBeVisible();
});

async function checkFieldWiring(page, count) {
	const controls = page.locator('form input:not([aria-hidden]):not([type="hidden"]), form textarea, form [role="radiogroup"]');
	await expect(controls).toHaveCount(count);
	for (const control of await controls.all()) {
		await expect(control).toHaveAttribute("id", /reka-field-/);
		await expect(control).toHaveAttribute("aria-labelledby", /reka-field-label-/);
		expect(await control.evaluate((el) => el.getAttribute("aria-labelledby").split(" ").every((id) => document.getElementById(id)?.textContent.trim()))).toBe(true);
	}
	const described = page.locator("form [aria-describedby]");
	for (const control of await described.all()) {
		expect(await control.evaluate((el) => el.getAttribute("aria-describedby").split(" ").every((id) => document.getElementById(id)?.textContent.trim()))).toBe(true);
	}
}

test("Field labels, descriptions and conditional controls stay connected", async ({ page }) => {
	await checkFieldWiring(page, 14);
	await page.getByText("Kontakt email", { exact: false }).first().click();
	await expect(page.getByRole("textbox", { name: "Kontakt email*" })).toBeFocused();
	const engagement = page.getByRole("radiogroup", { name: "Angažman nastavnika s FIPU*" });
	await engagement.getByRole("radio", { name: "Da", exact: true }).click();
	await page.getByRole("radiogroup", { name: "Selekcijski postupak*" }).getByRole("radio", { name: "Da", exact: true }).click();
	await expect(page.getByRole("textbox", { name: "Opis angažmana nastavnika", exact: true })).toBeVisible();
	await expect(page.getByRole("textbox", { name: "Proces selekcije", exact: true })).toBeVisible();
	await checkFieldWiring(page, 16);
	await page.getByRole("button", { name: "Pošalji", exact: true }).click();
	await expect(page.getByRole("textbox", { name: "Opis angažmana nastavnika", exact: true })).toHaveAttribute("aria-invalid", "true");
	await expect(page.getByRole("textbox", { name: "Proces selekcije", exact: true })).toHaveAttribute("aria-invalid", "true");
	await checkFieldWiring(page, 16);
});

test("inline validation clears on correction and reset", async ({ page }) => {
	let submissions = 0;
	await page.route("**/api/zadaci_za_odabir", (route) => { submissions++; return route.fulfill({ json: { data: false } }); });
	await page.getByRole("button", { name: "Pošalji", exact: true }).click();
	const email = page.getByRole("textbox", { name: "Kontakt email*" });
	await expect(email).toHaveAttribute("aria-invalid", "true");
	await expect(email).toHaveAccessibleDescription("Polje je obavezno");
	await email.fill("invalid");
	await expect(email).toHaveAccessibleDescription("Molimo unesite ispravnu e-mail adresu");
	await page.getByRole("button", { name: "Pošalji", exact: true }).click();
	await expect(email).toHaveAttribute("aria-invalid", "true");
	await email.fill("test@example.com");
	await expect(email).not.toHaveAttribute("aria-invalid", "true");
	await expect(email).toHaveAccessibleDescription(/E-mail adresa/);
	const organization = page.getByRole("textbox", { name: "Naziv organizacije*" });
	await organization.fill("Test organization");
	await expect(page.getByRole("combobox", { name: "Postojeći partner*" })).toBeDisabled();
	await expect(organization).not.toHaveAttribute("aria-invalid", "true");
	const students = page.getByRole("spinbutton", { name: "Broj studenata*" });
	await students.fill("0");
	await expect(students).toHaveAccessibleDescription("Minimalno 1 student");
	await students.fill("2");
	await expect(students).not.toHaveAttribute("aria-invalid", "true");
	await page.getByRole("button", { name: "Resetiraj formu", exact: true }).click();
	await expect(email).toHaveValue("");
	await expect(organization).toHaveValue("");
	await expect(page.getByRole("combobox", { name: "Postojeći partner*" })).toBeEnabled();
	await expect(page.locator('form [aria-invalid="true"]')).toHaveCount(0);
	await checkFieldWiring(page, 14);
	expect(submissions).toBe(0);
});

test("existing partner selection and valid submission preserve payload values", async ({ page }) => {
	await page.route("**/api/zadaci_za_odabir", (route) => route.fulfill({ json: { data: false } }));
	await page.getByRole("combobox", { name: "Postojeći partner*" }).fill("Test");
	await page.getByRole("option", { name: "Test partner", exact: true }).click();
	await expect(page.getByRole("textbox", { name: "Naziv organizacije*" })).toBeDisabled();
	await page.getByRole("textbox", { name: "Kontakt email*" }).fill("test@example.com");
	await page.getByRole("textbox", { name: "Detaljan opis zadatka*" }).fill("Test project");
	await page.getByRole("spinbutton", { name: "Broj studenata*" }).fill("2");
	await page.getByRole("spinbutton", { name: "Željeno trajanje prakse*" }).fill("100");
	await page.getByRole("textbox", { name: "Lokacija*" }).fill("Remote");
	await page.getByRole("textbox", { name: "Željeno okvirno vrijeme početka" }).fill("Prosinac");
	await page.getByRole("radiogroup", { name: "Angažman nastavnika s FIPU*" }).getByRole("radio", { name: "Ne", exact: true }).click();
	await page.getByRole("radiogroup", { name: "Selekcijski postupak*" }).getByRole("radio", { name: "Ne", exact: true }).click();
	const request = page.waitForRequest((request) => request.method() === "POST" && request.url().includes("/api/zadaci_za_odabir"));
	await page.getByRole("button", { name: "Pošalji", exact: true }).click();
	expect((await request).postDataJSON()).toMatchObject({ Poslodavac: ["Test partner"], broj_studenata: 2, trajanje_sati: 100, selekcija: false, proces_selekcije: "Nema" });
});

test("mobile Field layout stays within the viewport", async ({ page }, testInfo) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.getByRole("textbox", { name: "Kontakt email*" }).scrollIntoViewIfNeeded();
	await checkFieldWiring(page, 14);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await page.screenshot({ path: testInfo.outputPath("fields-mobile.png") });
});
