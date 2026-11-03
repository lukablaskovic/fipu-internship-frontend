import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, effectScope, ref, watch } from "vue";

const source = readFileSync(new URL("../src/components/Tables/TableStudents.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
const withdrawals = [];
let refreshes = 0;
const scope = effectScope();
const action = scope.run(() => runInNewContext(`${script}\n({ confirmationText, withdrawalConfirmed, confirmingWithdrawal, openWithdrawal, confirmWithdrawal })`, {
	computed, ref, watch,
	defineProps: () => ({ search: "" }),
	defineEmits: () => () => {},
	useRoute: () => ({ params: {} }),
	useAdminStore: () => ({ students: [], filterFinishedInstances: true, filterModelState: "AB", getStudents: () => refreshes++ }),
	ProcessInstance: { withdraw: async (id) => { withdrawals.push(id); return { status: "OK" }; } },
	useSnackBarStore: () => ({ pushMessage: () => {} }),
	usePagination: () => ({ currentPage: ref(0) }),
}));

try {
	const student = { process_instance_id: "test-instance", process_instance_data: { state: "running", available_events: ["odustajanje_od_prakse"] } };
	action.openWithdrawal(student);
	assert.equal(action.confirmingWithdrawal.value, true);
	for (const text of ["", "prekidam", "prekidam proces prakse", "prekidam odabrani proces prakse!"]) {
		action.confirmationText.value = text;
		assert.equal(action.withdrawalConfirmed.value, false);
		await action.confirmWithdrawal();
	}
	assert.equal(withdrawals.length, 0);
	for (const text of ["Prekidam odabrani proces prakse", "PREKIDAM ODABRANI PROCES PRAKSE", "prekidam odabrani proces prakse"]) {
		action.confirmationText.value = text;
		assert.equal(action.withdrawalConfirmed.value, true);
		await action.confirmWithdrawal();
	}
	assert.equal(withdrawals.length, 3);
	assert.ok(withdrawals.every((id) => id === student.process_instance_id));
	for (const selected of [student, { ...student, process_instance_id: "another-test-instance" }]) {
		action.confirmingWithdrawal.value = false;
		action.confirmationText.value = "Prekidam odabrani proces prakse";
		action.openWithdrawal(selected);
		assert.equal(action.confirmationText.value, "");
		assert.equal(action.withdrawalConfirmed.value, false);
		await action.confirmWithdrawal();
	}
	assert.equal(withdrawals.length, 3);
	for (const process of [
		{ state: "cancelled" }, { state: "finished" }, { state: "running", available_events: [] },
		{ ...student.process_instance_data, active_event: "odustajanje_od_prakse" },
	]) {
		action.openWithdrawal({ ...student, process_instance_data: process });
		action.confirmationText.value = "Prekidam odabrani proces prakse";
		await action.confirmWithdrawal();
	}
	assert.equal(withdrawals.length, 3);
	assert.equal(refreshes, 3);
	assert.match(source, /:disabled-condition="!withdrawalConfirmed" @confirm="confirmWithdrawal"/);
	assert.match(source, /<FormControl v-model="confirmationText" autocomplete="off"/);
	console.log("Coordinator withdrawal checks passed: confirmation, selected instance, event availability and list refresh.");
} finally {
	scope.stop();
}
