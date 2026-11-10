<script setup>
import Tooltip from "@/components/Base/Tooltip.vue";
import { computed, shallowRef, watch } from "vue";
import { mdiFitToScreenOutline, mdiMinus, mdiPlus } from "@mdi/js";
import { Toolbar } from "reka-ui/namespaced";
import BaseButton from "@/components/Base/BaseButton.vue";
import Diagram from "@fipu/bpmn/BpmnDiagram.vue";
import { parseModel } from "@fipu/bpmn/model";
import { UserTaskMappings, SendTaskMappings } from "@/helpers/maps";

const props = defineProps({
	xml: { type: String, required: true },
	instance: { type: Object, required: true },
});
const emit = defineEmits(["currentTaskModal", "pastTaskModal", "sendTaskModal"]);
const diagram = shallowRef(null);
const model = shallowRef(null);
const error = shallowRef("");
watch(() => props.xml, (xml) => {
	try {
		model.value = parseModel(xml);
		error.value = "";
	} catch {
		model.value = null;
		error.value = "BPMN prikaz nije moguće učitati. Osvježite stranicu ili kontaktirajte voditelja prakse.";
	}
}, { immediate: true });
const highlights = computed(() => {
	const colors = Object.fromEntries((props.instance.completed_activity_ids ?? []).map(id => [id, "#86efac"]));
	for (const id of props.instance.pending) {
		colors[id] = "#fde047";
	}
	return colors;
});

const animatedHighlights = shallowRef({});
watch([model, highlights, () => props.instance], ([currentModel, colors], _, onCleanup) => {
	animatedHighlights.value = {};
	if (!currentModel) return;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		animatedHighlights.value = colors;
		return;
	}
	const visited = new Set();
	const steps = [];
	let frontier = currentModel.nodes.filter(node => node.type === "startEvent").map(node => node.id);
	while (frontier.length) {
		const ids = frontier.filter(id => !visited.has(id) && colors[id] === "#86efac");
		if (!ids.length) break;
		steps.push(ids);
		ids.forEach(id => visited.add(id));
		frontier = [...new Set(currentModel.flows.filter(flow => ids.includes(flow.sourceRef)).map(flow => flow.targetRef))];
	}
	// Keep recorded history visible even when a model revision disconnects older tasks.
	const remaining = Object.keys(colors).filter(id => colors[id] === "#86efac" && !visited.has(id));
	if (remaining.length) steps.push(remaining);
	const pending = Object.keys(colors).filter(id => colors[id] === "#fde047");
	if (pending.length) steps.push(pending);
	const interval = Math.min(180, 1800 / Math.max(steps.length, 1));
	const timers = steps.map((ids, index) => setTimeout(() => {
		animatedHighlights.value = { ...animatedHighlights.value, ...Object.fromEntries(ids.map(id => [id, colors[id]])) };
	}, 80 + index * interval));
	onCleanup(() => timers.forEach(clearTimeout));
}, { immediate: true });

function select(id) {
	const node = model.value.nodes.find(node => node.id === id);
	if (!node) return;
	const userTask = node.type === "userTask" && UserTaskMappings.tasks.some(task => task._id === id);
	if (props.instance.pending.includes(id)) {
		if (userTask && id !== "evaluacija_poslodavac" && props.instance.state === "running" && !props.instance.active_event) {
			emit("currentTaskModal", { id });
		}
		return;
	}
	if (!props.instance.completed_activity_ids?.includes(id)) return;
	if (userTask) emit("pastTaskModal", { id });
	else if (node.type === "sendTask" && SendTaskMappings.tasks.some(task => task._id === id)) emit("sendTaskModal", { id });
}
</script>

<template>
	<div class="bpmn-container">
		<p v-if="error" role="alert">{{ error }}</p>
		<template v-else-if="model">
			<Diagram ref="diagram" :model="model" :tooltip-component="Tooltip" :highlights="animatedHighlights" @select="select" />
			<Toolbar.Root class="bpmn-zoom-controls" aria-label="Prikaz dijagrama">
				<Tooltip content="Umanji"><Toolbar.Button as-child><BaseButton :icon="mdiMinus" :icon-size="22" aria-label="Umanji" @click="diagram?.zoomOut()" /></Toolbar.Button></Tooltip>
				<Tooltip content="Prikaži cijeli model"><Toolbar.Button as-child><BaseButton :icon="mdiFitToScreenOutline" :icon-size="22" aria-label="Prikaži cijeli model" @click="diagram?.fit()" /></Toolbar.Button></Tooltip>
				<Tooltip content="Uvećaj"><Toolbar.Button as-child><BaseButton :icon="mdiPlus" :icon-size="22" aria-label="Uvećaj" @click="diagram?.zoomIn()" /></Toolbar.Button></Tooltip>
			</Toolbar.Root>
		</template>
	</div>
</template>

<style scoped>
@reference "../../css/main.css";
.bpmn-container { position: relative; height: 70vh; width: 100%; min-height: 320px; }
.bpmn-container :deep(.bpmn-node:hover .node-shape), .bpmn-container :deep(.bpmn-node:focus .node-shape) { fill: theme("colors.fipu_blue"); }
.bpmn-container :deep(.node-shape) { transition: fill 160ms ease-out; }
@media (prefers-reduced-motion: reduce) { .bpmn-container :deep(.node-shape) { transition: none; } }
.bpmn-zoom-controls { position: absolute; right: 18px; bottom: 18px; display: flex; padding: 3px; border: 1px solid #d4e0e9; border-radius: 8px; background: #fff; }
.bpmn-zoom-controls :deep(button) { width: 40px; height: 40px; border: 0; color: #294358; box-shadow: none; }
.bpmn-zoom-controls :deep(button:focus-visible) { outline: 2px solid #087caa; outline-offset: -3px; }
@media (max-width: 600px) { .bpmn-container { position: relative; height: 50vh; } }
.bpmn-container.landscape-diagram { height: 100%; min-height: 0; }
@media (max-width: 639px) and (orientation: portrait) {
	.bpmn-container.landscape-diagram {
		width: 100cqh;
		height: 100cqw;
		transform-origin: top left;
		transform: translateX(100cqw) rotate(90deg);
	}
}
</style>
