<script setup>
import Tooltip from "@/components/Base/Tooltip.vue";
import { computed, onMounted } from "vue";
import { useAdminStore } from "@/stores/admin_store";

const adminStore = useAdminStore();
const indicators = computed(() => [
	{ task: "alociranje_profesor", color: "bg-red-500", label: "Model A: studenti čekaju alokaciju" },
	{ task: "model_b_odobrenje_zadatka", color: "bg-green-500", label: "Model B: studenti čekaju odobrenje zadatka" },
].filter(({ task }) => adminStore.students.some(({ process_instance_data: data }) =>
	!["cancelled", "finished"].includes(data.state) && !data.active_event && data.pending[0] === task,
)));

onMounted(() => {
	if (!adminStore.studentsFetched) adminStore.getStudents();
});
</script>

<template>
	<span class="pointer-events-none absolute left-1/2 top-0 ml-1.5 flex gap-1">
		<Tooltip v-for="indicator in indicators" :key="indicator.task" :content="indicator.label">
			<span role="img" tabindex="0" :aria-label="indicator.label" class="pointer-events-auto relative flex h-2 w-2" @pointermove.stop>
				<span aria-hidden="true" class="absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping" :class="indicator.color" />
				<span aria-hidden="true" class="relative inline-flex h-2 w-2 rounded-full" :class="indicator.color" />
			</span>
		</Tooltip>
	</span>
</template>
