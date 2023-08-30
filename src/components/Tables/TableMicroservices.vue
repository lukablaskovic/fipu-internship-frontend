<script setup>
import { computed, ref, onMounted } from "vue";

import { mdiEye } from "@mdi/js";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { adminStore } from "@/main.js";

defineProps({
  checkable: Boolean,
});

const isModalActive = ref(null);
const allModels = ref([]);

onMounted(async () => {
  allModels.value = await adminStore.searchModels();
});

const perPage = ref(5);
const currentPage = ref(0);
const modelsPaginated = computed(() =>
  allModels.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() =>
  Math.ceil(allModels.value.length / perPage.value)
);
const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});
</script>

<template>
  <LoadingOverlay
    :is-active="!allModels.length"
    title="Učitavanje..."
    description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."
  >
  </LoadingOverlay>
  <table>
    <thead>
      <tr>
        <th>File</th>
        <th>Process ID</th>
        <th>Process</th>
        <th>Active instances</th>
        <th>Tasks</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="model in modelsPaginated" :key="model['model_path']">
        <TableCheckboxCell v-if="checkable" :assignment-data="model" />

        <td data-label="File">
          {{ model["model_path"] }}
        </td>
        <td data-label="Process ID">
          {{ model["main_process"]["id"] }}
        </td>
        <td data-label="Process">
          {{ model["main_process"]["name"] }}
        </td>
        <td data-label="Active instances">
          {{ model["instances"]["length"] }}
        </td>
        <td data-label="Tasks">
          {{ model["tasks"]["length"] }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="fipu_blue"
              :icon="mdiEye"
              small
              @click="isModalActive = model"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
