<script setup>
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
		<span v-for="indicator in indicators" :key="indicator.task" role="img" :aria-label="indicator.label" :title="indicator.label" class="relative flex h-2 w-2">
			<span aria-hidden="true" class="absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping" :class="indicator.color" />
			<span aria-hidden="true" class="relative inline-flex h-2 w-2 rounded-full" :class="indicator.color" />
		</span>
	</span>
</template>
