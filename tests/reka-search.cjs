const { parse, compileScript } = require("@vue/compiler-sfc");
const assert = require("node:assert/strict");
const { transformSync } = require("esbuild");
const { readFileSync } = require("node:fs");
const vue = require("vue");
const pushes = [];
const student = { ime: "Ana", prezime: "Anić", JMBAG: "123", email: "ana@example.com", process_instance_data: { id: 42 } };
const stores = { adminStore: { students: [student] }, mainStore: {} };
function evaluate(source, dependency) {
	const module = { exports: {} };
	new Function("require", "module", "exports", transformSync(source, { format: "cjs" }).code)(dependency, module, module.exports);
	return module.exports;
}
const helpers = evaluate(readFileSync(`${__dirname}/../src/helpers/search-utils.js`, "utf8"), require);
const { descriptor } = parse(readFileSync(`${__dirname}/../src/components/SearchOptions.vue`, "utf8"));
const component = evaluate(compileScript(descriptor, { id: "search-state" }).content, (name) => {
	if (name === "vue") return { ...vue, onMounted() {}, onUnmounted() {} };
	if (name === "@/main") return stores;
	if (name === "@/router") return { router: { push: (value) => pushes.push(value) } };
	if (name.endsWith("search-utils.js")) return helpers;
	if (name.endsWith(".vue")) return {};
	return require(name);
}).default;
(async () => {
	const state = component.setup({}, { expose() {} });
	await state.insertPrefix("s:");
	assert.equal(state.query.value, "s:");
	assert.equal(state.displayValue.value, "");
	assert.equal(state.open.value, true);
	state.displayValue.value = "ana";
	assert.equal(state.query.value, "s:ana");
	assert.deepEqual(state.filteredResults.value, [student]);
	state.selectedValue.value = student;
	await vue.nextTick();
	assert.deepEqual(pushes, ["/studenti/42"]);
	assert.equal(state.query.value, "");
	state.displayValue.value = "dash";
	assert.deepEqual(state.filteredResults.value, ["dashboard"]);
	state.selectedValue.value = "dashboard";
	await vue.nextTick();
	assert.equal(pushes.at(-1), "/dashboard");
	await state.insertPrefix("sj:");
	let prevented = false;
	state.handleKeyDown({
		key: "Backspace",
		preventDefault() {
			prevented = true;
		},
	});
	assert.equal(state.query.value, "");
	assert.equal(prevented, true);
	console.log("Reka search prefix entry, filtering, navigation and prefix deletion checks passed.");
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
