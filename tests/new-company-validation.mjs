import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, effectScope, nextTick, reactive, ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, numeric } from "@vuelidate/validators";

const source = readFileSync(new URL("../src/components/Tables/TableNewCompanies.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
const emptyCompany = (id) => ({ id, naziv: `Company ${id}`, web: "", direktor: "", maticni_broj: "", OIB: "", adresa: "" });
let saved = 0;
const scope = effectScope();
const table = scope.run(() => runInNewContext(`${script}\n({ refreshCompanies, previewCompany, saveUpdatedCompany, companyForms, confirmationModal, v$ })`, {
	computed, ref, reactive, watch, useVuelidate, required, helpers, numeric,
	defineProps: () => ({}), onMounted: () => {},
	useRoute: () => ({ params: {} }),
	useMainStore: () => ({ fetchCompanies: async () => [emptyCompany(1), emptyCompany(2)] }),
	useAdminStore: () => ({ saveUpdatedCompany: async () => { saved++; return true; } }),
	useSnackBarStore: () => ({ pushMessage: () => {} }),
	usePagination: () => ({}), Utils: { isArrayEmpty: (rows) => !rows.length },
}));
try {
	await table.refreshCompanies();
	await nextTick();
	await table.previewCompany(1);
	assert.equal(table.confirmationModal.value.isActive, false, "Empty fields block confirmation");
	assert.equal(table.v$.value[1].web.$error, true, "Missing fields show validation errors");
	Object.assign(table.companyForms.value[1], { web: "https://example.com", direktor: "Test", maticni_broj: "abc", OIB: "12345678901", adresa: "Test address" });
	await table.previewCompany(1);
	assert.equal(table.confirmationModal.value.isActive, false, "Invalid numeric fields block confirmation");
	table.companyForms.value[1].maticni_broj = "12345";
	await table.previewCompany(1);
	assert.equal(table.confirmationModal.value.isActive, true, "Valid row opens confirmation despite another empty row");
	table.companyForms.value[1].adresa = "";
	await table.saveUpdatedCompany();
	assert.equal(saved, 0, "Save rechecks the selected row");
	table.companyForms.value[1].adresa = "Test address";
	await table.saveUpdatedCompany();
	assert.equal(saved, 1, "Other incomplete companies do not block saving this row");
	console.log("New company validation checks passed.");
} finally {
	scope.stop();
}
