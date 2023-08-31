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

import SectionMain from "@/components/Section/SectionMain.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";

import { mainStore, studentStore } from "@/main.js";

const prviOdabir = ref(null);
const drugiOdabir = ref(null);
const treciOdabir = ref(null);

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
        title="U procesu evaluacije"
      ></SectionTitleLineWithButton>
      <p>Alocirani ste na zadatak {{ zadatak }}.</p>
      <p>
        Potrebno je kontaktirati mentora sa zadatka na koji ste alocirani.
        Predstavite se i recite da ste dobili zadatak.
      </p>
      <p>
        Ukoliko je potrebno morate obaviti intervju ili proces selekcije, ako
        poslodavac to traži od vas.
      </p>
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheckOutline"
        main
        title="Alocirani zadatak"
      ></SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          color="text-fipu_blue"
          :icon="mdiNumeric1Circle"
          :number="null"
          :text="prviOdabir"
          label="1. odabir"
        />
        <CardBoxWidget
          color="text-fipu_blue"
          :icon="mdiNumeric2CircleOutline"
          :number="null"
          :text="drugiOdabir"
          label="2. odabir"
        />
        <CardBoxWidget
          color="text-fipu_blue"
          :icon="mdiNumeric3CircleOutline"
          :number="null"
          :text="treciOdabir"
          label="3. odabir"
        />
      </div>
    </SectionMain>
  </component>
</template>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
