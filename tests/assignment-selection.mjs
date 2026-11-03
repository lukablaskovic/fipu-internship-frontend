import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, effectScope, nextTick, reactive, ref, toRefs, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";

const source = readFileSync(new URL("../src/views/NewAssignmentFormPublic.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
const binding = source.match(/<FormCheckRadioGroup v-model="([^"]+)" name="selekcija_selection"/)[1];
const model = binding.includes(".") ? binding : `${binding}.value`;
const submissions = [];
const scope = effectScope();

try {
	const page = scope.run(() => runInNewContext(`${script}\n({ form, v$, currentStep, partnerType, onSubmit, resetForm, getSelection: () => ${model}, setSelection: value => { ${model} = value; } })`, {
		computed, nextTick, reactive, ref, toRefs, watch, useVuelidate, email, helpers, required,
		onMounted: () => {},
		useMainStore: () => ({ fetchCompanies: async () => [] }),
		useSnackBarStore: () => ({ pushMessage: () => {} }),
		submitNewInternshipProject: async payload => { submissions.push(payload); return { status: "OK" }; },
	}));
	assert.equal(page.getSelection(), "false", "The initial Ne option must match the radio's string key");
	assert.equal(page.form.selekcija, false);
	assert.equal(page.v$.value.proces_selekcije.$invalid, false);

	for (const value of ["true", "false", "true"]) {
		page.setSelection(value);
		await nextTick();
		assert.equal(page.getSelection(), value, "The selected option must stay checked after Vue updates");
		assert.equal(page.form.selekcija, value === "true", "Keep the boolean used by the description and API");
		assert.equal(page.v$.value.proces_selekcije.$invalid, value === "true", "Require a description only for Da");
	}

	for (const value of ["true", "false"]) {
		page.partnerType.value = "Prijavljujem zadatak kao postojeći partner s Fakultetom";
		await nextTick();
		Object.assign(page.form, {
			Poslodavac: "Test partner", poslodavac_email: "test@example.com", opis_zadatka: "Test task",
			broj_studenata: 1, trajanje_sati: 90, lokacija: "Remote", zeljeno_okvirno_vrijeme_pocetka: "Studeni",
			angazman_selekcija: "false", proces_selekcije: "Intervju",
		});
		page.setSelection(value);
		page.currentStep.value = 4;
		await page.onSubmit();
		assert.equal(submissions.length, value === "true" ? 1 : 2);
		assert.equal(submissions.at(-1).selekcija, value === "true");
		assert.equal(submissions.at(-1).proces_selekcije, value === "true" ? "Intervju" : "Nema");
		assert.equal(page.getSelection(), "false", "Submission reset must restore the Ne option");
	}
	page.setSelection("true");
	page.resetForm(false);
	await nextTick();
	assert.equal(page.getSelection(), "false");
	assert.equal(page.form.proces_selekcije, "");
	assert.equal(page.v$.value.proces_selekcije.$invalid, false);
	console.log("Assignment selection: radio values, toggling, conditional validation, boolean payloads and reset passed.");
} finally {
	scope.stop();
}
