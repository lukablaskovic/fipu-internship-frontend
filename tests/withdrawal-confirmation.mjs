import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, effectScope, nextTick, reactive, ref, watch } from "vue";

const source = readFileSync(new URL("../src/components/Internship/StudentWithdrawAction.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
let submissions = 0;
const studentStore = reactive({
	student_process_instance_data: { state: "running", available_events: ["odustajanje_od_prakse"] },
	withdrawInternship: async () => { submissions++; return { status: "OK" }; },
});
const scope = effectScope();
const action = scope.run(() => runInNewContext(`${script}\n({ confirmationText, withdrawalConfirmed, confirming, busy, withdraw })`, {
	computed, ref, watch,
	onBeforeUnmount: () => {},
	useStudentStore: () => studentStore,
	useMainStore: () => ({}),
	clearInterval,
}));

try {
	for (const text of ["", "prekidam", "prekidam proces", "prekidam proces prakse!"]) {
		action.confirmationText.value = text;
		assert.equal(action.withdrawalConfirmed.value, false);
		await action.withdraw();
	}
	assert.equal(submissions, 0);
	for (const text of ["prekidam proces prakse", "PREKIDAM PROCES PRAKSE", "Prekidam Proces Prakse"]) {
		action.confirmationText.value = text;
		assert.equal(action.withdrawalConfirmed.value, true);
		await action.withdraw();
	}
	assert.equal(submissions, 3);
	action.busy.value = true;
	await action.withdraw();
	assert.equal(submissions, 3);
	action.busy.value = false;
	for (let open = 0; open < 2; open++) {
		action.confirming.value = true;
		await nextTick();
		assert.equal(action.confirmationText.value, "");
		assert.equal(action.withdrawalConfirmed.value, false);
		action.confirmationText.value = "prekidam proces prakse";
		action.confirming.value = false;
		await nextTick();
	}
	studentStore.student_process_instance_data = { state: "failed", active_event: "odustajanje_od_prakse" };
	action.confirmationText.value = "";
	await action.withdraw();
	assert.equal(submissions, 4);
	console.log("Withdrawal confirmation checks passed: case-insensitive phrase, invalid input, busy guard, dialog reset and accepted-withdrawal retry.");
} finally {
	scope.stop();
}
