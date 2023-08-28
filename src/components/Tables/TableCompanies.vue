<script setup>
import { computed, ref, onMounted } from "vue";

import { mdiWeb } from "@mdi/js";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { mainStore } from "@/main.js";

defineProps({
  checkable: Boolean,
});

const allCompanies = ref([]);

onMounted(async () => {
  allCompanies.value = await mainStore.getCompanies();
});

const goToCompanyWeb = (url) => {
  window.open(url, "_blank");
};

const perPage = ref(5);
const currentPage = ref(0);
const companiesPaginated = computed(() =>
  allCompanies.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() =>
  Math.ceil(allCompanies.value.length / perPage.value)
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
    :is-active="!allCompanies.length"
    title="Učitavanje..."
    description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."
  >
  </LoadingOverlay>
  <table>
    <thead>
      <tr>
        <th>Naziv</th>
        <th>Web mjesto</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="company in companiesPaginated" :key="company['JMBAG']">
        <TableCheckboxCell v-if="checkable" :assignment-data="company" />

        <td data-label="Naziv">
          {{ company["Naziv"] }}
        </td>
        <td data-label="Web mjesto">
          <a class="underline" :href="company['Web']" target="_blank">{{
            company["Web"]
          }}</a>
        </td>

        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="fipu_blue"
              :icon="mdiWeb"
              small
              @click="goToCompanyWeb(company['Web'])"
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
