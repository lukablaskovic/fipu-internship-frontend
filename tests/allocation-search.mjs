import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, nextTick, ref, watch } from "vue";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const script = read("../src/components/Tables/TableAllocations.vue").split("<script setup>")[1].split("</script>")[0].replace(/^import .*;$/gm, "");
const { compareValues } = await import("../src/helpers/available-assignment-search.mjs");
const { normalizeString } = await import("../src/helpers/search-utils.js");
const { usePagination } = await import("../src/composables/usePagination.js");
const table = runInNewContext(script + "\n({ allocations, search, currentPage, allocationsPaginated, sortBy, modelFilter, versionFilter, statusFilter, versionOptions })", {
	computed, ref, watch, compareValues, normalizeString, usePagination, defineProps() {}, onMounted() {},
	useMainStore: () => ({ userAdmin: true }), useAdminStore() {}, useStudentStore() {},
	StudentMappings: { getStatusProperty: value => value },
});
const target = { ime: "Iva", prezime: "Marić", JMBAG: "00123", Alocirani_zadatak: "Razvoj aplikacije", process_instance_id: "process-123" };
table.allocations.value = [...Array(10).fill({ ime: "Marko" }), target];
table.currentPage.value = 1;
for (const query of [" IVA marić ", "00123", "APLIKACIJE", "process-123"]) {
	table.search.value = query;
	await nextTick();
	assert.equal(table.currentPage.value, 0);
	assert.deepEqual(table.allocationsPaginated.value, [target]);
}
table.search.value = "bez rezultata";
assert.equal(table.allocationsPaginated.value.length, 0);
table.search.value = "";
assert.equal(table.allocationsPaginated.value.length, 10);

const ana = { ime: "Ana", prezime: "Žanić", model: "A", modelVersion: 2, status_zahtjeva: { value: "prihvaćen" } };
const iva = { ...ana, ime: "Iva", prezime: "Anić", modelVersion: 10 };
table.allocations.value = [iva, ana, { ...ana, model: "B" }, { ...ana, status_zahtjeva: { value: "odbijen" } }];
assert.deepEqual(Array.from(table.versionOptions.value), ["Sve verzije", "v2", "v10"]);
table.modelFilter.value = "A";
table.statusFilter.value = "prihvaćen";
table.sortBy("ime");
assert.deepEqual(table.allocationsPaginated.value, [ana, iva]);
table.sortBy("ime");
assert.deepEqual(table.allocationsPaginated.value, [iva, ana]);
table.sortBy("prezime");
assert.deepEqual(table.allocationsPaginated.value, [iva, ana]);
table.versionFilter.value = "v2";
assert.deepEqual(table.allocationsPaginated.value, [ana]);
table.search.value = "Iva";
assert.equal(table.allocationsPaginated.value.length, 0);
