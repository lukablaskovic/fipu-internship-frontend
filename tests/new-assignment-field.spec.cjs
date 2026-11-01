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
	for (const control of await page.locator("form [aria-describedby]").all()) {
		expect(await control.evaluate((el) => el.getAttribute("aria-describedby").split(" ").every((id) => document.getElementById(id)?.textContent.trim()))).toBe(true);
	}
}

async function fillEmployer(page) {
	await page.getByRole("combobox", { name: "Postojeći partner*" }).fill("Test");
	await page.getByRole("option", { name: "Test partner", exact: true }).click();
	await expect(page.getByRole("textbox", { name: "Naziv organizacije*" })).toBeDisabled();
	await page.getByRole("textbox", { name: "Kontakt email*" }).fill("test@example.com");
	await page.getByRole("button", { name: "Dalje", exact: true }).click();
	await expect(page.getByRole("heading", { name: "2. Zadatak i studenti" })).toBeFocused();
}

async function fillAssignment(page) {
	await page.getByRole("textbox", { name: "Detaljan opis zadatka*" }).fill("Test project");
	await page.getByRole("spinbutton", { name: "Broj studenata*" }).fill("2");
	await page.getByRole("button", { name: "Dalje", exact: true }).click();
	await expect(page.getByRole("heading", { name: "3. Organizacija prakse" })).toBeFocused();
}

async function fillOrganization(page) {
	await page.getByRole("spinbutton", { name: "Željeno trajanje prakse*" }).fill("100");
	await page.getByRole("textbox", { name: "Lokacija*" }).fill("Remote");
	await page.getByRole("textbox", { name: "Željeno okvirno vrijeme početka" }).fill("Prosinac");
	await page.getByRole("radiogroup", { name: "Angažman nastavnika s FIPU*" }).getByRole("radio", { name: "Ne", exact: true }).click();
	await page.getByRole("radiogroup", { name: "Selekcijski postupak*" }).getByRole("radio", { name: "Ne", exact: true }).click();
}

test("three steps validate forward navigation and preserve values when returning", async ({ page }) => {
	const employerStep = page.getByRole("button", { name: "Poslodavac", exact: true });
	const assignmentStep = page.getByRole("button", { name: "Zadatak i studenti", exact: true });
	await expect(page.getByRole("button", { name: "Organizacija prakse", exact: true })).toBeDisabled();
	await expect(page.getByRole("button", { name: "Pošalji", exact: true })).toHaveCount(0);
	await checkFieldWiring(page, 3);
	await assignmentStep.click();
	await expect(page.getByRole("heading", { name: "1. Poslodavac" })).toBeVisible();
	await expect(page.getByRole("combobox", { name: "Postojeći partner*" })).toBeFocused();
	await fillEmployer(page);
	await checkFieldWiring(page, 5);
	await page.getByRole("textbox", { name: "Detaljan opis zadatka*" }).fill("Saved draft");
	await employerStep.click();
	await expect(page.getByRole("textbox", { name: "Kontakt email*" })).toHaveValue("test@example.com");
	await employerStep.press("ArrowRight");
	await expect(assignmentStep).toBeFocused();
	await assignmentStep.press("Enter");
	await expect(page.getByRole("textbox", { name: "Detaljan opis zadatka*" })).toHaveValue("Saved draft");
	await page.getByRole("button", { name: "Dalje", exact: true }).click();
	await expect(page.getByRole("spinbutton", { name: "Broj studenata*" })).toBeFocused();
});

test("Field labels, descriptions and conditional controls stay connected", async ({ page }) => {
	await page.getByText("Kontakt email", { exact: false }).first().click();
	await expect(page.getByRole("textbox", { name: "Kontakt email*" })).toBeFocused();
	await fillEmployer(page);
	await fillAssignment(page);
	await checkFieldWiring(page, 6);
	await page.getByRole("radiogroup", { name: "Angažman nastavnika s FIPU*" }).getByRole("radio", { name: "Da", exact: true }).click();
	await page.getByRole("radiogroup", { name: "Selekcijski postupak*" }).getByRole("radio", { name: "Da", exact: true }).click();
	await expect(page.getByRole("textbox", { name: "Opis angažmana nastavnika", exact: true })).toBeVisible();
	await expect(page.getByRole("textbox", { name: "Proces selekcije", exact: true })).toBeVisible();
	await checkFieldWiring(page, 8);
	await page.getByRole("button", { name: "Pošalji", exact: true }).click();
	await expect(page.getByRole("textbox", { name: "Opis angažmana nastavnika", exact: true })).toHaveAttribute("aria-invalid", "true");
	await expect(page.getByRole("textbox", { name: "Proces selekcije", exact: true })).toHaveAttribute("aria-invalid", "true");
	await page.getByRole("textbox", { name: "Opis angažmana nastavnika", exact: true }).fill("Mentoriranje");
	await page.getByRole("textbox", { name: "Proces selekcije", exact: true }).fill("Intervju");
	await page.getByRole("button", { name: "Natrag", exact: true }).click();
	await page.getByRole("button", { name: "Dalje", exact: true }).click();
	await expect(page.getByRole("textbox", { name: "Opis angažmana nastavnika", exact: true })).toHaveValue("Mentoriranje");
	await expect(page.getByRole("textbox", { name: "Proces selekcije", exact: true })).toHaveValue("Intervju");
	await checkFieldWiring(page, 8);
});

