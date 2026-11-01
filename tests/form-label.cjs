const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { parse, compileScript } = require("@vue/compiler-sfc");
const { transformSync } = require("esbuild");
const { createSSRApp, h } = require("vue");
const { renderToString } = require("vue/server-renderer");

const { descriptor } = parse(readFileSync(`${__dirname}/../src/components/Form/FormField.vue`, "utf8"));
const compiled = compileScript(descriptor, { id: "form-label-test", inlineTemplate: true });
const componentModule = { exports: {} };
const testRequire = (name) => {
	if (name.endsWith("FormFieldHelp.vue")) return { render: () => null };
	if (name.endsWith("colorsPremium.js")) return { controlTextColor: () => "" };
	return require(name);
};
new Function("require", "module", "exports", transformSync(compiled.content, { format: "cjs" }).code)(testRequire, componentModule, componentModule.exports);

(async () => {
	const render = (label) => renderToString(createSSRApp({
		render: () => h(componentModule.exports.default, { label }, { default: () => h("input") }),
	}));
	const html = await render('Name * <img src=x onerror="alert(1)"> *');
	assert.equal((html.match(/class="text-red-500"/g) || []).length, 2);
	assert.ok(html.includes("&lt;img"));
	assert.ok(!html.includes("<img"));
	assert.ok(!(await render(null)).includes("<label"));
	console.log("Form labels escape HTML and preserve required markers.");
})().catch((error) => { console.error(error); process.exitCode = 1; });
