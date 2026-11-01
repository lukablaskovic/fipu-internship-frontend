const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { parse, compileScript } = require("@vue/compiler-sfc");
const { transformSync } = require("esbuild");
const { createSSRApp, h } = require("vue");
const { renderToString } = require("vue/server-renderer");

async function renderLogin(dev, local) {
	const { descriptor } = parse(readFileSync(`${__dirname}/../src/views/common/LoginView.vue`, "utf8"));
	const compiled = compileScript(descriptor, { id: "dev-login-test", inlineTemplate: true });
	const componentModule = { exports: {} };
	const testRequire = (name) => {
		if (name === "@/config") return { DEV_MODE: dev, LOCAL_DEV: local };
		if (name === "@/main" || name === "@/helpers/validators") return {};
		if (name === "vue-router") return { useRouter: () => ({}) };
		if (name === "vue3-google-login") return { GoogleLogin: { render: () => h("button", "Google sign-in") } };
		if (name.endsWith("BaseButton.vue")) return { props: ["label"], render() { return h("button", this.label); } };
		if (name.endsWith("FormCheckRadio.vue")) return { props: ["name", "modelValue"], render() { return h("button", { role: "switch", "aria-label": this.name, "aria-checked": this.modelValue }); } };
		if (name.endsWith("SnackBar.vue")) return { render: () => null };
		if (name.startsWith("/")) return name;
		return require(name);
	};
	new Function("require", "module", "exports", transformSync(compiled.content, { format: "cjs" }).code)(testRequire, componentModule, componentModule.exports);
	const app = createSSRApp(componentModule.exports.default);
	app.component("RouterLink", { render() { return h("a", this.$slots.default()); } });
	return renderToString(app);
}

(async () => {
	for (const [dev, local] of [[true, true], [true, false], [false, false]]) {
		const html = await renderLogin(dev, local);
		assert.equal(html.includes("Testni podaci (lokalno)"), dev);
		if (dev) {
			assert.ok(html.indexOf('role="switch"') > html.indexOf("</main>"));
			assert.ok(html.includes('aria-checked="' + local + '"'));
			assert.ok(!html.includes('>Testni podaci (lokalno)<'));
		}
		assert.equal(html.includes("Lokalni student"), local);
		assert.equal(html.includes("Lokalni administrator"), local);
		assert.equal(html.includes("Google sign-in"), !local);
	}
	console.log("Login renders the mode switch only in dev and demo accounts only in local mode.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
