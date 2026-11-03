const assert = require("node:assert/strict");
const { createServer } = require("vite");
const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { createServer: createHttpServer } = require("node:http");
const { createSSRApp, createRenderer, h, reactive, ref, nextTick } = require("vue");
const { renderToString } = require("vue/server-renderer");

(async () => {
	const storage = new Map();
	global.sessionStorage = { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value), clear: () => storage.clear() };
	global.window = { location: { origin: "http://localhost:5173" } };
	const cacheDir = mkdtempSync(join(tmpdir(), "fipu-ui-reuse-test-"));
	const server = await createServer({
		cacheDir,
		server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: "custom",
		plugins: [{
			name: "test-company-store",
			load(id) {
				if (id.endsWith("/src/stores/main_store.ts")) return "export const useMainStore = () => globalThis.companyLogoTestStore;";
			},
		}],
	});
	try {
		const load = async path => (await server.ssrLoadModule(`/src/${path}`)).default;
		const render = (component, props, slots) => renderToString(createSSRApp({ render: () => h(component, props, slots) })).then(html => html.replace(/<!--[\s\S]*?-->/g, ""));
		const Pagination = await load("components/Tables/TablePagination.vue");
		assert.match(await render(Pagination, { page: 1, perPage: 10, total: 25 }), /Stranica 2 od 3/);
		assert.match(await render(Pagination, { page: 0, perPage: 10, total: 25 }), /pagination-page-size/);
		assert.doesNotMatch(await render(Pagination, { page: 0, perPage: 5, total: 10, showPerPage: false }), /pagination-page-size/);
		assert.match(await render(Pagination, { page: 0, perPage: 10, total: 2 }, { default: () => "2 od 8 zadataka · " }), /2 od 8 zadataka · Stranica 1 od 1/);
		assert.doesNotMatch(await render(Pagination, { page: 0, perPage: 10, total: 0 }), /Stranica|<button/);

		const SortHeader = await load("components/Tables/SortableTableHeader.vue");
		for (const [active, direction, aria] of [[false, "asc", "none"], [true, "asc", "ascending"], [true, "desc", "descending"]]) {
			const html = await render(SortHeader, { label: "Ime", active, direction });
			assert.match(html, new RegExp(`scope="col" aria-sort="${aria}"`));
			assert.match(html, /<button type="button"/);
			assert.match(html, /Ime/);
		}
		const { appConfig, internshipContacts, endpoints } = await server.ssrLoadModule("/src/config.js");
		assert.equal(endpoints.VITE_FRONTEND_URL, "http://localhost:5173");
		const header = await render(await load("components/Internship/InternshipPageHeader.vue"));
		assert.match(header, /Moja Praksa/);
		assert.ok(header.includes(appConfig.academicYear) && header.includes(appConfig.voditelj_prakse));
		const Contact = await load("components/User/ContactCard.vue");
		for (const contact of internshipContacts) {
			const html = await render(Contact, { contact });
			assert.ok(html.includes(contact.name) && html.includes(contact.email) && html.includes(contact.role));
			assert.ok(html.includes(`href="mailto:${contact.email}"`));
			assert.equal(html.includes("+385"), !!contact.phone);
		}
		const Footer = await load("components/FooterBar.vue");
		assert.match(await render(Footer), /Made with/);
		assert.doesNotMatch(await render(Footer, {}, { default: () => "Custom credit" }), /Made with/);
		const Overlay = await load("components/LoadingOverlay.vue");
		assert.equal((await render(Overlay)).match(/class="loader /g).length, 1);
		assert.doesNotMatch(await render(Overlay, { isActive: false }), /loader|Učitavanje/);

		let resolveCompanies, resolveCompany;
		let requests = 0;
		global.companyLogoTestStore = reactive({
			allCompanies: [],
			fetchCompanies: () => new Promise(resolve => { resolveCompanies = resolve; }),
			fetchCompany: () => { requests++; return new Promise(resolve => { resolveCompany = resolve; }); },
		});
		const { useCompanyLogos } = await server.ssrLoadModule("/src/composables/useCompanyLogos.js");
		const { DEFAULT_COMPANY_LOGO } = await server.ssrLoadModule("/src/helpers/company-logo.js");
		const known = { Poslodavac: [{ id: 1, value: "Known" }] };
		const missing = { Poslodavac: [{ id: 2, value: "Missing" }] };
		const selected = ref([known, missing, { ...missing }]);
		let logos;
		const renderer = createRenderer({ insert() {}, remove() {}, createComment: () => ({}), parentNode() {}, nextSibling() {} });
		const app = renderer.createApp({ setup() { logos = useCompanyLogos(selected); return () => null; } });
		app.mount({});
		const flush = async () => { await nextTick(); await new Promise(setImmediate); };
		assert.equal(requests, 0, "Wait for the initial company list");
		assert.equal(logos.getCompanyLogo({}), DEFAULT_COMPANY_LOGO);
		resolveCompanies([{ id: 1, naziv: "Known", logo: [{ url: "/known.svg" }] }]);
		await flush();
		assert.equal(logos.getCompanyLogo(known), "/known.svg");
		assert.equal(requests, 1, "Deduplicate requests for the same company");
		assert.equal(logos.getCompanyLogo(missing), DEFAULT_COMPANY_LOGO);
		resolveCompany({ id: 2, naziv: "Missing", logo: [{ url: "/loaded.svg" }] });
		await flush();
		assert.equal(logos.getCompanyLogo(missing), "/loaded.svg");
		assert.equal(global.companyLogoTestStore.allCompanies.length, 2);
		selected.value = [missing, known];
		await flush();
		assert.equal(requests, 1, "Reuse loaded logos when the selection changes");
		selected.value = [{ Poslodavac: [{ id: 3, value: "No logo" }] }];
		await flush();
		resolveCompany(null);
		await flush();
		assert.equal(logos.getCompanyLogo(selected.value[0]), DEFAULT_COMPANY_LOGO);
		app.unmount();
		console.log("Shared UI checks passed: pagination, accessible sort headers, internship metadata, contacts, footer, spinner and reactive company logo loading.");
	} finally {
		await server.close();
		rmSync(cacheDir, { recursive: true, force: true });
		delete global.companyLogoTestStore;
		delete global.sessionStorage;
		delete global.window;
	}
})().catch(error => { console.error(error); process.exitCode = 1; });
