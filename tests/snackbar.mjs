import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/stores/snackbar_store.ts", import.meta.url), "utf8").replace(/^import .*;\n/gm, "").replace("export const useSnackBarStore", "const useSnackBarStore");
const calls = [];
const record = type => (text, options) => { calls.push({ type, text, options }); return calls.length; };
const toast = Object.assign(record("normal"), Object.fromEntries(["success", "info", "warning", "error"].map(type => [type, record(type)])));
const actions = runInNewContext(ts.transpile(source) + "\nuseSnackBarStore.actions", { defineStore: (_, options) => options, toast });
for (const [color, expected] of Object.entries({ success: "success", info: "info", warning: "warning", danger: "error", error: "error", contrast: "normal", unknown: "normal" })) {
	assert.equal(actions.pushMessage("Obavijest", color), calls.length);
	const call = calls.at(-1);
	assert.equal(call.type, expected);
	assert.equal(call.text, "Obavijest");
	assert.equal(call.options.duration, 3000);
	assert.equal(call.options.action, undefined);
}
actions.pushMessage("Longer", "info", 7000);
assert.equal(calls.at(-1).options.duration, 7000);
actions.pushMessage("Persistent", "info", 0);
assert.equal(calls.at(-1).options.duration, Infinity);
console.log("Sonner notification checks passed");
