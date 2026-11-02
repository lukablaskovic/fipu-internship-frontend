import assert from "node:assert/strict";
import { completedTaskRows } from "../src/helpers/completed-task.mjs";

const fields = {
	JMBAG: { label: "JMBAG" },
	Alocirani_zadatak: { label: "Odabrani zadatak" },
	napomena: { label: "" },
};
const variables = { napomena: false, Alocirani_zadatak: ["A", "B"], JMBAG: "hidden", mentor_email: "another task" };
assert.deepEqual(completedTaskRows(fields, variables), [
	{ key: "Alocirani_zadatak", label: "Odabrani zadatak", value: "A, B" },
	{ key: "napomena", label: "Napomena", value: false },
]);
assert.deepEqual(completedTaskRows(undefined, variables), []);
