import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/stores/admin_store.ts", import.meta.url), "utf8")
	.replace(/^import .*;\n/gm, "").replace("export const useAdminStore", "const useAdminStore");
let result = [];
let requests = 0;
const options = runInNewContext(`${ts.transpile(source)}\nuseAdminStore`, {
	defineStore: (_id, options) => options,
	persistSession: () => ({}),
	fetchAvailableAssignments: async () => { requests++; return result; },
});
const store = { newAssignmentsFound: false };
const load = () => options.actions.getAssignments.call(store);
const task = (status, places = 0) => ({ voditelj_odobrio: { value: status }, dostupno_mjesta: places });

const first = load();
assert.equal(load(), first, "Sidebar and table must share their initial request");
await first;
assert.equal(requests, 1);
assert.equal(store.newAssignmentsFound, false);
result = [task("u razradi")];
await load();
assert.equal(store.newAssignmentsFound, true, "Unapproved tasks count even with no available places");
result = undefined;
await load();
assert.equal(store.newAssignmentsFound, true, "Failed refresh must preserve the last known state");
result = [task("odobreno", 2), task("odbijeno", 2), {}];
await load();
assert.equal(store.newAssignmentsFound, false, "Clear the indicator after all pending tasks are handled");
result = [];
await load();
assert.equal(store.newAssignmentsFound, false);
console.log("Assignment indicator checks passed: pending/handled/empty, capacity, failed refresh and shared requests.");
