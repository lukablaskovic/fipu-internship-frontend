import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, defineAsyncComponent, reactive, ref, watch } from "vue";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const mappingsSource = read("../src/helpers/maps.js").replace(/^import .*;\n/gm, "").replace(/^export .*;\n/gm, "");
const components = Object.fromEntries([...mappingsSource.matchAll(/component: (\w+)/g)].map(([, name]) => [name, {}]));
const icons = Object.fromEntries([...mappingsSource.matchAll(/icon: (\w+)/g)].map(([, name]) => [name, ""]));
const UserTaskMappings = runInNewContext(`${mappingsSource}\nUserTaskMappings`, { ...components, ...icons, defineAsyncComponent });
const helperSource = read("../src/helpers/internship-stages.js").replace(/^import .*;\n/gm, "").replaceAll("export ", "");
assert.doesNotThrow(() => runInNewContext(`${helperSource}\nclass UserTaskMappings { static tasks = []; }\ngetInternshipStages();`), "The stage helper must initialize before its cyclic task-mapping dependency");
const { getInternshipProgress, getInternshipStages, getInternshipStage, countInternshipStages } = runInNewContext(`${helperSource}\n({ getInternshipProgress, getInternshipStages, getInternshipStage, countInternshipStages })`, { UserTaskMappings });
assert.deepEqual(Array.from(getInternshipStages()), Array.from(UserTaskMappings.tasks).sort((a, b) => a.order - b.order).map(task => task.name).concat("Nepoznata faza"));
assert.equal(getInternshipStage({ process_instance_data: { pending: ["alociranje_profesor"] } }), "Čeka alokaciju profesora");
assert.equal(getInternshipStage({ process_instance_data: { pending: ["unknown"] } }), "Nepoznata faza");
const counts = countInternshipStages([
	{ process_instance_id: "demo", Model_prakse: { value: "A" }, process_instance_data: { pending: ["alociranje_profesor"] } },
], "A");
assert.equal(counts.length, 1);
assert.equal(counts[0].stage, "Čeka alokaciju profesora");
assert.equal(counts[0].count, 1);
const a = getInternshipProgress("A", { pending: ["odabiranje_zadatka_student"] });
const b = getInternshipProgress("B", { pending: ["model_b_odobrenje_zadatka"] });
assert.equal(a.stages.length, 6);
assert.equal(b.stages.length, 5);
assert.equal(a.value, 0);
assert.equal(b.value, 0);
assert.equal(a.stages.some(stage => stage._id.startsWith("model_b")), false);
assert.equal(b.stages.some(stage => ["alociranje_profesor", "evaluacija_poslodavac", "odabiranje_zadatka_student"].includes(stage._id)), false);
for (const model of ["A", "B"]) {
	const stages = getInternshipProgress(model, {}).stages;
	for (const [index, stage] of stages.entries()) {
		const progress = getInternshipProgress(model, { pending: [stage._id], completed_activity_ids: stages.map(task => task._id) });
		assert.equal(progress.completed, index, "Pending task wins over past visits after a return or rollback");
		assert.equal(progress.value, Math.round(index / stages.length * 100));
	}
	assert.equal(getInternshipProgress(model, { state: "finished" }).value, 100);
	assert.equal(getInternshipProgress(model, { pending: ["new_task"] }).value, null);
}
assert.equal(getInternshipProgress("unknown", {}), null);

const source = read("../src/components/Internship/StudentProgress.vue");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
const mainStore = reactive({ userAdmin: false, currentUser: { model_prakse: "A", internship_process: { id: "demo" } } });
let loads = 0;
const studentStore = reactive({ student_process_instance_data: {}, getInstanceInfo: () => { loads++; } });
const timers = new Map();
let timerId = 0;
const component = runInNewContext(`${script}\n({ progress, status, open, show, close })`, {
	computed, ref, watch, getInternshipProgress, onBeforeUnmount: () => {},
	useMainStore: () => mainStore, useStudentStore: () => studentStore, useUiStore: () => ({}),
	setTimeout: (callback) => { timers.set(++timerId, callback); return timerId; },
	clearTimeout: (id) => timers.delete(id),
});
assert.equal(loads, 1);
assert.equal(component.progress.value, null, "Hide until the correct instance is loaded");
studentStore.student_process_instance_data = { id: "demo", pending: ["upis_ocjene"], state: "running" };
assert.equal(component.progress.value.value, 83);
studentStore.student_process_instance_data.pending = ["alociranje_profesor"];
assert.equal(component.progress.value.value, 17);
studentStore.student_process_instance_data.state = "finished";
assert.equal(component.progress.value.value, 100);
assert.equal(component.status.value, "Praksa je završena");
studentStore.student_process_instance_data.state = "cancelled";
assert.equal(component.progress.value, null);
studentStore.student_process_instance_data.state = "running";
studentStore.student_process_instance_data.active_event = "odustajanje_od_prakse";
assert.equal(component.progress.value, null);
studentStore.student_process_instance_data.active_event = null;
mainStore.userAdmin = true;
assert.equal(component.progress.value, null);
mainStore.userAdmin = false;
mainStore.currentUser.internship_process.id = null;
assert.equal(component.progress.value, null);
component.show({ pointerType: "mouse" });
assert.equal(component.open.value, true);
component.close({ pointerType: "mouse" });
assert.equal(timers.size, 1);
component.show({ pointerType: "mouse" });
assert.equal(timers.size, 0, "Moving into the panel cancels hover dismissal");
component.close({ pointerType: "touch" });
assert.equal(timers.size, 0, "Lifting a finger must not dismiss the panel");
component.close({ pointerType: "mouse" });
[...timers.values()][0]();
assert.equal(component.open.value, false);
component.show({ pointerType: "touch" });
assert.equal(component.open.value, false, "Touch relies on the native popover click toggle");
console.log("Student progress checks passed: A/B phases, rollback, completion, unknown tasks, loading, withdrawal, student-only visibility and mouse/touch dismissal.");
