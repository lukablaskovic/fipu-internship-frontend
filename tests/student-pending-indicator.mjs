import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, reactive } from "vue";
import ts from "typescript";

const source = readFileSync(new URL("../src/components/AsideMenu/StudentPendingIndicator.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
let loads = 0;
const store = reactive({ students: [], studentsFetched: false, getStudents: () => { loads++; } });
const indicators = runInNewContext(`${script}\nindicators`, {
	computed, useAdminStore: () => store, onMounted: (callback) => callback(),
});
const student = (task, state = "running", active_event = null) => ({ process_instance_data: { pending: [task], state, active_event } });
const colors = () => Array.from(indicators.value, ({ color }) => color);
assert.equal(loads, 1);
assert.deepEqual(colors(), []);
store.students = [student("alociranje_profesor")];
assert.deepEqual(colors(), ["bg-red-500"]);
store.students = [student("model_b_odobrenje_zadatka")];
assert.deepEqual(colors(), ["bg-green-500"]);
store.students.push(student("alociranje_profesor"), student("alociranje_profesor"));
assert.deepEqual(colors(), ["bg-red-500", "bg-green-500"]);
store.students = [student("alociranje_profesor", "cancelled"), student("model_b_odobrenje_zadatka", "finished"), student("alociranje_profesor", "running", "odustajanje_od_prakse"), student("upis_ocjene")];
assert.deepEqual(colors(), []);
store.students = [];
assert.deepEqual(colors(), []);
store.studentsFetched = true;
runInNewContext(script, { computed, useAdminStore: () => store, onMounted: (callback) => callback() });
assert.equal(loads, 1);

const storeSource = readFileSync(new URL("../src/stores/admin_store.ts", import.meta.url), "utf8")
	.replace(/^import .*;\n/gm, "").replace("export const useAdminStore", "const useAdminStore");
const options = runInNewContext(`${ts.transpile(storeSource)}\nuseAdminStore`, {
	defineStore: (_id, options) => options, persistSession: () => ({}),
});
let requests = 0;
const context = { fetchStudents: async () => { requests++; return true; } };
const first = options.actions.getStudents.call(context);
assert.equal(options.actions.getStudents.call(context), first);
assert.equal(await first, true);
assert.equal(requests, 1);
await options.actions.getStudents.call(context);
assert.equal(requests, 2);
context.fetchStudents = async () => false;
assert.equal(await options.actions.getStudents.call(context), false);
context.fetchStudents = async () => true;
assert.equal(await options.actions.getStudents.call(context), true);
console.log("Student indicator checks passed: red/green/both/empty, reactive updates, inactive processes, initial loading and shared requests.");
