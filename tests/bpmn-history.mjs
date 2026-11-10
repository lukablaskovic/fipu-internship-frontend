import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { computed, effectScope, nextTick, reactive, shallowRef, watch } from "vue";

const source = readFileSync(new URL("../src/components/BPMN/BpmnDiagram.vue", import.meta.url), "utf8");
const script = source.match(/<script setup>([\s\S]*?)<\/script>/)[1].replace(/^import .*;\n/gm, "");
const nodes = ["startEvent", "parallelGateway", "userTask", "serviceTask", "sendTask", "exclusiveGateway", "manualTask", "task", "intermediateCatchEvent", "intermediateThrowEvent", "endEvent"]
	.map(type => ({ id: type, type }));
const props = reactive({ xml: "synthetic-model", instance: {
	pending: ["userTask"], state: "running", completed_activity_ids: ["startEvent", "parallelGateway", "serviceTask", "sendTask"],
} });
const events = [];
const timers = new Map();
let nextTimer = 0;
let reducedMotion = false;
const scope = effectScope();
const component = scope.run(() => runInNewContext(`${script}\n({ highlights, animatedHighlights, select })`, {
	computed, shallowRef, watch,
	defineProps: () => props,
	defineEmits: () => (...args) => events.push(args),
	parseModel: () => ({ nodes, flows: [
		{ sourceRef: "startEvent", targetRef: "parallelGateway" },
		{ sourceRef: "parallelGateway", targetRef: "serviceTask" },
		{ sourceRef: "parallelGateway", targetRef: "sendTask" },
		{ sourceRef: "sendTask", targetRef: "startEvent" },
	] }),
	window: { matchMedia: () => ({ matches: reducedMotion }) },
	setTimeout: (callback, delay) => { timers.set(++nextTimer, { callback, delay }); return nextTimer; },
	clearTimeout: id => timers.delete(id),
	UserTaskMappings: { tasks: [{ _id: "userTask" }] },
	SendTaskMappings: { tasks: [{ _id: "sendTask" }] },
}));

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

await nextTick();
props.instance = { pending: ["userTask"], completed_activity_ids: ["sendTask", "serviceTask", "parallelGateway", "startEvent"] };
await nextTick();
assert.equal(Object.keys(component.animatedHighlights.value).length, 0);
const frames = [...timers.values()].sort((a, b) => a.delay - b.delay);
assert.equal(frames.length, 4, "Parallel branches share a step and cycles terminate");
frames[0].callback();
assert.deepEqual(Object.keys(component.animatedHighlights.value), ["startEvent"]);
frames[1].callback();
assert.equal(component.animatedHighlights.value.parallelGateway, "#86efac");
frames[2].callback();
assert.equal(component.animatedHighlights.value.serviceTask, "#86efac");
assert.equal(component.animatedHighlights.value.sendTask, "#86efac");
assert.equal(component.animatedHighlights.value.userTask, undefined);
frames[3].callback();
assert.equal(component.animatedHighlights.value.userTask, "#fde047");
assert.equal(component.animatedHighlights.value.endEvent, undefined);
const previousTimers = [...timers.keys()];
props.instance = { pending: ["endEvent"], completed_activity_ids: [] };
await nextTick();
assert.ok(previousTimers.every(id => !timers.has(id)), "Replacing the instance cancels its animation");
assert.equal(Object.keys(component.animatedHighlights.value).length, 0);
reducedMotion = true;
props.instance = { pending: ["userTask"], completed_activity_ids: ["startEvent"] };
await nextTick();
assert.equal(timers.size, 0);
assert.equal(component.animatedHighlights.value.startEvent, "#86efac");
assert.equal(component.animatedHighlights.value.userTask, "#fde047");
reducedMotion = false;
props.instance = { pending: [], completed_activity_ids: ["startEvent"] };
await nextTick();
assert.ok(timers.size > 0);
scope.stop();
assert.equal(timers.size, 0, "Unmount cancels outstanding animation timers");
console.log("BPMN animation checks passed: traversal, parallel branches, cycles, pending tasks, replacement, reduced motion and cleanup.");
