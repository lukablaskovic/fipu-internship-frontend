import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { setImmediate } from "node:timers";
import { runInNewContext } from "node:vm";
import { computed, effectScope, nextTick, reactive, ref, watch } from "vue";

const source = readFileSync(new URL("../src/components/Tables/TableCompanies.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
const helpers = runInNewContext(readFileSync(new URL("../src/helpers/search-utils.js", import.meta.url), "utf8").replaceAll("export const", "const") + "\n({ filterByCompany, normalizeString })");
const { usePagination } = runInNewContext(readFileSync(new URL("../src/composables/usePagination.js", import.meta.url), "utf8").replace(/^import .*;\n/gm, "").replaceAll("export ", "") + "\n({ usePagination })", { computed, ref, watch });
const company = (naziv) => ({ naziv, OIB: "test", maticni_broj: "test" });
const target = company("A & Č d.o.o.");
const companies = [{ naziv: "Unregistered" }, ...Array.from({ length: 12 }, (_, i) => company(`Company ${i}`)), target];
const route = reactive({ params: {}, query: { p: target.naziv, keep: "yes" } });
const scope = effectScope();
const table = scope.run(() => runInNewContext(`${script}\n({ searchQuery, filteredCompanies, currentPage, companiesPaginated, getAssignmentPage, dataLoaded })`, {
	computed, ref, watch, usePagination, ...helpers,
	defineProps: () => ({}),
	useMainStore: () => ({ fetchCompanies: async () => companies }),
	useRoute: () => route,
	useRouter: () => ({ replace: ({ query }) => { route.query = query; } }),
	onMounted: () => {},
}));

try {
	await new Promise(setImmediate);
	assert.equal(table.dataLoaded.value, true);
	assert.equal(table.searchQuery.value, target.naziv);
	assert.deepEqual(Array.from(table.filteredCompanies.value), [target]);
	table.searchQuery.value = "  a & č D.O.O.  ";
	await nextTick();
	assert.deepEqual(Array.from(table.filteredCompanies.value), [target]);
	assert.equal(route.query.keep, "yes");
	assert.equal(route.query.p, "  a & č D.O.O.  ");
	table.searchQuery.value = "";
	await nextTick();
	assert.equal(route.query.p, undefined);
	assert.equal(table.filteredCompanies.value.length, 13, "Unregistered employers stay excluded");
	table.currentPage.value = 1;
	await nextTick();
	assert.equal(table.getAssignmentPage(target.naziv), 1, "Legacy links use the visible employer index");
	route.query = { p: "Company" };
	await nextTick();
	assert.equal(table.currentPage.value, 0, "URL changes reset pagination even when page count is unchanged");
	assert.equal(table.companiesPaginated.value.length, 10);
	table.searchQuery.value = "No match";
	await nextTick();
	assert.equal(table.filteredCompanies.value.length, 0);
	route.query = {};
	await nextTick();
	assert.equal(table.filteredCompanies.value.length, 13, "Back navigation restores the search");
	for (const p of [null, ["Company", "Other"]]) {
		route.query = { p };
		await nextTick();
		assert.equal(table.searchQuery.value, "");
	}
	console.log("Employer search checks passed: URL prefill and updates, special characters, pagination, empty results, back navigation and malformed query values.");
} finally {
	scope.stop();
}
