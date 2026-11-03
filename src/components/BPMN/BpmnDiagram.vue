<script setup>
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
			<Diagram ref="diagram" :model="model" :highlights="highlights" @select="select" />
			<Toolbar.Root class="bpmn-zoom-controls" aria-label="Prikaz dijagrama">
				<Toolbar.Button as-child><BaseButton :icon="mdiMinus" :icon-size="22" aria-label="Umanji" title="Umanji" @click="diagram?.zoomOut()" /></Toolbar.Button>
				<Toolbar.Button as-child><BaseButton :icon="mdiFitToScreenOutline" :icon-size="22" aria-label="Prikaži cijeli model" title="Prikaži cijeli model" @click="diagram?.fit()" /></Toolbar.Button>
				<Toolbar.Button as-child><BaseButton :icon="mdiPlus" :icon-size="22" aria-label="Uvećaj" title="Uvećaj" @click="diagram?.zoomIn()" /></Toolbar.Button>
			</Toolbar.Root>
		</template>
	</div>
</template>

<style scoped>
.bpmn-container { position: relative; height: 70vh; width: 100%; min-height: 320px; }
.bpmn-zoom-controls { position: absolute; right: 18px; bottom: 18px; display: flex; padding: 3px; border: 1px solid #d4e0e9; border-radius: 8px; background: #fff; }
.bpmn-zoom-controls :deep(button) { width: 40px; height: 40px; border: 0; color: #294358; box-shadow: none; }
.bpmn-zoom-controls :deep(button:focus-visible) { outline: 2px solid #087caa; outline-offset: -3px; }
@media (max-width: 600px) { .bpmn-container { position: relative; height: 50vh; } }
</style>
