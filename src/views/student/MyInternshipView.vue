<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { mainStore, studentStore } from "@/main.js";
import { UserTaskMappings } from "@/helpers/maps";

import LoadingOverlay from "@/components/LoadingOverlay.vue";

const processInstance = ref(null);
const pendingProcessTask = ref(null);
const error = ref(null);

onBeforeMount(async () => {
  if (mainStore.userAuthenticated) {
    try {
      processInstance.value = mainStore.currentUser.internship_process.id;

      pendingProcessTask.value = await studentStore.getPendingUserTask(
        processInstance.value
      );
      console.log("pendingProcessTask", pendingProcessTask.value);
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
      "component"
    );
  }

  return (
    UserTaskMappings.getTaskProperty(pendingProcessTask.value, "component") ||
    LoadingOverlay
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
