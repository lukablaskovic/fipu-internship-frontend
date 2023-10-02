<script setup>
import { ref, computed, onMounted } from "vue";
import { mdiProgressClock, mdiLaptop, mdiClipboardCheck } from "@mdi/js";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionMain from "@/components/Section/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";

import { mainStore, studentStore } from "@/main.js";

const allocated_assignment = ref(null);
onMounted(async () => {
  await studentStore.getInstanceInfo(
    mainStore.currentUser.internship_process.id
  );

  if (studentStore.allocated_assignment == null) {
    let result = await studentStore.getAssignmentDetails(
      studentStore.student_process_instance_data.variables["Alocirani_zadatak"]
    );
    studentStore.allocated_assignment = result.data.results[0];

    allocated_assignment.value = result.data.results[0];
  } else {
    allocated_assignment.value = studentStore.allocated_assignment;
    console.log("allocated_assignment.value", allocated_assignment.value);
  }
});

const Layout = computed(() => {
  if (mainStore.userAuthenticated) {
    return LayoutAuthenticated;
  } else {
    return LayoutGuest;
  }
});
</script>

<template>
  <component :is="Layout">
    <SectionMain v-if="allocated_assignment != null">
      <SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main>
      </SectionTitleLineWithButton>
      <p><b>Akademska godina:</b> 2023/2024</p>
      <p><b>Voditelj:</b> doc. dr. sc. Nikola Tanković</p>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiProgressClock"
        main
        title="U procesu Evaluacije"
      ></SectionTitleLineWithButton>
      <p>
        Alocirani ste na zadatak:
        <b>{{ studentStore.allocated_assignment["id_zadatak"] }} </b>
      </p>
      <p>
        Mentora kontaktirajte putem maila:
        <b>{{ studentStore.allocated_assignment["poslodavac_email"] }}</b
        >.
      </p>
      <br />
      <p>
        Predstavite se i recite da ste dobili zadatak. Ukoliko se provodi
        selekcija, morat ćete istu obaviti u dogovoru s poslodavcem.
      </p>
      <p>
        Kada vas poslodavac prihvati, o tome ćete biti pravovremeno obaviješteni
        te morate dogovoriti datum početka prakse i ostale detalje.
        <u>Nakon</u> što to obavite, ovdje ćete popuniti <b>Prijavnicu</b> prije
        početka izvođenja same prakse.
      </p>

      <br />
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheck"
        main
        title="Alocirani zadatak"
      ></SectionTitleLineWithButton>
      <CardboxAllocation
        v-if="allocated_assignment != null"
        :data="allocated_assignment"
      ></CardboxAllocation>
    </SectionMain>
  </component>
</template>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
