<script setup>
import TableCellText from "@/components/Tables/TableCellText.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import { computed, ref, watch } from "vue";
import { ProcessInstance } from "@/services/bpmn_engine_api";
import { completedTaskRows } from "@/helpers/completed-task.mjs";

const props = defineProps({
	instanceId: { type: [String, Number], required: true },
	taskId: { type: String, default: "" },
	variables: { type: Object, default: () => ({}) },
});
const task = ref(null);
const loading = ref(true);
watch(() => [props.instanceId, props.taskId], async ([id, taskId], _, onCleanup) => {
	let active = true;
	onCleanup(() => { active = false; });
	loading.value = true;
	const result = await ProcessInstance.getTaskInfo(id, taskId);
	if (active) {
		task.value = result;
		loading.value = false;
	}
}, { immediate: true });

const rows = computed(() => completedTaskRows(task.value?.form_fields, props.variables));
</script>

<template>
	<p v-if="loading" role="status">Učitavanje podataka…</p>
	<p v-else-if="!task?.form_fields" role="alert">Podatke o zadatku nije moguće učitati.</p>
	<CardBoxComponentEmpty v-else-if="!rows.length" />
	<dl v-else class="divide-y divide-slate-200 text-sm dark:divide-slate-700">
		<div v-for="row in rows" :key="row.key" class="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
			<dt class="font-medium text-slate-600 dark:text-slate-300">{{ row.label }}</dt>
			<dd class="min-w-0 wrap-break-word text-slate-900 dark:text-slate-100">
				<TableCellText :value="row.value" />
			</dd>
		</div>
	</dl>
</template>
