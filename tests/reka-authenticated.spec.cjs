const { test, expect } = require("@playwright/test");
// Opt in against the local demo stack only; never use production credentials or data.
test.describe("local authenticated workflows", () => {
	let assignmentToRestore;
	test.afterEach(async ({ playwright }) => {
		if (!assignmentToRestore) return;
		const request = await playwright.request.newContext();
		try {
			const result = await request.patch("http://localhost:8082/api/zadaci_za_odabir/odobrenje", { data: {
				id_zadatak: assignmentToRestore.id_zadatak,
				voditelj_odobrio: assignmentToRestore.voditelj_odobrio.value,
			} });
			expect(result.ok()).toBe(true);
		} finally {
			await request.dispose();
			assignmentToRestore = undefined;
		}
	});
	test.skip(!process.env.LOCAL_AUTH_URL, "Set LOCAL_AUTH_URL=http://localhost:5173 with the local demo stack running");
	test.beforeEach(async ({ page }) => {
		const url = new URL(process.env.LOCAL_AUTH_URL);
		expect(["localhost", "127.0.0.1"]).toContain(url.hostname);
		await page.addInitScript(() => sessionStorage.setItem("dev-data-mode", "local"));
		await page.goto(url.href);
	});
	test("administrator navigation, tooltips, search, filters, profile and logout", async ({ page }) => {
		const errors = [];
		page.on("pageerror", (e) => errors.push(e.message));
		await page.getByRole("button", { name: "Lokalni administrator", exact: true }).click();
		await expect(page).toHaveURL(/\/dashboard$/);
		await page.getByRole("button", { name: "Događaji", exact: true }).click();
		await expect(page.getByRole("menuitemcheckbox").first()).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(page.getByRole("button", { name: "Događaji", exact: true })).toBeFocused();
		const students = page.getByRole("link", { name: "Studenti", exact: true }).first();
		await students.focus();
		await expect(page.getByRole("tooltip")).toHaveText("Studenti");
		await page.keyboard.press("Escape");
		await expect(page.getByRole("tooltip")).toHaveCount(0);
		await students.click();
		await expect(page).toHaveURL(/\/studenti$/);
		await expect(page.getByText("Studenti u procesu prakse", { exact: true })).toBeVisible();
		await expect(page.getByText("Učitavanje...", { exact: true })).toHaveCount(0, { timeout: 15000 });
		const search = page.getByRole("combobox", { name: "Pretraživanje" });
		await search.fill("poslodavci");
		await page.getByRole("option", { name: "poslodavci", exact: true }).click();
		await expect(page).toHaveURL(/\/poslodavci$/);
		await page.getByRole("link", { name: "Zadaci", exact: true }).first().click();
		await expect(page.getByText("Zadatak 2 - Demo poduzeće", { exact: true })).toBeVisible();
		const filter = page.getByRole("button", { name: "Otvori izbornik", exact: true });
		await filter.click();
		await expect(page.getByRole("menu")).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(filter).toBeFocused();
		await page.goto(new URL("/profil", process.env.LOCAL_AUTH_URL).href);
		await expect(page.getByRole("heading", { name: "Moj profil", exact: true })).toHaveClass("sr-only");
		const logout = page.locator("nav").getByRole("button", { name: "Odjava", exact: true }).last();
		await logout.focus();
		await expect(page.getByRole("tooltip")).toHaveText("Odjava");
		await page.keyboard.press("Enter");
		await expect(page.getByRole("dialog")).toBeVisible();
		await page.getByRole("button", { name: "Natrag", exact: true }).click();
		await expect(logout).toBeFocused();
		await logout.click();
		await page.getByRole("dialog").getByRole("button", { name: "Odjava", exact: true }).click();
		await expect(page).toHaveURL(/\/prijava$/);
		expect(errors).toEqual([]);
	});
	test("student login, study-year keyboard selection and admin-route guard", async ({ page }) => {
		const errors = [];
		page.on("pageerror", (e) => errors.push(e.message));
		await page.getByRole("button", { name: "Lokalni student", exact: true }).click();
		await expect(page).toHaveURL(/\/odabir-procesa$/);
		await expect(page.getByRole("textbox", { name: "E-mail", exact: true })).toHaveValue("student@local.test");
		await page.getByRole("textbox", { name: "JMBAG", exact: true }).fill("1234567890");
		const studyYear = page.getByRole("combobox", { name: "Godina studija", exact: true });
		await expect(studyYear).toContainText("3. prijediplomski");
		await studyYear.click();
		await page.getByRole("option", { name: "1. prijediplomski", exact: true }).click();
		await studyYear.press("Space");
		await expect(page.getByRole("option", { name: "1. prijediplomski", exact: true })).toBeFocused();
		await page.keyboard.press("ArrowDown");
		await expect(page.getByRole("option", { name: "2. prijediplomski", exact: true })).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(studyYear).toContainText("2. prijediplomski");
		await page.goto(new URL("/dashboard", process.env.LOCAL_AUTH_URL).href);
		await expect(page).toHaveURL(/\/odabir-procesa$/);
		expect(errors).toEqual([]);
	});

	for (const role of ["administrator", "student"]) {
		for (const width of [1280, 390]) {
			test(`${role} help and logout dialogs at ${width}px`, async ({ page }) => {
				const errors = [];
				page.on("pageerror", (error) => errors.push(error.message));
				page.on("console", (message) => {
					if (message.type() === "warning" && /computed|Dialog|focus/i.test(message.text())) errors.push(message.text());
				});
				await page.setViewportSize({ width, height: 844 });
				await page.getByRole("button", { name: `Lokalni ${role}`, exact: true }).click();
				await expect(page).toHaveURL(role === "administrator" ? /\/dashboard$/ : /\/odabir-procesa$/);
				await page.goto(new URL("/profil", process.env.LOCAL_AUTH_URL).href);
				if (width < 1024) await page.getByRole("button", { name: "Navigacijski izbornik", exact: true }).click();
				const help = page.locator("nav").getByRole("button", { name: "Pomoć", exact: true });
				const dialog = page.getByRole("dialog", { name: "ℹ️ Upute za korištenje aplikacije", exact: true });
				for (const close of ["Escape", "Natrag"]) {
					await help.press("Enter");
					await expect(dialog).toBeVisible();
					await expect(dialog.getByText(role === "administrator" ? "Dashboard" : "Prijava na praksu", { exact: true })).toBeVisible();
					const back = dialog.getByRole("button", { name: "Natrag", exact: true });
					await back.focus();
					await page.keyboard.press("Tab");
					await expect(dialog.locator(":focus")).toHaveCount(1);
					if (close === "Escape") await page.keyboard.press("Escape");
					else await back.click();
					await expect(dialog).toHaveCount(0);
					await expect(help).toBeFocused();
				}
				await help.click();
				await dialog.getByText("Upute", { exact: true }).first().click();
				await expect(page).toHaveURL(/\/upute$/);
				await expect(dialog).toHaveCount(0);
				if (width < 1024) await page.getByRole("button", { name: "Navigacijski izbornik", exact: true }).click();
				const logout = page.locator("nav").getByRole("button", { name: "Odjava", exact: true }).last();
				await logout.click();
				const confirmation = page.getByRole("dialog", { name: "Jeste li sigurni da se želite odjaviti?", exact: true });
				await expect(confirmation).toBeVisible();
				await page.keyboard.press("Escape");
				await expect(confirmation).toHaveCount(0);
				await expect(logout).toBeFocused();
				await logout.click();
				await confirmation.getByRole("button", { name: "Odjava", exact: true }).click();
				await expect(page.locator("nav").getByRole("button", { name: "Odjava", exact: true })).toHaveCount(0);
				await page.goto(new URL("/profil", process.env.LOCAL_AUTH_URL).href);
				await expect(page).toHaveURL(/\/prijava$/);
				expect(errors).toEqual([]);
			});
		}
	}

	for (const [action, label, status] of [["accept", "Prihvati", "odobreno"], ["decline", "Odbij", "odbijeno"]]) {
		test(`assignment ${action} confirmation cancels without writes and persists on confirm`, async ({ page, request }) => {
			const api = "http://localhost:8082/api";
			const response = await request.get(`${api}/Zadaci_za_odabir`);
			expect(response.ok()).toBe(true);
			const assignment = (await response.json()).data.results.find((item) => item.id_zadatak === "Zadatak 2 - Demo poduzeće");
			expect(assignment).toBeTruthy();
			const setStatus = async (value) => {
				const result = await request.patch(`${api}/zadaci_za_odabir/odobrenje`, { data: { id_zadatak: assignment.id_zadatak, voditelj_odobrio: value } });
				expect(result.ok()).toBe(true);
			};
			const getStatus = async () => (await (await request.get(`${api}/Zadaci_za_odabir`, { params: { id: assignment.id } })).json()).data.voditelj_odobrio.value;
			assignmentToRestore = assignment;
			await setStatus("u razradi");
			await page.getByRole("button", { name: "Lokalni administrator", exact: true }).click();
			await expect(page).toHaveURL(/\/dashboard$/);
			await page.goto(new URL("/zadaci", process.env.LOCAL_AUTH_URL).href);
			const row = page.getByRole("row").filter({ has: page.getByRole("cell", { name: assignment.id_zadatak, exact: true }) });
			const trigger = row.getByRole("button").nth(action === "accept" ? 1 : 2);
			const dialog = page.getByRole("dialog", { name: "Potvrda akcije", exact: true });
			const writes = [];
			page.on("request", (req) => { if (req.method() === "PATCH" && req.url().endsWith("/zadaci_za_odabir/odobrenje")) writes.push(req.postDataJSON()); });
			for (const close of ["Natrag", "Escape", "outside"]) {
				await trigger.click();
				await expect(dialog).toContainText(assignment.id_zadatak);
				await expect(dialog.getByRole("button", { name: label, exact: true })).toBeFocused();
				await page.keyboard.press("Shift+Tab");
				await expect(dialog.locator(":focus")).toHaveCount(1);
				await page.keyboard.press("ArrowRight");
				await expect(dialog.getByRole("button", { name: "Natrag", exact: true })).toBeFocused();
				if (close === "Natrag") await dialog.getByRole("button", { name: close, exact: true }).click();
				else if (close === "Escape") await page.keyboard.press("Escape");
				else await page.mouse.click(5, 5);
				await expect(dialog).toHaveCount(0);
				await expect(trigger).toBeFocused();
				expect(writes).toEqual([]);
				expect(await getStatus()).toBe("u razradi");
			}
			await trigger.click();
			await dialog.getByRole("button", { name: label, exact: true }).click();
			await expect.poll(getStatus).toBe(status);
			await expect(dialog).toHaveCount(0);
			expect(writes).toEqual([{ id_zadatak: assignment.id_zadatak, voditelj_odobrio: status }]);
			await page.reload();
			await expect(row).toBeVisible();
		});
	}
});
