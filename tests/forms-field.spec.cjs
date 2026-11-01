const { mockStores } = require("./mock-stores.cjs");
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
	page.on("pageerror", (error) => {
		throw error;
	});
	await mockStores(page, { contentType: "application/javascript", body: `
 import {reactive} from '/node_modules/.vite/deps/vue.js';
 export const mainStore=reactive({userAuthenticated:true,userAdmin:false,currentUser:{ime:'Demo',prezime:'Student',email:'test@example.com',internship_process:{id:1}},academicYear:'2026./2027.',fetchCompanies:async()=>[1,2].map(id=>({id,naziv:"Test "+id,logo:[],web:"",OIB:"",adresa:"",maticni_broj:"",direktor:""})),fetchAvailableAssignments:async()=>[],logout(){}});
 export const studentStore=reactive({allocated_assignment:{id_zadatak:'Test',Poslodavac:[{value:'Test'}],opis_zadatka:'Test'},student_process_instance_data:{variables:{poslodavac_naziv:'Test',Alocirani_zadatak:'Test'},pending:[]},getInstanceInfo:async()=>({variables:{pdf_attachment_url:'#'}})});
 export const snackBarStore={pushMessage(){}}; export const adminStore={},styleStore={},layoutStore={};` });
	await page.route(/\/src\/helpers\/maps\.js/, (route) =>
		route.fulfill({ contentType: "application/javascript", body: "export const UserTaskMappings={getTaskProperty(){return null;}}; export const StudentMappings={getGodinaStudija(value){return value;}};" }),
	);
	await page.route(/\/src\/layouts\/Layout(?:Authenticated|Guest)\.vue/, (route) =>
		route.fulfill({ contentType: "application/javascript", body: "import {h} from '/node_modules/.vite/deps/vue.js';export default {setup(_, {slots}){return ()=>h('main',slots.default());}};" }),
	);
	await page.route(/\/src\/components\/Cardbox\/Card[Bb]oxAllocation\.vue/, (route) => route.fulfill({ contentType: "application/javascript", body: "export default {render(){return null;}}" }));
});

async function referencesAreValid(page) {
	const invalid = await page.locator("[aria-labelledby], [aria-describedby]").evaluateAll((elements) =>
		elements.flatMap((el) =>
			["aria-labelledby", "aria-describedby"].flatMap((attr) =>
				(el.getAttribute(attr) || "")
					.split(" ")
					.filter(Boolean)
					.filter((id) => !document.getElementById(id))
					.map((id) => ({ tag: el.tagName, attr, id })),
			),
		),
	);
	expect(invalid).toEqual([]);
	const duplicates = await page.locator("[id]").evaluateAll((elements) => elements.map((el) => el.id).filter((id, index, ids) => ids.indexOf(id) !== index));
	expect(duplicates).toEqual([]);
}

test("application fields have distinct labels and linked validation errors", async ({ page }) => {
	await page.goto("/tests/forms.html?view=application");
	await expect(page.getByRole("textbox", { name: "Ime", exact: true })).toBeDisabled();
	await expect(page.getByRole("textbox", { name: "Prezime", exact: true })).toBeDisabled();
	await page.getByRole("textbox", { name: "Ime mentora", exact: true }).fill("Ana");
	await page.getByRole("textbox", { name: "Prezime mentora", exact: true }).fill("Mentor");
	await page.getByRole("checkbox").check();
	await page.getByRole("button", { name: "Pošalji", exact: true }).click();
	const oib = page.getByRole("textbox", { name: "Vaš OIB" });
	await expect(oib).toHaveAttribute("aria-invalid", "true");
	await expect(oib).toHaveAccessibleDescription(/Polje je obavezno/);
	await oib.fill("123");
	await expect(oib).toHaveAccessibleDescription(/točno 11 brojeva/);
	await oib.fill("12345678901");
	await expect(oib).not.toHaveAttribute("aria-invalid", "true");
	await expect(page.getByRole("group", { name: "Datum početka", exact: true })).toHaveAttribute("aria-invalid", "true");
	await expect(page.getByRole("radiogroup", { name: "Praksu ću izvršavati" })).toHaveAttribute("aria-invalid", "true");
	await page.getByRole("radio", { name: "remote", exact: true }).click();
	await expect(page.getByRole("radiogroup", { name: "Praksu ću izvršavati" })).not.toHaveAttribute("aria-invalid", "true");
	await referencesAreValid(page);
	await page.setViewportSize({ width: 390, height: 844 });
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
	await oib.scrollIntoViewIfNeeded();
	await page.screenshot({ path: "/private/tmp/reka-student-fields-mobile.png" });
});

test("diary upload and date errors are accessible and update after selecting a PDF", async ({ page }) => {
	await page.goto("/tests/forms.html?view=diary");
	await page.getByRole("button", { name: "Predaj", exact: true }).click();
	const upload = page.getByLabel("PDF dnevnika prakse", { exact: true });
	await expect(upload).toHaveAttribute("type", "file");
	await expect(upload).toHaveAttribute("aria-invalid", "true");
	await expect(upload).toHaveAccessibleDescription("Stavka je obavezna");
	await upload.setInputFiles({ name: "dnevnik.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 test") });
	await expect(upload).not.toHaveAttribute("aria-invalid", "true");
	await expect(upload).toHaveAccessibleDescription("obavezno PDF format, maksimalno 10 MB");
	await expect(page.getByRole("group", { name: "Datum ispitnog roka", exact: true })).toHaveAccessibleDescription("Stavka je obavezna");
	await referencesAreValid(page);
});

