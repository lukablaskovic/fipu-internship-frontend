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
  const result = await guestStore.fetchAvailableAssignments();
  console.log(result);
  allAvailableAssignments.value = result.filter(
    (task) =>
      task.dostupno_mjesta > 0 && task.voditelj_odobrio.value == "odobreno"
  );

  guestStore.resetAssignments();
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
    assignmentCheckedStates.value[assignment["id_zadatak"]] = false;
  });
});

const isCheckedAssignment = (assignment) => {
  return checkedAssignments.value.some(
    (a) => a["id_zadatak"] === assignment["id_zadatak"]
  );
};

const checked = (value, assignment) => {
  // When checking
  if (value) {
    if (checkedAssignments.value.length >= MAX_NUM_ASSIGNMENTS) {
      alert("You can only select a maximum of 3 assignments.");
      assignmentCheckedStates[assignment["id_zadatak"]] = false;
      return;
    }
    guestStore.addAssignment(assignment);
  } else {
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
    :title="'📃' + isModalActive['id_zadatak']"
    button-label="Zatvori"
    button="fipu_blue"
    has-cancel:false
    @cancel="mainStore.activateLogoutModal(false)"
  >
    <hr />
    <div><b>Poslodavac: </b>{{ isModalActive["Poslodavac"][0].value }}</div>

    <div><b>Zadatak studenta:</b> {{ isModalActive["opis_zadatka"] }}</div>
    <div v-if="mainStore.userAdmin">
      <b>Broj studenata (max):</b> {{ isModalActive["broj_studenata"] }}
    </div>

    <div v-if="mainStore.userAdmin">
      <b>Dostupno mjesta:</b> {{ isModalActive["dostupno_mjesta"] }}
    </div>

    <div>
      <b>Preferirane tehnologije:</b>
      {{ isModalActive["preferirane_tehnologije"] }}
    </div>

    <div>
      <b>Preferencije za studenta: </b>
      {{ isModalActive["preferencije_za_studenta"] }}
    </div>

    <div>
      <b>Potrebno imati: </b>
      {{ isModalActive["potrebno_imati"] }}
    </div>
    <div>
      <b>Trajanje (sati): </b>
      {{ isModalActive["trajanje_sati"] }}
    </div>

    <div>
      <b>Željeno okvirno vrijeme početka: </b>
      {{ isModalActive["zeljeno_okvirno_vrijeme_pocetka"] }}
    </div>
    <div>
      <b>Angažman FIPU: </b>
      {{ isModalActive["angazman_fipu"] }}
    </div>
    <div>
      <b>Kontakt email: </b>
      <span class="underline">{{ isModalActive["poslodavac_email"] }}</span>
    </div>
    <div><b>Lokacija: </b>{{ isModalActive["lokacija"] }}</div>
    <div>
      <b>Angažman FIPU: </b>
      {{ isModalActive["angazman_fipu"] }}
    </div>
    <div v-if="mainStore.userAdmin">
      <b>Broj studenata (max):: </b>
      {{ isModalActive["broj_studenata"] }}
    </div>
    <div v-if="mainStore.userAdmin">
      <b>Dostupno mjesta</b>
      {{ isModalActive["dostupno_mjesta"] }}
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
        <th v-if="mainStore.userAdmin">Max. mjesta</th>
        <th v-if="mainStore.userAdmin">Dostupno mjesta</th>

        <th />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="assignment in assignmentsPaginated"
        :key="assignment['id_zadatak']"
      >
        <TableCheckboxCell
          v-if="checkable"
          :value="isCheckedAssignment(assignment)"
          :disabled="disableUnchecked && !isCheckedAssignment(assignment)"
          @checked="checked($event, assignment)"
        />

        <td data-label="id_zadatak">
          {{ assignment["id_zadatak"] }}
        </td>
        <td data-label="Kontakt email">
          {{ assignment["poslodavac_email"] }}
        </td>
        <td data-label="Preferirane tehnologije">
          {{ assignment["preferirane_tehnologije"] }}
        </td>
        <td data-label="Trajanje (sati)">
          {{ assignment["trajanje_sati"] }}
        </td>
        <td data-label="Lokacija">
          {{ assignment["lokacija"] }}
        </td>

        <td v-if="mainStore.userAdmin" data-label="Max. studenata">
          {{ assignment["broj_studenata"] }}
        </td>

        <td v-if="mainStore.userAdmin" data-label="Dostupno mjesta">
          {{ assignment["dostupno_mjesta"] }}
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
