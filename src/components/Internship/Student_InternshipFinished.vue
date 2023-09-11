<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import {
  mdiLaptop,
  mdiBallot,
  mdiCheckDecagram,
  mdiClipboardCheck,
} from "@mdi/js";

import SectionMain from "@/components/Section/SectionMain.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import { mainStore, snackBarStore, studentStore } from "@/main.js";

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
    console.log(allocated_assignment);
  } else {
    allocated_assignment.value = studentStore.allocated_assignment;
    console.log("allocated_assignment.value", allocated_assignment.value);
  }
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
    <SectionMain v-if="allocated_assignment != null">
      <SectionTitleLineWithButton :icon="mdiLaptop" title="Moja praksa" main>
      </SectionTitleLineWithButton>
      <p><b>Akademska godina:</b> 2023/2024</p>
      <p><b>Voditelj:</b> doc. dr. sc. Nikola Tanković</p>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiCheckDecagram"
        main
        title="Praksa gotova!"
      ></SectionTitleLineWithButton>
      <p>
        Vaš proces prakse je završio. Nakon što vam profesor pregleda potvrdu i
        odobori dnevnik prakse, ocjena će vam biti unesena u Studomat.
      </p>
      <p>
        Ako čekate više od 7 dana, molimo vas da se obratite voditelju prakse.
      </p>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheck"
        main
        title="Odrađeni zadatak"
      ></SectionTitleLineWithButton>
      <CardboxAllocation
        v-if="allocated_assignment != null"
        :data="allocated_assignment"
      ></CardboxAllocation>

      <br />
      <hr />

      <br />

      <hr />
    </SectionMain>
  </component>
</template>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