test("shared controls preserve values, unique toggle IDs, select form data and file reset", async ({ page }) => {
	await page.goto("/tests/forms.html?view=controls");
	await page.getByRole("textbox", { name: "Tekst", exact: true }).fill("Test");
	await page.getByRole("combobox", { name: "Odabir", exact: true }).click();
	await page.getByRole("option", { name: "Prva", exact: true }).click();
	expect(await page.locator("form").evaluate((form) => new FormData(form).getAll("choice"))).toEqual(["Prva"]);
	await page.getByRole("checkbox", { name: "A", exact: true }).check();
	await page.getByRole("checkbox", { name: "B", exact: true }).check();
	await page.getByRole("switch", { name: "X", exact: true }).check();
	await expect(page.getByTestId("values")).toContainText('"checks":["a","b"]');
	await expect(page.getByTestId("values")).toContainText('"switches":["x"]');
	await referencesAreValid(page);
	await page.getByRole("button", { name: "Promijeni grešku", exact: true }).click();
	for (const roleAndName of [
		["textbox", "Tekst"],
		["combobox", "Odabir"],
		["group", "Datum"],
		["group", "Potvrde"],
		["group", "Postavke"],
	]) {
		const control = page.getByRole(roleAndName[0], { name: roleAndName[1], exact: true });
		await expect(control).toHaveAttribute("aria-invalid", "true");
		await expect(control).toHaveAccessibleDescription(/Neispravan unos/);
	}
	await page.getByRole("button", { name: "Promijeni grešku", exact: true }).click();
	await page.getByRole("button", { name: "Onemogući", exact: true }).click();
	await expect(page.getByRole("combobox", { name: "Odabir", exact: true })).toBeDisabled();
	await expect(page.getByRole("switch", { name: "X", exact: true })).toBeDisabled();
	expect(await page.locator("form").evaluate((form) => new FormData(form).getAll("choice"))).toEqual([]);
	const file = page.getByLabel("PDF", { exact: true });
	const pdf = { name: "test.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 test") };
	await file.setInputFiles(pdf);
	await expect(page.getByTestId("values")).toContainText("test.pdf");
	await page.getByRole("button", { name: "Očisti datoteku", exact: true }).click();
	await expect(file).toHaveValue("");
	await file.setInputFiles(pdf);
	await expect(page.getByTestId("values")).toContainText("test.pdf");
	await referencesAreValid(page);
});

test("dynamic forms and form examples use labelled Fields", async ({ page }) => {
	await page.goto("/tests/forms.html?view=dynamic");
	await page.getByRole("textbox", { name: "Komentar", exact: true }).fill("Test komentar");
	await page.getByRole("radiogroup", { name: "Odobrenje", exact: true }).getByRole("radio", { name: "Ne", exact: true }).click();
	await referencesAreValid(page);
	await page.goto("/tests/forms.html?view=examples");
	await expect(page.getByRole("textbox", { name: "Name", exact: true })).toBeVisible();
	await expect(page.getByRole("textbox", { name: "E-mail", exact: true })).toBeVisible();
	await page.getByRole("group", { name: "Checkbox", exact: true }).getByRole("checkbox", { name: "Ipsum", exact: true }).check();
	await page.getByRole("group", { name: "Switch", exact: true }).getByRole("switch", { name: "Two", exact: true }).check();
	await referencesAreValid(page);
});

test("process selection keeps JMBAG validation connected to its field", async ({ page }) => {
	await page.goto("/tests/forms.html?view=process");
	await page.getByRole("button", { name: /Nemam poduzeće/ }).click();
	await page.getByRole("button", { name: "Započni proces prakse", exact: true }).click();
	const jmbag = page.getByRole("textbox", { name: "JMBAG", exact: true });
	await expect(jmbag).toHaveAttribute("aria-invalid", "true");
	await expect(jmbag).toHaveAccessibleDescription("Polje je obavezno");
	await jmbag.fill("1234567890");
	await expect(jmbag).not.toHaveAttribute("aria-invalid", "true");
	const year = page.getByRole("combobox", { name: "Godina studija", exact: true });
	await year.click();
	await page.getByRole("option").last().click();
	await expect(year).toHaveAttribute("aria-labelledby", /reka-field-label-/);
	await referencesAreValid(page);
});


test("company editing labels each row without duplicate IDs", async ({ page }) => {
 await page.goto("/tests/forms.html?view=companies");
 await expect(page.getByRole("textbox", {name:"Naziv",exact:true})).toHaveCount(2);
 const websites=page.getByRole("textbox", {name:"Web mjesto",exact:true});
 await expect(websites).toHaveCount(2);
 await websites.first().fill("https://example.com");
 await expect(websites.last()).toHaveValue("");
 await referencesAreValid(page);
});
