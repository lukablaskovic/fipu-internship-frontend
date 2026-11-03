import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, reactive, shallowRef, watch } from "vue";

const source = readFileSync(new URL("../src/components/BPMN/BpmnDiagram.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
const nodes = ["startEvent", "parallelGateway", "userTask", "serviceTask", "sendTask", "exclusiveGateway", "manualTask", "task", "intermediateCatchEvent", "intermediateThrowEvent", "endEvent"]
	.map(type => ({ id: type, type }));
const props = reactive({ xml: "synthetic-model", instance: {
	pending: ["userTask"], state: "running", completed_activity_ids: ["startEvent", "parallelGateway", "serviceTask", "sendTask"],
} });
const events = [];
const component = runInNewContext(`${script}\n({ highlights, select })`, {
	computed, shallowRef, watch,
	defineProps: () => props,
	defineEmits: () => (...args) => events.push(args),
	parseModel: () => ({ nodes }),
	UserTaskMappings: { tasks: [{ _id: "userTask" }] },
	SendTaskMappings: { tasks: [{ _id: "sendTask" }] },
});

for (const id of props.instance.completed_activity_ids) assert.equal(component.highlights.value[id], "#86efac");
assert.equal(component.highlights.value.userTask, "#fde047");
assert.equal(component.highlights.value.endEvent, undefined, "Unvisited nodes must remain uncolored");
component.select("userTask");
assert.equal(events.pop()[0], "currentTaskModal");
component.select("sendTask");
assert.equal(events.pop()[0], "sendTaskModal");
component.select("endEvent");
assert.equal(events.length, 0);

props.instance.completed_activity_ids = nodes.map(node => node.id);
for (const node of nodes) {
	assert.equal(component.highlights.value[node.id], node.id === "userTask" ? "#fde047" : "#86efac",
		"Every completed node type is green; a reopened task stays yellow after a return or rollback");
}
props.instance.pending = [];
for (const node of nodes) assert.equal(component.highlights.value[node.id], "#86efac");
component.select("userTask");
assert.equal(events.pop()[0], "pastTaskModal");
for (const state of ["finished", "cancelled"]) {
	props.instance.state = state;
	assert.equal(component.highlights.value.userTask, "#86efac", "Closed processes retain their completed history");
}

props.instance = { state: "running", pending: ["userTask"], completed_activity_ids: [] };
assert.deepEqual(Object.keys(component.highlights.value), ["userTask"], "Switching instances clears the previous history");
component.select("sendTask");
assert.equal(events.length, 0, "Unvisited email tasks cannot be resent");
delete props.instance.completed_activity_ids;
assert.equal(component.highlights.value.serviceTask, undefined, "Missing API history must not invent completed branches");
console.log("BPMN history checks passed: completed node colors, reopened tasks, unvisited branches, closed processes, instance changes and task dialogs.");
