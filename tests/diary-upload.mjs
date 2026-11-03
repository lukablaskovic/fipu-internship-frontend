import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, nextTick, reactive, ref } from "vue";
import { required, helpers } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const source = readFileSync(new URL("../src/components/Internship/Student_DnevnikPrakseForm.vue", import.meta.url), "utf8");
const setup = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;$/gm, "");
let submissions = 0;
const studentStore = {
	student_process_instance_data: { pending: ["predavanje_dnevnika_student"] },
	async submitDiaryForm() {
		submissions++;
		throw Object.assign(new Error(), { response: { status: 413 } });
	},
};
const { form, v$, submit_diary_form, serverSizeError } = runInNewContext(
	setup + "\n({ form, v$, submit_diary_form, serverSizeError })",
	{ computed, reactive, ref, required, helpers, useVuelidate, onMounted() {}, useStudentStore: () => studentStore, useMainStore: () => ({}), useSnackBarStore: () => ({}) },
);
const pdf = { name: "dnevnik.pdf", type: "application/pdf", size: 512 * 1024 };
form.dnevnik_attachment = { ...pdf, size: 10 * 1024 * 1024 + 1 };
form.potvrda_attachment = pdf;
form.prijavljen_rok = "2026-11-05";
await nextTick();
assert.match(v$.value.dnevnik_attachment.$errors[0].$message, /prevelika/);
await submit_diary_form();
assert.equal(submissions, 0);
form.dnevnik_attachment = { ...pdf, type: "image/png" };
assert.match(v$.value.dnevnik_attachment.$errors[0].$message, /PDF/);
form.dnevnik_attachment = pdf;
form.potvrda_attachment = null;
assert.equal(v$.value.potvrda_attachment.$invalid, true);
form.potvrda_attachment = pdf;
await submit_diary_form();
assert.equal(submissions, 1);
assert.match(serverSizeError.value, /ograničenje veličine/);
assert.equal(form.potvrda_attachment.name, pdf.name);
