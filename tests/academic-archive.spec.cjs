const { test, expect } = require("@playwright/test");

test("academic archives switch years, preserve read-only records and download documents", async ({ page }) => {
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.addInitScript(() => {
		sessionStorage.setItem("dev-data-mode", "local");
		sessionStorage.setItem("token", JSON.stringify({ email: "admin@local.test" }));
		sessionStorage.setItem("main", JSON.stringify({ userAuthenticated: true, userAdmin: true, currentUser: { email: "admin@local.test", name: "Demo Admin", internship_process: {} } }));
	});
	const fileId = "a".repeat(64);
	const tables = { Student: 1, Dnevnik_prakse: 2 };
	await page.route("http://localhost:8082/api/**", (route) => {
		const url = route.request().url();
		if (url.includes("/files/")) return route.fulfill({ body: "synthetic document", contentType: "application/octet-stream" });
		if (url.endsWith("/academic-years")) return route.fulfill({ json: { active_year: "2026/2027", years: ["2024/2025", "2025/2026"].map((year, i) => ({ year, key: year.replace("/", "-"), database_id: 90 + i, tables })) } });
		if (url.includes("/academic-years/")) {
			const year = url.endsWith("2024-2025") ? "2024/2025" : "2025/2026";
			return route.fulfill({ json: { year, captured_at: "2026-11-01T12:00:00Z", missing_history: ["missing"],
				tables: { Student: [{ id: 1, JMBAG: "0000000001", ime: "Demo", prezime: year === "2024/2025" ? "Old" : "Recent", process_instance_id: "missing" }], Dnevnik_prakse: [{ id: 2, id_dnevnik_prakse: "Diary", Student: [{ id: 1, value: "0000000001" }], dnevnik_prakse_upload: [{ url: "file-a", visible_name: "demo.pdf" }] }] },
				fields: { Student: [{ id: 1, name: "JMBAG", primary: true }, { id: 2, name: "ime" }], Dnevnik_prakse: [{ id: 3, name: "id_dnevnik_prakse", primary: true }] }, events: [], documents: [{ id: fileId, source_url: "file-a", name: "demo.pdf", available: true }],
			} });
		}
		return route.fulfill({ json: { data: { results: [] } } });
	});
	await page.goto("/arhiva");
	await expect(page.getByRole("heading", { name: "Arhiva akademskih godina" })).toBeVisible();
	await page.getByRole("button", { name: /Demo Recent/ }).click();
	await expect(page.getByText("Povijest ovog procesa nije dostupna", { exact: false })).toBeVisible();
	await page.getByRole("button", { name: "Dnevnik_prakse: Diary" }).click();
	const downloadPromise = page.waitForEvent("download");
	await page.getByRole("button", { name: "demo.pdf", exact: true }).click();
	expect((await downloadPromise).suggestedFilename()).toBe("demo.pdf");
	await page.getByRole("combobox", { name: "Akademska godina" }).click();
	await page.getByRole("option", { name: "2024/2025" }).click();
	await page.getByRole("combobox", { name: "Tablica" }).click();
	await page.getByRole("option", { name: "Student", exact: true }).click();
	await expect(page.getByRole("button", { name: /Demo Old/ })).toBeVisible();
	await expect(page.getByRole("button", { name: /Spremi|Obriši|Pokreni/ })).toHaveCount(0);
	await expect(page.getByRole("link", { name: "Otvori godinu u lokalnom Baserowu" })).toHaveAttribute("href", "http://localhost:8085/database/90/table/1");
	expect(errors).toEqual([]);
});
