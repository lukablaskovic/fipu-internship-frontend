import assert from "node:assert/strict";
import { findAssignments } from "../src/helpers/available-assignment-search.mjs";

const tasks = [
	{ id_zadatak: "Zadatak 10", lokacija: "Pula", trajanje_sati: 160, Poslodavac: [{ value: "Poduzeće" }] },
	{ id_zadatak: "Zadatak 2", lokacija: "Pula", trajanje_sati: 80, poslodavac_email: "mentor@test.hr" },
];
assert.deepEqual(findAssignments(tasks, "", "", "", "id_zadatak", false), [tasks[1], tasks[0]]);
assert.deepEqual(findAssignments(tasks, "", "", "", "trajanje_sati", true), tasks);
assert.deepEqual(findAssignments(tasks, " PODUZEĆE ", "Pula", "160", "lokacija", false), [tasks[0]]);
assert.deepEqual(findAssignments(tasks, "mentor@", "Pula", "80", "lokacija", false), [tasks[1]]);
assert.deepEqual(findAssignments(tasks, "mentor@", "Pula", "160", "lokacija", false), []);
assert.deepEqual(findAssignments(tasks, "", "Zagreb", "", "lokacija", false), []);
