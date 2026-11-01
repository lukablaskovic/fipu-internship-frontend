const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { parse, compileScript } = require("@vue/compiler-sfc");
const { transformSync } = require("esbuild");
const vue = require("vue");

for (const name of ["Available", "New", "Rejected"]) {
	const source = readFileSync(`${__dirname}/../src/components/Tables/Table${name}Assignments.vue`, "utf8");
	const { descriptor } = parse(source);
	const { code } = transformSync(compileScript(descriptor, { id: name }).content, { format: "cjs" });
	const selected = [{ id_zadatak: 1 }, { id_zadatak: 2 }, { id_zadatak: 3 }];
	const mainStore = vue.reactive({
		checkedAssignments: [...selected],
		addAssignment(assignment) { this.checkedAssignments.push(assignment); },
		removeAssignment(assignment) { this.checkedAssignments = this.checkedAssignments.filter((item) => item.id_zadatak !== assignment.id_zadatak); },
	});
	const dependency = (name) => {
		if (name === "vue") return { ...vue, onMounted() {}, watch() {} };
		if (name === "@/composables/usePagination.js") return { usePagination: () => ({}) };
		if (name === "vue-router") return { useRoute: () => ({ params: {} }) };
		if (name === "@/main.js") return { mainStore, adminStore: {} };
		return {};
	};
	const module = { exports: {} };
	new Function("require", "module", "exports", code)(dependency, module, module.exports);
	const table = module.exports.default.setup({}, { expose() {} });
	assert.equal(table.assignmentLimitActive.value, false);
	table.checked(true, { id_zadatak: 4 });
	assert.equal(table.assignmentLimitActive.value, true, `${name}: open the limit dialog`);
	assert.deepEqual([...mainStore.checkedAssignments], selected, `${name}: reject the fourth assignment`);
	table.assignmentLimitActive.value = false;
	table.checked(false, selected[0]);
	table.checked(true, { id_zadatak: 4 });
	assert.deepEqual(mainStore.checkedAssignments.map((item) => item.id_zadatak), [2, 3, 4]);
	assert.equal(table.assignmentLimitActive.value, false, `${name}: allow selection after removing an assignment`);
}

console.log("Assignment-limit dialogs preserve selection validation in all three tables.");
