<script setup>
import { ref, computed, onMounted } from "vue";
import { mainStore, studentStore } from "@/main.js";
import { UserTaskMappings } from "@/helpers/maps";

import LoadingOverlay from "@/components/LoadingOverlay.vue";

const processInstance = ref(null);
const pendingProcessTask = ref(null);
const error = ref(null);

onMounted(async () => {
  if (mainStore.userAuthenticated) {
    try {
      processInstance.value = mainStore.currentUser.internship_process.id;
      console.log("processInstance", processInstance.value);
      pendingProcessTask.value = await studentStore.getPendingUserTask(
        processInstance.value
      );
    } catch (error) {
      error.value = "An error occurred while fetching instance info.";
      console.error(error);
    }
  }
});

const currentRenderingComponent = computed(() => {
  if (error.value) {
    console.log(error.value);
    return null;
  }

  if (!mainStore.userAuthenticated) {
    return UserTaskMappings.getTaskProperty(
      "odabiranje_zadatka_student",
      "component",
      studentStore.student_process_instance_data.state
    );
  }

  return (
    UserTaskMappings.getTaskProperty(
      pendingProcessTask.value,
      "component",
      studentStore.student_process_instance_data.state
    ) || LoadingOverlay
  );
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
