import assert from "node:assert/strict";
import { approvalAssignmentOptions, visibleTaskFields, taskFormAnswers } from "../src/helpers/task-form.mjs";

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
assert.deepEqual(submit({ ocjena_unesena_studomat: { type: "yes-no-boolean" } }, {}), { ocjena_unesena_studomat: "true" });
assert.deepEqual(submit(evaluation, { kandidat_odobren: "false" }), { kandidat_odobren: "false" });
assert.equal(submit(evaluation, { kandidat_odobren: false }), null);
assert.equal(submit({ id_zadatak: { type: "input" } }, { id_zadatak: "   " }), null);
assert.equal(submit({ ...evaluation, unknown: { type: "unsupported" } }, { kandidat_odobren: "true" }), null);
assert.equal(submit({}, selected), null);

const approved = { id_zadatak: "Zadatak 1 - Demo", voditelj_odobrio: { value: "odobreno" }, dostupno_mjesta: "2" };
const options = approvalAssignmentOptions([
	approved, { ...approved, dostupno_mjesta: "0" }, { ...approved, dostupno_mjesta: -1 },
	{ ...approved, dostupno_mjesta: null }, { ...approved, voditelj_odobrio: { value: "u razradi" } },
	{ ...approved, voditelj_odobrio: { value: "odbijeno" } }, { ...approved, id_zadatak: "" },
]);
assert.deepEqual(options, [{ id: approved.id_zadatak, label: "Zadatak 1 - Demo (slobodna mjesta: 2)" }]);
const approval = { zadatak_odobren: { type: "yes-no-boolean" }, id_zadatak: { type: "input" } };
assert.equal(submit(approval, { zadatak_odobren: "true" }), null);
const answers = { zadatak_odobren: "true", id_zadatak: options[0].id };
assert.deepEqual(submit(approval, answers), answers);
