import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, effectScope, ref, watch } from "vue";

const source = readFileSync(new URL("../src/components/Tables/TableStudents.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
const deletions = [];
const scope = effectScope();
const action = scope.run(() => runInNewContext(`${script}\n({ deletionConfirmationText, deletionConfirmed, instanceDeleteModalActive, deleteProcessInstance, confirmInstanceDeletion })`, {
	computed, ref, watch,
	defineProps: () => ({ search: "" }),
	defineEmits: () => () => {},
	useRoute: () => ({ params: {} }),
	useAdminStore: () => ({ students: [], filterFinishedInstances: true, filterModelState: "AB", removeInstanceData: (student) => deletions.push(student) }),
	usePagination: () => ({ currentPage: ref(0) }),
}));

try {
	const student = { process_instance_id: "test-instance" };
	action.deleteProcessInstance(student);
	assert.equal(action.instanceDeleteModalActive.value, true);
	for (const text of ["", "prekidam", "prekidam proces prakse", "prekidam odabrani proces prakse!"]) {
		action.deletionConfirmationText.value = text;
		assert.equal(action.deletionConfirmed.value, false);
		await action.confirmInstanceDeletion();
	}
	assert.equal(deletions.length, 0);
	for (const text of ["Prekidam odabrani proces prakse", "PREKIDAM ODABRANI PROCES PRAKSE", "prekidam odabrani proces prakse"]) {
		action.deletionConfirmationText.value = text;
		assert.equal(action.deletionConfirmed.value, true);
		await action.confirmInstanceDeletion();
	}
	assert.equal(deletions.length, 3);
	assert.ok(deletions.every((deleted) => deleted.process_instance_id === student.process_instance_id));
	for (const selected of [student, { process_instance_id: "another-test-instance" }]) {
		action.instanceDeleteModalActive.value = false;
		action.deletionConfirmationText.value = "Prekidam odabrani proces prakse";
		action.deleteProcessInstance(selected);
		assert.equal(action.deletionConfirmationText.value, "");
		assert.equal(action.deletionConfirmed.value, false);
		await action.confirmInstanceDeletion();
	}
	assert.equal(deletions.length, 3);
	assert.match(source, /:disabled-condition="!deletionConfirmed" @confirm="confirmInstanceDeletion"/);
	assert.match(source, /<FormControl v-model="deletionConfirmationText" autocomplete="off"/);
	console.log("Instance deletion confirmation checks passed: invalid input, case-insensitive phrase, selected student and dialog reset.");
} finally {
	scope.stop();
}
