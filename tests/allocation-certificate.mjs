import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/stores/admin_store.ts", import.meta.url), "utf8").replace(/^import .*;\n/gm, "").replace("export const useAdminStore", "const useAdminStore");
const url = "https://example.test/certificate.pdf";
let opened, closed, message;
const actions = runInNewContext(ts.transpile(source) + "\nuseAdminStore.actions", {
	defineStore: (_, options) => options, persistSession: () => ({}),
	window: { open: () => ({ location: { replace: value => { opened = value; } }, close: () => { closed = true; } }) },
	ProcessInstance: { get: async id => id === "finished-attempt" ? { state: "finished", variables: { pdf_attachment_url: url } } : null },
	useSnackBarStore: () => ({ pushMessage: value => { message = value; } }),
});
await actions.openPDF.call({ students: [] }, { process_instance_id: "finished-attempt" });
assert.equal(opened, url);
opened = null;
await actions.openPDF.call({ students: [] }, { process_instance_id: "missing" });
assert.equal(opened, null);
assert.ok(closed && message);
