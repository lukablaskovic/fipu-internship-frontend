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
	assert.equal(state.suggestedFilters.value.length, 5);
	state.displayValue.value = "sj";
	assert.deepEqual(state.suggestedFilters.value.map((item) => item.prefix), ["jmbag:"]);
	state.displayValue.value = "poduzeće";
	assert.deepEqual(state.suggestedFilters.value.map((item) => item.prefix), ["company:"]);
	await state.insertPrefix("student:");
	assert.equal(state.suggestedFilters.value.length, 0);
	assert.equal(state.activeFilter.value.example, "Ana Anić");
	assert.equal(state.query.value, "student:");
	assert.equal(state.displayValue.value, "student:");
	assert.equal(state.open.value, true);
	state.displayValue.value = "student:ana";
	assert.equal(state.query.value, "student:ana");
	assert.deepEqual(state.filteredResults.value, [student]);
	await state.showHelp();
	assert.equal(state.query.value, "student:ana", "opening help must preserve the query");
	state.selectedValue.value = student;
	await vue.nextTick();
	assert.deepEqual(pushes, ["/studenti/42"]);
	assert.equal(state.query.value, "");
	state.displayValue.value = "dash";
	assert.deepEqual(state.filteredResults.value, ["dashboard"]);
	state.selectedValue.value = "dashboard";
	await vue.nextTick();
	assert.equal(pushes.at(-1), "/dashboard");
	await state.insertPrefix("jmbag:");
	let prevented = false;
	state.handleKeyDown({
		key: "Backspace",
		preventDefault() {
			prevented = true;
		},
	});
	assert.equal(state.query.value, "");
	assert.equal(prevented, true);
	const company = { naziv: "Digital Format" };
	const task = { id_zadatak: "42 - Web aplikacija" };
	state.allCompanies.value = [company];
	state.allAssignments.value = [task];
	for (const [keywords, term, expected, canonical] of [
		[["student", "studenti", "ime", "name", "s"], "Ana Anić", student, "student:"],
		[["jmbag", "sj"], "123", student, "jmbag:"],
		[["email", "e-mail", "eposta", "e-pošta", "e-posta", "se"], "ana@", student, "email:"],
		[["company", "poduzeće", "poduzece", "tvrtka", "poslodavac", "p"], "Digital Format", company, "company:"],
		[["task", "zadatak", "z"], "Web", task, "task:"],
	]) {
		for (const keyword of keywords) {
			state.query.value = ` ${keyword.toUpperCase()} : ${term}`;
			assert.equal(state.activeFilter.value.prefix, canonical);
			assert.deepEqual(state.filteredResults.value, [expected], keyword);
			state.query.value = keyword;
			assert.ok(state.suggestedFilters.value.some((item) => item.prefix === canonical), keyword);
			state.query.value = `${keyword}:`;
			state.handleKeyDown({ key: "Backspace", preventDefault() {} });
			assert.equal(state.query.value, "");
		}
	}
	state.query.value = "unknown:ana";
	assert.equal(state.activeFilter.value, undefined);
	assert.deepEqual(state.filteredResults.value, []);
	console.log("Reka search prefix entry, filtering, navigation and prefix deletion checks passed.");
})().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
