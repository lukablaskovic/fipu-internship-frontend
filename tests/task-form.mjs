import assert from "node:assert/strict";
import { visibleTaskFields, taskFormAnswers } from "../src/helpers/task-form.mjs";

const submit = (fields, values) => taskFormAnswers(visibleTaskFields(fields, values), values);
const allocation = {
	Student: { type: "var-string" },
	JMBAG: { type: "var-string" },
	Alocirani_zadatak: { type: "selectFromTable-'studentPreferences'" },
	odabir_prihvacen: { type: "yes-no-boolean" },
};
const selected = { Alocirani_zadatak: "Demo task", odabir_prihvacen: "true" };
assert.equal(submit(allocation, { odabir_prihvacen: "true" }), null);
assert.deepEqual(submit(allocation, { ...selected, JMBAG: "unused", Student: [1] }), selected);
assert.deepEqual(submit(allocation, { ...selected, odabir_prihvacen: "false" }), { odabir_prihvacen: "false" });
const evaluation = { kandidat_odobren: { type: "yes-no-boolean" } };
assert.deepEqual(submit(evaluation, { kandidat_odobren: "false" }), { kandidat_odobren: "false" });
assert.equal(submit(evaluation, { kandidat_odobren: false }), null);
assert.equal(submit({ id_zadatak: { type: "input" } }, { id_zadatak: "   " }), null);
assert.equal(submit({ ...evaluation, unknown: { type: "unsupported" } }, { kandidat_odobren: "true" }), null);
assert.equal(submit({}, selected), null);
