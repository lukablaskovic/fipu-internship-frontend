const assert = require("node:assert/strict");
const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { createServer: createHttpServer } = require("node:http");
const { createServer } = require("vite");
const { createSSRApp, h } = require("vue");
const { renderToString } = require("vue/server-renderer");
const { createRouter, createMemoryHistory } = require("vue-router");

(async () => {
	const cacheDir = mkdtempSync(join(tmpdir(), "fipu-link-test-"));
	const server = await createServer({
		cacheDir,
		server: { middlewareMode: true, hmr: { server: createHttpServer() } },
		appType: "custom",
	});
	try {
		const { default: IconTextLink } = await server.ssrLoadModule("/src/components/IconTextLink.vue");
		const { routes } = await server.ssrLoadModule("/src/router/routes.js");
		const router = createRouter({
			history: createMemoryHistory(),
			routes: routes.map(route => ({ ...route, component: { render: () => null } })),
		});
		await router.push("/upute");
		for (const [to, text] of [["/poslodavci/novi-zadatak", "Prijava zadatka"], ["/poslodavci", "Poslodavci"], ["/moja-praksa", "Moja praksa"]]) {
			const app = createSSRApp({ render: () => h(IconTextLink, { to, text, icon: "M0 0" }) });
			app.use(router);
			const html = await renderToString(app);
			assert.match(html, /^<a\s/);
			assert.ok(html.includes(`href="${to}"`));
			assert.ok(html.includes(text));
			assert.match(html, /aria-hidden="true"/);
			assert.equal(router.resolve(to).matched.length, 1);
		}
		const canonical = router.resolve("/poslodavci/novi-zadatak");
		const alias = router.resolve("/novi-zadatak");
		assert.equal(alias.name, canonical.name);
		assert.equal(alias.matched[0].aliasOf, canonical.matched[0]);
		assert.equal(alias.meta.requiresAuth, false);
		assert.equal(alias.meta.requiresAdmin, false);
		console.log("Instruction links render accessible anchors with valid routes; /novi-zadatak opens the public assignment form.");
	} finally {
		await server.close();
		rmSync(cacheDir, { recursive: true, force: true });
	}
})().catch(error => { console.error(error); process.exitCode = 1; });
