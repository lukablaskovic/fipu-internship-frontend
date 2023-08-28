<script setup>
import { computed, ref, onMounted } from "vue";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { studentStore } from "@/main.js";

defineProps({
  checkable: Boolean,
});

const allocations = ref([]);

const filteredAllocations = computed(() => {
  return allocations.value.filter(
    (allocation) =>
      allocation["Alocirani zadatak"] && allocation["Opis zadatka"]
  );
});

onMounted(async () => {
  allocations.value = await studentStore.getAllocationsPublic();
  console.log(allocations.value);
});

const perPage = ref(5);
const currentPage = ref(0);
const allocationsPaginated = computed(() =>
  filteredAllocations.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() =>
  Math.ceil(allocations.value.length / perPage.value)
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
    :is-active="!allocations.length"
    title="Učitavanje..."
    description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."
  >
  </LoadingOverlay>
  <table>
    <thead>
      <tr>
        <th>JMBAG</th>
        <th>Alocirani zadatak</th>
        <th>Opis zadatka</th>
        <th>Kontakt</th>
        <th>Prijavnica ispunjena</th>
        <th>Dnevnik prakse predan</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="allocation in allocationsPaginated" :key="allocation['JMBAG']">
        <TableCheckboxCell v-if="checkable" :assignment-data="company" />

        <td data-label="JMBAG">
          {{ allocation["JMBAG"] }}
        </td>
        <td data-label="Alocirani zadatak">
          {{ allocation["Alocirani zadatak"] }}
        </td>
        <td data-label="Opis zadatka">
          {{ allocation["Opis zadatka"] }}
        </td>

        <td data-label="Kontakt">
          {{ allocation["Kontakt"] }}
        </td>

        <td data-label="Prijavnica ispunjena">
          <TableCheckboxCell
            readonly
            :value="allocation['prijavnica_ispunjena']"
          />
        </td>
        <td data-label="Prijavnica ispunjena">
          <TableCheckboxCell
            readonly
            :value="allocation['predan_dnevnik_prakse']"
          />
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
