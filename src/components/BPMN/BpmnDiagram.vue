<script setup>
import { computed, shallowRef, watch } from "vue";
import Diagram from "@fipu/bpmn/BpmnDiagram.vue";
import { parseModel } from "@fipu/bpmn/model";
import { UserTaskMappings, SendTaskMappings } from "@/helpers/maps";
import { pathToTask, taskAction } from "@/helpers/bpmn-state";
import { adminStore } from "@/main";

const props = defineProps({
	xml: { type: String, required: true },
	highlightColor: { type: String, default: "#79d4f2" },
	highlightElementId: { type: String, default: "" },
	currentOrder: { type: Number, required: true },
});
const emit = defineEmits(["currentTaskModal", "pastTaskModal", "sendTaskModal"]);
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
		adminStore.bpmn_diagram.clicked_task_id = id;
		emit(action, { id, type: `bpmn:${node.type[0].toUpperCase()}${node.type.slice(1)}` });
	}
}
</script>

<template>
	<div class="bpmn-container">
		<p v-if="error" role="alert">{{ error }}</p>
		<Diagram v-else-if="model" :model="model" :highlights="highlights" @select="select" />
	</div>
</template>

<style scoped>
.bpmn-container { height: 70vh; width: 100%; min-height: 320px; }
@media (max-width: 600px) { .bpmn-container { height: 50vh; } }
</style>
