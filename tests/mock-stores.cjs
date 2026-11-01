// Share one fixture module across independently imported store definitions.
async function mockStores(page, response) {
	await page.route("**/tests/store-fixture.js", route => route.fulfill(response));
	const stores = { main: "Main", admin: "Admin", student: "Student", snackbar: "SnackBar", ui: "Ui" };
	for (const [file, name] of Object.entries(stores)) {
		const variable = file === "snackbar" ? "snackBarStore" : `${file}Store`;
		await page.route(`**/src/stores/${file}_store.ts`, route => route.fulfill({
			contentType: "application/javascript",
			body: `import * as fixture from '/tests/store-fixture.js'; export const use${name}Store = () => fixture.${variable} || {};`,
		}));
	}
	await page.route("**/src/services/baserow_client_api.ts", route => route.fulfill({
		contentType: "application/javascript",
		body: `import { mainStore } from '/tests/store-fixture.js';
			export const fetchAvailableAssignments = () => mainStore.fetchAvailableAssignments();
			export const submitNewInternshipProject = (data) => mainStore.submitNewInternshipProject(data);
			export * from '/src/services/baserow_client_api.ts?fixture-original';`,
	}));
}
module.exports = { mockStores };