test("inline validation clears on correction and reset returns to the first step", async ({ page }) => {
	let submissions = 0;
	await page.route("**/api/zadaci_za_odabir", (route) => { submissions++; return route.fulfill({ json: { data: false } }); });
	await page.getByRole("button", { name: "Dalje", exact: true }).click();
	const email = page.getByRole("textbox", { name: "Kontakt email*" });
	await expect(email).toHaveAttribute("aria-invalid", "true");
	await expect(email).toHaveAccessibleDescription("Polje je obavezno");
	await email.fill("invalid");
	await expect(email).toHaveAccessibleDescription("Molimo unesite ispravnu e-mail adresu");
	await email.press("Enter");
	await expect(page.getByRole("heading", { name: "1. Poslodavac" })).toBeVisible();
	await email.fill("test@example.com");
	await expect(email).not.toHaveAttribute("aria-invalid", "true");
	await expect(email).toHaveAccessibleDescription(/E-mail adresa/);
	await page.getByRole("textbox", { name: "Naziv organizacije*" }).fill("Test organization");
	await expect(page.getByRole("combobox", { name: "Postojeći partner*" })).toBeDisabled();
	await page.getByRole("button", { name: "Dalje", exact: true }).click();
	await page.getByRole("button", { name: "Dalje", exact: true }).click();
	const students = page.getByRole("spinbutton", { name: "Broj studenata*" });
	await students.fill("0");
	await expect(students).toHaveAccessibleDescription("Minimalno 1 student");
	await students.fill("2");
	await expect(students).not.toHaveAttribute("aria-invalid", "true");
	await page.getByRole("button", { name: "Resetiraj formu", exact: true }).click();
	await expect(page.getByRole("heading", { name: "1. Poslodavac" })).toBeFocused();
	await expect(email).toHaveValue("");
	await expect(page.getByRole("textbox", { name: "Naziv organizacije*" })).toHaveValue("");
	await expect(page.getByRole("combobox", { name: "Postojeći partner*" })).toBeEnabled();
	await expect(page.locator('form [aria-invalid="true"]')).toHaveCount(0);
	await checkFieldWiring(page, 3);
	expect(submissions).toBe(0);
});

test("existing partner submission preserves payload and resets after saving", async ({ page }) => {
	await page.route("**/api/zadaci_za_odabir", (route) => route.fulfill({ json: { data: { id: 42 } } }));
	await fillEmployer(page);
	await fillAssignment(page);
	await fillOrganization(page);
	const request = page.waitForRequest((request) => request.method() === "POST" && request.url().includes("/api/zadaci_za_odabir"));
	await page.getByRole("button", { name: "Pošalji", exact: true }).click();
	expect((await request).postDataJSON()).toMatchObject({ Poslodavac: ["Test partner"], broj_studenata: 2, trajanje_sati: 100, selekcija: false, proces_selekcije: "Nema" });
	await expect(page.getByRole("heading", { name: "1. Poslodavac" })).toBeVisible();
	await expect(page.getByRole("textbox", { name: "Kontakt email*" })).toHaveValue("");
});

test("failed submission keeps the third step and entered values", async ({ page }) => {
	await page.route("**/api/zadaci_za_odabir", (route) => route.fulfill({ status: 500, json: {} }));
	await fillEmployer(page);
	await fillAssignment(page);
	await fillOrganization(page);
	await page.getByRole("button", { name: "Pošalji", exact: true }).click();
	await expect(page.getByText("Zadatak nije prijavljen. Molimo pokušajte ponovno.", { exact: true })).toBeVisible();
	await expect(page.getByRole("heading", { name: "3. Organizacija prakse" })).toBeVisible();
	await expect(page.getByRole("textbox", { name: "Lokacija*" })).toHaveValue("Remote");
	await expect(page.getByRole("button", { name: "Pošalji", exact: true })).toBeEnabled();
});

test("all three steps stay within the mobile viewport", async ({ page }, testInfo) => {
	await page.getByRole("button", { name: "Poslodavac", exact: true }).scrollIntoViewIfNeeded();
	await page.screenshot({ path: testInfo.outputPath("stepper-desktop.png") });
	await page.setViewportSize({ width: 390, height: 844 });
	await page.getByRole("textbox", { name: "Kontakt email*" }).scrollIntoViewIfNeeded();
	await checkFieldWiring(page, 3);
	for (const step of [1, 2, 3]) {
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
		await page.getByRole("button", { name: "Poslodavac", exact: true }).scrollIntoViewIfNeeded();
		await page.screenshot({ path: testInfo.outputPath(`step-${step}-mobile.png`) });
		if (step === 1) await fillEmployer(page);
		if (step === 2) await fillAssignment(page);
	}
});
