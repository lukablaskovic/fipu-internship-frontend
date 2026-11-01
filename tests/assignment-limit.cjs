const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { parse, compileScript } = require("@vue/compiler-sfc");
const { transformSync } = require("esbuild");
const vue = require("vue");

for (const name of ["Available"]) {
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
		if (name === "vue") return { ...vue, useModel: () => vue.ref([]), onMounted() {}, watch() {} };
		if (name === "@/composables/usePagination.js") return { usePagination: () => ({}) };
		if (name === "vue-router") return { useRoute: () => ({ params: {} }) };
		if (name === "@/stores/main_store") return { useMainStore: () => mainStore };
		if (name === "@/stores/snackbar_store") return { useSnackBarStore: () => ({}) };
		if (name === "@/stores/admin_store") return { useAdminStore: () => ({}) };
		return {};
	};
	const module = { exports: {} };
	new Function("require", "module", "exports", code)(dependency, module, module.exports);
	const table = module.exports.default.setup({}, { expose() {} });
	table.checkedAssignments.value = [...selected];
	assert.equal(table.assignmentLimitActive.value, false);
	table.checked(true, { id_zadatak: 4 });
	assert.equal(table.assignmentLimitActive.value, true, `${name}: open the limit dialog`);
	assert.deepEqual([...table.checkedAssignments.value], selected, `${name}: reject the fourth assignment`);
	table.assignmentLimitActive.value = false;
	table.checked(false, selected[0]);
	table.checked(true, { id_zadatak: 4 });
	assert.deepEqual(table.checkedAssignments.value.map((item) => item.id_zadatak), [2, 3, 4]);
	assert.equal(table.assignmentLimitActive.value, false, `${name}: allow selection after removing an assignment`);
}

console.log("Assignment-limit dialogs preserve selection validation in the available-assignment table.");
