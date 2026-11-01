<script setup>
import { computed, shallowRef, watch } from "vue";
import { mdiFitToScreenOutline, mdiMinus, mdiPlus } from "@mdi/js";
import { Toolbar } from "reka-ui/namespaced";
import BaseButton from "@/components/Base/BaseButton.vue";
import Diagram from "@fipu/bpmn/BpmnDiagram.vue";
import { parseModel } from "@fipu/bpmn/model";
import { UserTaskMappings, SendTaskMappings } from "@/helpers/maps";
import { pathToTask, taskAction } from "@/helpers/bpmn-state";

const props = defineProps({
	xml: { type: String, required: true },
	highlightColor: { type: String, default: "#79d4f2" },
	highlightElementId: { type: String, default: "" },
	currentOrder: { type: Number, required: true },
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
const path = computed(() => model.value ? pathToTask(model.value, props.highlightElementId) : []);
const completed = computed(() => {
	const ids = new Set(path.value.filter((id) => id !== props.highlightElementId));
	for (const id of ids) {
		if (model.value.nodes.find((node) => node.id === id)?.type === "parallelGateway") {
			for (const flow of model.value.flows.filter((item) => item.sourceRef === id)) ids.add(flow.targetRef);
		}
	}
	ids.delete(props.highlightElementId);
	return [...ids];
});
const highlights = computed(() => ({
	...Object.fromEntries(completed.value.map((id) => [id, "#86efac"])),
	...(props.highlightElementId ? { [props.highlightElementId]: props.highlightColor } : {}),
}));
const completedSendIds = computed(() => completed.value.filter((id) => SendTaskMappings.tasks.some((task) => task._id === id)));
function select(id) {
	const node = model.value.nodes.find((item) => item.id === id);
	if (!node) return;
	const action = taskAction(node, props.currentOrder, UserTaskMappings.tasks, completedSendIds.value);
	if (action) {
		emit(action, { id, type: `bpmn:${node.type[0].toUpperCase()}${node.type.slice(1)}` });
	}
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
.bpmn-zoom-controls :deep(button) { width: 40px; height: 40px; border: 0; color: #294358; }
@media (max-width: 600px) { .bpmn-container { position: relative; height: 50vh; } }
</style>
