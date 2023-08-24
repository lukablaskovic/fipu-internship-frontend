<script setup>
import { ref, computed, onMounted } from "vue";
import { mainStore, studentStore } from "@/main.js";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

import ChooseAvailableAssignments from "@/components/Internship/ChooseAvailableAssignments.vue";

const userAuthenticated = computed(() => mainStore.userAuthenticated);

const processInstance = ref(null);
const processInstanceInfo = ref(null);
const pendingProcessTask = ref(null);
const error = ref(null);

onMounted(async () => {
  if (userAuthenticated.value) {
    try {
      processInstance.value = mainStore.currentUser.process_instance_id;
      processInstanceInfo.value = await studentStore.getInstanceInfo(
        processInstance.value
      );
      if (
        processInstanceInfo.value.pending &&
        processInstanceInfo.value.pending.length
      ) {
        pendingProcessTask.value = processInstanceInfo.value.pending[0];
      } else {
        error.value = "No pending tasks found.";
      }
    } catch (err) {
      error.value = "An error occurred while fetching instance info.";
      console.error(err); // Log the error for debugging.
    }
  }
});

const componentMap = {
  odabiranje_zadatka_student: ChooseAvailableAssignments,
};

const currentRenderingComponent = computed(() => {
  if (error.value) {
    console.log(error.value);
    return null;
  }

  if (!userAuthenticated.value) {
    return ChooseAvailableAssignments;
  }

  return componentMap[pendingProcessTask.value] || LoadingOverlay;
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
