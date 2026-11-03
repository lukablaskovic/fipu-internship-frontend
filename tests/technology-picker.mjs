import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { computed, effectScope, nextTick, reactive, ref, toRefs, watch } from "vue";

const require = createRequire(import.meta.url);
const devicons = require("devicon/devicon.json");
const iconSources = Object.fromEntries(devicons.flatMap((icon) => icon.versions.svg.map((version) => {
	const path = `/node_modules/devicon/icons/${icon.name}/${icon.name}-${version}.svg`;
	assert.ok(existsSync(new URL(`..${path}`, import.meta.url)), `Missing icon: ${path}`);
	return [path, path];
})));
const script = (path) => readFileSync(new URL(path, import.meta.url), "utf8").match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "").replace(/^const iconSources = import.meta.glob.*;\n/gm, "");
const scope = effectScope();

try {
	const selected = ref([]);
	const props = reactive({ disabled: false });
	const picker = runInNewContext(`${script("../src/components/Form/FormTechnologyPicker.vue")}\n({ technologies, search, filteredTechnologies, removeTechnologies, searchInput })`, {
		computed, nextTick, ref, devicons, iconSources,
		defineProps: () => props,
		defineModel: () => selected,
		injectFieldRootContext: () => null,
		normalizeString: (value) => value.toLowerCase().replace(/\s+/g, "").trim(),
	});
	assert.ok(picker.technologies.length > 600);
	assert.equal(new Set(picker.technologies.map((technology) => technology.label)).size, picker.technologies.length);
	for (const technology of picker.technologies) assert.ok(technology.icon?.endsWith(".svg"), `Missing icon: ${technology.label}`);
	for (const [query, label] of [["pYtHoN", "Python"], ["vue js", "Vue.js"], ["cpp", "C++"], [".net", ".NET"]]) {
		picker.search.value = query;
		assert.ok(picker.filteredTechnologies.value.some((technology) => technology.label === label), `Search: ${query}`);
	}
	picker.search.value = "Unknown internal framework";
	assert.equal(picker.filteredTechnologies.value.length, 0);
	selected.value = ["Python", "Vue.js"];
	props.disabled = true;
	picker.removeTechnologies(["Python"]);
	assert.equal(selected.value.length, 2);
	props.disabled = false;
	picker.removeTechnologies(["Python"]);
	assert.deepEqual(selected.value, ["Vue.js"]);
	let focusCount = 0;
	picker.searchInput.value = { $el: { focus: () => focusCount++ } };
	selected.value = ["Python", "Vue.js", "PHP"];
	picker.removeTechnologies(["Python", "Vue.js"]);
	assert.deepEqual(selected.value, ["PHP"]);
	picker.removeTechnologies(["PHP"]);
	await nextTick();
	assert.equal(selected.value.length, 0);
	assert.equal(focusCount, 1);

	const submissions = [];
	let acceptSubmission = true;
	const form = scope.run(() => runInNewContext(`${script("../src/views/NewAssignmentFormPublic.vue")}\n({ form, selectedTechnologies, currentStep, onSubmit, resetForm })`, {
		computed, reactive, ref, watch, nextTick, toRefs,
		onMounted: () => {},
		useMainStore: () => ({ fetchCompanies: async () => [] }),
		useSnackBarStore: () => ({ pushMessage: () => {} }),
		useVuelidate: () => ref({ $touch: () => {}, $reset: () => {}, $invalid: false }),
		helpers: { withMessage: () => ({}), regex: () => ({}) },
		required: {}, email: {},
		submitNewInternshipProject: async (payload) => { submissions.push(payload); return acceptSubmission ? { status: "OK" } : null; },
	}));
	for (const [choices, custom, expected] of [
		[[], "", ""],
		[["Python", "Vue.js"], "", "Python, Vue.js"],
		[[], "  Internal framework, version 2\nCustom tooling  ", "Internal framework, version 2\nCustom tooling"],
		[["Python", "Vue.js"], "  Internal framework  ", "Python, Vue.js, Internal framework"],
	]) {
		form.selectedTechnologies.value = choices;
		form.form.preferirane_tehnologije = custom;
		form.currentStep.value = 4;
		await form.onSubmit();
		assert.equal(submissions.at(-1).preferirane_tehnologije, expected);
		assert.equal(form.selectedTechnologies.value.length, 0);
		assert.equal(form.form.preferirane_tehnologije, "");
		assert.equal(form.currentStep.value, 1);
	}
	acceptSubmission = false;
	form.selectedTechnologies.value = ["Python"];
	form.form.preferirane_tehnologije = "Internal framework";
	form.currentStep.value = 4;
	await form.onSubmit();
	assert.equal(form.selectedTechnologies.value[0], "Python");
	assert.equal(form.form.preferirane_tehnologije, "Internal framework");
	form.resetForm(false);
	assert.equal(form.selectedTechnologies.value.length, 0);
	assert.equal(form.form.preferirane_tehnologije, "");
	console.log("Technology picker: catalog icons, search, removal, disabled state, combined string payload, reset and failed submission passed.");
} finally {
	scope.stop();
}
