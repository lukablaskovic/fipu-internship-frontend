<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { mainStore, studentStore } from "@/main.js";
import LoadingOverlay from "@/components/LoadingOverlay.vue";

import Student_ChooseAvailableAssignments from "@/components/Internship/Student_ChooseAvailableAssignments.vue";
import Student_WaitingForAllocation from "@/components/Internship/Student_WaitingForAllocation.vue";
const userAuthenticated = computed(() => mainStore.userAuthenticated);

const processInstance = ref(null);
const pendingProcessTask = ref(null);
const error = ref(null);

onBeforeMount(async () => {
  if (userAuthenticated.value) {
    try {
      processInstance.value = mainStore.currentUser.internship_process.id;
      console.log(processInstance.value);
      pendingProcessTask.value = await studentStore.getPendingUserTask(
        processInstance.value
      );
    } catch (error) {
      error.value = "An error occurred while fetching instance info.";
      console.error(error);
    }
  }
});

const componentMap = {
  odabiranje_zadatka_student: Student_ChooseAvailableAssignments,
  potvrda_alociranja_profesor: Student_WaitingForAllocation,
};

const currentRenderingComponent = computed(() => {
  if (error.value) {
    console.log(error.value);
    return null;
  }

  if (!userAuthenticated.value) {
    return Student_ChooseAvailableAssignments;
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
