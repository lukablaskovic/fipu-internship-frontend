<script setup>
import { computed, ref, reactive, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { useGuestStore } from "@/stores/guest";
import { mdiEye } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";

defineProps({
  checkable: Boolean,
});

const mainStore = useMainStore();
const guestStore = useGuestStore();
//const items = computed(() => mainStore.clients);

const isModalActive = ref(null);

const perPage = ref(5);

const currentPage = ref(0);

const checkedRows = reactive([]);

const items = ref([]);

onMounted(async () => {
  items.value = await guestStore.fetchAvailableAssignments();
  console.log(items.value);
});

const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const remove = (arr, cb) => {
  const newArr = [];

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item);
    }
  });

  return newArr;
};

const checked = (isChecked, assignment) => {
  if (isChecked) {
    checkedRows.value.push(assignment);
  } else {
    checkedRows.value = remove(
      checkedRows.value,
      (row) => row.id === assignment.id
    );
  }
};
</script>

<template>
  <CardBoxModal
    v-if="isModalActive"
    v-model="isModalActive"
    title="ID Zadatka"
    has-cancel
    @cancel="mainStore.activateLogoutModal(false)"
  >
    <div>{{ isModalActive["ID Zadatka"] }}</div>
    <div>{{ isModalActive["Kontakt email"] }}</div>
  </CardBoxModal>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ checkedRow.name }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />

        <th>ID Zadatka</th>
        <th>Kontakt email</th>
        <th>Preferirane tehnologije</th>
        <th>Trajanje (sati)</th>
        <th>Lokacija</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="assignment in itemsPaginated" :key="assignment.id">
        <TableCheckboxCell
          v-if="checkable"
          @checked="checked($event, assignment)"
        />

        <td data-label="ID Zadatka">
          {{ assignment["ID Zadatka"] }}
        </td>
        <td data-label="Kontakt email">
          {{ assignment["Kontakt email"] }}
        </td>
        <td data-label="Preferirane tehnologije">
          {{ assignment["Preferirane tehnologije"] }}
        </td>
        <td data-label="Trajanje (sati)">
          {{ assignment["Trajanje (sati)"] }}
        </td>
        <td data-label="Lokacija">
          {{ assignment["Lokacija"] }}
        </td>

        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="isModalActive = assignment"
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
