const { parse, compileScript } = require("@vue/compiler-sfc");
const { renderToString } = require("vue/server-renderer");
const assert = require("node:assert/strict");
const { transformSync } = require("esbuild");
const { readFileSync } = require("node:fs");
const { createSSRApp, h } = require("vue");

function load(file, inlineTemplate = true) {
	const { descriptor } = parse(readFileSync(`${__dirname}/../${file}`, "utf8"));
	const compiled = compileScript(descriptor, { id: file, inlineTemplate });
	const componentModule = { exports: {} };
	const testRequire = (name) => {
		if (name.endsWith("BaseIcon.vue")) return { render: () => null };
		if (name.endsWith("BaseButton.vue"))
			return {
				props: ["label"],
				render() {
					return h("button", this.$attrs, this.label);
				},
			};
		return require(name);
	};
	new Function("require", "module", "exports", transformSync(compiled.content, { format: "cjs" }).code)(testRequire, componentModule, componentModule.exports);
	return componentModule.exports.default;
}

(async () => {
	const file = "src/components/Form/FormCombobox.vue";
	const Combobox = load(file);
	const render = (component, props) => renderToString(createSSRApp({ render: () => h(component, props) }));
	const html = await render(Combobox, { modelValue: "", list: [], disabled: true, important: true });
	assert.match(html, /role="combobox"/);
	assert.match(html, /aria-invalid="true"/);
	assert.match(html, /<input[^>]*disabled/);
	assert.match(html, /aria-describedby="[^"]+"/);

	const Logic = load(file, false);
	const list = [
		{ id: 1, label: "Digital Format" },
		{ id: 2, label: "FIPU" },
	];
	let observed;
	Logic.render = (_ctx, _cache, _props, setup) => {
		setup.search = "DIGITALFORMAT";
		observed = { filtered: setup.filteredList, label: setup.displayValue(2), value: setup.itemValue(list[0]) };
		setup.search = "missing";
		observed.empty = setup.filteredList;
		setup.search = "";
		observed.all = setup.filteredList;
		setup.search = "FIPU";
		observed.selected = setup.filteredList;
		return h("span");
	};
	await render(Logic, { list, labelName: "label", emitName: "id", modelValue: 2 });
	assert.deepEqual(observed.filtered, [list[0]]);
	assert.equal(observed.label, "FIPU");
	assert.equal(observed.value, 1);
	assert.deepEqual(observed.empty, []);
	assert.deepEqual(observed.all, list);
	assert.deepEqual(observed.selected, list);

	const Menu = load("src/components/Premium/ButtonMenu.vue");
	const menu = await render(Menu, { label: "Actions", options: [[]], disabled: true });
	assert.equal((menu.match(/<button\b/g) || []).length, 1, "trigger must not nest buttons");
	assert.match(menu, /aria-haspopup="menu"/);
	assert.match(menu, /disabled/);
	console.log("Reka combobox filtering, labels, disabled/error semantics and menu trigger checks passed.");
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
