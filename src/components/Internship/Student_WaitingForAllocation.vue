<script setup>
import { ref, computed, onMounted } from "vue";
import {
  mdiClipboardCheckOutline,
  mdiProgressClock,
  mdiLaptop,
  mdiNumeric1Circle,
  mdiNumeric2CircleOutline,
  mdiNumeric3CircleOutline,
} from "@mdi/js";

const isModalActive = ref(null);

import SectionMain from "@/components/Section/SectionMain.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";

import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import { mainStore, studentStore } from "@/main.js";

const prviOdabir = ref(null);
const drugiOdabir = ref(null);
const treciOdabir = ref(null);

let modalLoading = ref(false);

onMounted(async () => {
  let result = await studentStore.getInstanceInfo(
    mainStore.currentUser.internship_process.id
  );
  prviOdabir.value = result.variables["Prvi_odabir"][0];
  drugiOdabir.value = result.variables["Drugi_odabir"][0];
  treciOdabir.value = result.variables["Treci_odabir"][0];
});

const Layout = computed(() => {
  if (userAuthenticated.value) {
    return LayoutAuthenticated;
  } else {
    return LayoutGuest;
  }
});

async function getAssignmentDetailsInModal(assignment_id) {
  modalLoading.value = true;
  let assignment = await studentStore.getAssignmentDetails(assignment_id);
  isModalActive.value = assignment.data.results[0];
  modalLoading.value = false;
}

const userAuthenticated = computed(() => mainStore.userAuthenticated);
</script>

<template>
  <component :is="Layout">
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiLaptop" title="Moja praksa" main>
      </SectionTitleLineWithButton>
      <p><b>Akademska godina:</b> 2023/2024</p>
      <p><b>Voditelj:</b> doc. dr. sc. Nikola Tanković</p>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiProgressClock"
        main
        title="U procesu alokacije"
      ></SectionTitleLineWithButton>
      <p>
        Zadatak vam još nije dodijeljen. Ako čekate više od 10 dana, javite se
        profesoru.
      </p>
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheckOutline"
        main
        title="Vaš odabir"
      ></SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          :class="modalLoading ? 'cursor-wait' : 'cursor-pointer'"
          color="text-fipu_blue"
          hoverable
          :icon="mdiNumeric1Circle"
          :number="null"
          :text="prviOdabir"
          label="1. odabir"
          @click="getAssignmentDetailsInModal(prviOdabir)"
        />

        <CardBoxWidget
          :class="modalLoading ? 'cursor-wait' : 'cursor-pointer'"
          color="text-fipu_blue"
          hoverable
          :icon="mdiNumeric2CircleOutline"
          :number="null"
          :text="drugiOdabir"
          label="2. odabir"
          @click="getAssignmentDetailsInModal(drugiOdabir)"
        />
        <CardBoxWidget
          :class="modalLoading ? 'cursor-wait' : 'cursor-pointer'"
          color="text-fipu_blue"
          hoverable
          :icon="mdiNumeric3CircleOutline"
          :number="null"
          :text="treciOdabir"
          label="3. odabir"
          @click="getAssignmentDetailsInModal(treciOdabir)"
        />
      </div>
      <CardBoxModal
        v-if="isModalActive"
        v-model="isModalActive"
        :title="isModalActive['id_zadatak']"
        button-label="Zatvori"
        button="fipu_blue"
        has-cancel:false
      >
        <hr />
        <div><b>Zadatak studenta:</b> {{ isModalActive["opis_zadatka"] }}</div>
        <div><b>Poslodavac: </b>{{ isModalActive["Poslodavac"][0].value }}</div>
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
        <div><b>Kontakt email: </b>{{ isModalActive["poslodavac_email"] }}</div>
        <div><b>Lokacija: </b>{{ isModalActive["lokacija"] }}</div>
        <div>
          <b>Napomena</b>
          {{ isModalActive["napomena"] }}
        </div>
        <br />
      </CardBoxModal>
    </SectionMain>
  </component>
</template>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
