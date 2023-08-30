<script setup>
import { ref, onMounted } from "vue";

import { mdiEye } from "@mdi/js";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";

import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { adminStore } from "@/main.js";

defineProps({
  checkable: Boolean,
});

const isModalActive = ref(null);
const registeredPreferences = ref([]);

const prviOdabir = ref({});
const drugiOdabir = ref({});
const treciOdabir = ref({});

const selectedAssignmentId = ref(null);
const preferencesArray = ref([]);

const emit = defineEmits(["rowSelected"]);

const selectAssignment = (assignment) => {
  selectedAssignmentId.value = assignment["ID Zadatka"];
  emit("rowSelected", assignment["ID Zadatka"]);
};

onMounted(async () => {
  registeredPreferences.value = await adminStore.getPreferencesDetailed(
    adminStore.selectedStudent["JMBAG"]
  );
  prviOdabir.value = registeredPreferences.value["Prvi odabir"][0]["details"];
  drugiOdabir.value = registeredPreferences.value["Drugi odabir"][0]["details"];
  treciOdabir.value = registeredPreferences.value["Treći odabir"][0]["details"];

  preferencesArray.value = [
    prviOdabir.value,
    drugiOdabir.value,
    treciOdabir.value,
  ];
});
</script>

<template>
  <CardBoxModal
    v-if="isModalActive"
    v-model="isModalActive"
    :title="isModalActive['ID Zadatka']"
    button-label="Zatvori"
    button="fipu_blue"
    has-cancel:false
  >
    <hr />
    <div><b>Zadatak studenta:</b> {{ isModalActive["Zadatak studenta"] }}</div>
    <div><b>Poslodavac: </b>{{ isModalActive["Poslodavac"][0].value }}</div>
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

  <LoadingOverlay
    v-if="!preferencesArray.length"
    :is-active="!preferencesArray.length"
    title="Učitavanje..."
    description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."
  >
  </LoadingOverlay>

  <table v-else>
    <thead class="text-sm">
      <tr>
        <th>Odabir</th>
        <th>ID Zadatka</th>
        <th>Kontakt email</th>
        <th>Lokacija</th>
        <th />
      </tr>
    </thead>
    <tbody class="text-sm">
      <tr
        v-for="(assignment, index) in preferencesArray"
        :key="assignment['ID Zadatka']"
        :class="{
          'selected-row': selectedAssignmentId === assignment['ID Zadatka'],
          'cursor-pointer': true,
        }"
        @click="selectAssignment(assignment)"
      >
        <td data-label="Odabir">{{ index + 1 }}</td>
        <td data-label="ID Zadatka">{{ assignment["ID Zadatka"] }}</td>
        <td data-label="Kontakt email">{{ assignment["Kontakt email"] }}</td>
        <td data-label="Lokacija">{{ assignment["Lokacija"] }}</td>
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
</template>

<style scoped></style>
