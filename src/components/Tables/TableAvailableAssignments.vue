<script setup>
import { computed, ref, onMounted, watch } from "vue";

import { mdiEye } from "@mdi/js";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { mainStore, guestStore } from "@/main.js";

defineProps({
  checkable: Boolean,
});

const MAX_NUM_ASSIGNMENTS = 3;

const isModalActive = ref(null);
const allAvailableAssignments = ref([]);

let checkedAssignments = computed(() => guestStore.checkedAssignments);

onMounted(async () => {
  allAvailableAssignments.value = await guestStore.fetchAvailableAssignments();
});

const perPage = ref(5);
const currentPage = ref(0);
const assignmentsPaginated = computed(() =>
  allAvailableAssignments.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() =>
  Math.ceil(allAvailableAssignments.value.length / perPage.value)
);
const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const assignmentCheckedStates = ref({});

const disableUnchecked = computed(() => {
  return checkedAssignments.value.length >= MAX_NUM_ASSIGNMENTS;
});

watch(checkedAssignments, (newVals) => {
  newVals.forEach((assignment) => {
    assignmentCheckedStates.value[assignment["ID Zadatka"]] = false;
  });
});

const isCheckedAssignment = (assignment) => {
  return checkedAssignments.value.some(
    (a) => a["ID Zadatka"] === assignment["ID Zadatka"]
  );
};

const checked = (value, assignment) => {
  // When checking
  if (value) {
    if (checkedAssignments.value.length >= MAX_NUM_ASSIGNMENTS) {
      alert("You can only select a maximum of 3 assignments.");
      assignmentCheckedStates[assignment["ID Zadatka"]] = false;
      return;
    }
    guestStore.addAssignment(assignment);
  }

  // When unchecking
  else {
    guestStore.removeAssignment(assignment);
  }
};
</script>

<template>
  <LoadingOverlay
    :is-active="!allAvailableAssignments.length"
    title="Učitavanje..."
    description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."
  >
  </LoadingOverlay>
  <CardBoxModal
    v-if="isModalActive"
    v-model="isModalActive"
    :title="isModalActive['ID Zadatka']"
    button-label="Zatvori"
    button="fipu_blue"
    has-cancel:false
    @cancel="mainStore.activateLogoutModal(false)"
  >
    <hr />
    <div><b>Zadatak studenta:</b> {{ isModalActive["Zadatak studenta"] }}</div>
    <div><b>Poduzeće: </b>{{ isModalActive["Poduzeće"][0].value }}</div>
    <div>
      <b>Preferirane tehnologije:</b>
      {{ isModalActive["Preferirane tehnologije"] }}
    </div>

    <div>
      <b>Preferencije za studenta: </b>
      {{ isModalActive["Preferencije za studenta"] }}
    </div>

    <div>
      <b>Potrebno imati: </b>
      {{ isModalActive["Potrebno imati"] }}
    </div>
    <div>
      <b>Trajanje (sati): </b>
      {{ isModalActive["Trajanje (sati)"] }}
    </div>

    <div>
      <b>Željeno okvirno vrijeme početka: </b>
      {{ isModalActive["Željeno okvirno vrijeme početka"] }}
    </div>
    <div>
      <b>Angažman FIPU: </b>
      {{ isModalActive["Angažman FIPU"] }}
    </div>
    <div><b>Kontakt email: </b>{{ isModalActive["Kontakt email"] }}</div>
    <div><b>Lokacija: </b>{{ isModalActive["Lokacija"] }}</div>
    <div>
      <b>Napomena</b>
      {{ isModalActive["Napomena"] }}
    </div>
    <br />
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th v-if="checkable"></th>

        <th>ID Zadatka</th>
        <th>Kontakt email</th>
        <th>Preferirane tehnologije</th>
        <th>Trajanje (sati)</th>
        <th>Lokacija</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="assignment in assignmentsPaginated"
        :key="assignment['ID Zadatka']"
      >
        <TableCheckboxCell
          v-if="checkable"
          v-model="assignmentCheckedStates[assignment['ID Zadatka']]"
          :assignment-data="assignment"
          :disabled="
            disableUnchecked &&
            !assignmentCheckedStates[assignment['ID Zadatka']] &&
            !isCheckedAssignment(assignment)
          "
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
              color="fipu_blue"
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
