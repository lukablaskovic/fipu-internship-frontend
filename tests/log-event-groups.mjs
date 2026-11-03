import assert from "node:assert/strict";
import { groupEventsByStudent } from "../src/helpers/log-events.js";

const events = [
	{ student_ime: "Ana", student_JMBAG: "001", instance_id: "new" },
	{ student_ime: "Ana", student_JMBAG: "002" },
	{ student_ime: "Ana", student_JMBAG: "001", instance_id: "old" },
	{ student_email: " Student@example.test " },
	{ instance_id: "unknown-1" },
	{ student_email: "student@example.test" },
	{ instance_id: "unknown-2" },
];
assert.deepEqual(groupEventsByStudent(events).map(group => group.events), [
	[events[0], events[2]], [events[1]], [events[3], events[5]], [events[4]], [events[6]],
]);
