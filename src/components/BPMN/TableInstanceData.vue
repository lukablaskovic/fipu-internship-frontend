<script setup>
import { ref, onMounted, computed } from "vue";

import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { adminStore } from "@/main.js";

const props = defineProps({
  checkable: Boolean,
});

const isModalActive = ref(null);

const variables = ref({});

const tableAttributes = ref([]);

onMounted(async () => {
  console.log("Clicked Task ID", adminStore.bpmn_diagram.clicked_task_id);

  variables.value = adminStore.selectedStudent.process_instance_data.variables;
  console.log(variables);

  if (adminStore.bpmn_diagram.clicked_task_id == "odabiranje_zadatka_student") {
    tableAttributes.value = [
      "Prvi_odabir",
      "Drugi_odabir",
      "Treci_odabir",
      "napomena",
    ];
  } else if (adminStore.bpmn_diagram.clicked_task_id == "alociranje_profesor") {
    tableAttributes.value = ["Alocirani_zadatak"];
  }
});

const formattedVariables = computed(() => {
  return Object.keys(variables.value).reduce((acc, key) => {
    if (Array.isArray(variables.value[key])) {
      acc[key] = variables.value[key].join(", ");
    } else {
      acc[key] = variables.value[key];
    }
    return acc;
  }, {});
});
</script>

<template>
  <!--
  <LoadingOverlay
    v-if="!variables.length"
    :is-active="!variables.length"
    title="Učitavanje..."
    description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."
  >
  </LoadingOverlay>
-->
  <table class="mb-4">
    <thead class="text-sm">
      <tr>
        <th v-for="(attribute, index) in tableAttributes" :key="index">
          {{ tableAttributes[index] }}
        </th>
      </tr>
    </thead>
    <tbody class="text-sm">
      <tr>
        <td
          v-for="(attribute, index) in tableAttributes"
          :key="index"
          :data-label="attribute"
        >
          {{ formattedVariables[attribute] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
