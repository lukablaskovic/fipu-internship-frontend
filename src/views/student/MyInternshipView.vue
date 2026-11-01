<script setup>
import { mainStore, studentStore } from "@/main.js";
import { UserTaskMappings } from "@/helpers/maps";
import { ref, computed, onMounted } from "vue";

import LoadingOverlay from "@/components/LoadingOverlay.vue";

const processInstance = ref(null);
const pendingProcessTask = computed(() => studentStore.student_process_instance_data.pending?.[0]);
const error = ref(null);
const isLoaded = ref(false);

onMounted(async () => {
	if (mainStore.userAuthenticated) {
		try {
			processInstance.value = mainStore.currentUser.internship_process.id;
			await studentStore.getPendingUserTask(processInstance.value);
			isLoaded.value = true;
		} catch (cause) {
			error.value = "An error occurred while fetching instance info.";
			console.error(cause);
		}
	}
});

const currentRenderingComponent = computed(() => {
	if (error.value) {
		return null;
	}

	if (!mainStore.userAuthenticated) {
		return UserTaskMappings.getTaskProperty("odabiranje_zadatka_student", "component", studentStore.student_process_instance_data.state);
	}

	if (!isLoaded.value) return LoadingOverlay;

	return UserTaskMappings.getTaskProperty(pendingProcessTask.value, "component", studentStore.student_process_instance_data.state) || LoadingOverlay;
});
</script>

<template>
	<Suspense>
		<!-- main content -->
		<component :is="currentRenderingComponent"></component>

		<!-- loading state -->
		<template #fallback> <LoadingOverlay></LoadingOverlay> </template>
	</Suspense>
</template>
