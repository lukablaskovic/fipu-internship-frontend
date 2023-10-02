<script setup>
import { ref } from "vue";
import {
  mdiClipboardTextOutline,
  mdiClipboardPlusOutline,
  mdiClipboardCheck,
  mdiContentCopy,
  mdiClipboardTextOff,
} from "@mdi/js";
import { mainStore, adminStore } from "@/main";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TableAvailableAssignments from "@/components/Tables/TableAvailableAssignments.vue";
import TableRejectedAssignments from "@/components/Tables/TableRejectedAssignments.vue";
import TableNewAssignments from "@/components/Tables/TableNewAssignments.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";

const VITE_DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL;

const addNewAssignmentLink = ref(
  `${VITE_DASHBOARD_URL}/#/poslodavci/novi-zadatak`
);
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="mainStore.userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiClipboardPlusOutline"
          title="Novi zadaci (u razradi)"
          main
        >
        </SectionTitleLineWithButton>

        <FormField class="md:w-1/2" label="Forma za prijavu novog zadatka">
          <FormControl
            v-model="addNewAssignmentLink"
            :icon-left="mdiClipboardCheck"
            :icon-right="mdiContentCopy"
            name="addNewAssignmentLink"
            readonly
            copyable
          />
        </FormField>

        <p class="mb-4">
          U tablici ispod se nalaze novo-prijavljeni zadaci koje je potrebno
          proučiti te odobriti kako bi ih studenti mogli prijaviti, ili odbiti
          ukoliko ne zadovoljavaju definirane zahtjeve.
        </p>

        <CardBox has-table>
          <TableNewAssignments />
        </CardBox>

        <CardBox v-if="!adminStore.newAssignments.length">
          <CardBoxComponentEmpty />
        </CardBox>

        <SectionTitleLineWithButton
          class="mt-8"
          :icon="mdiClipboardTextOutline"
          title="Aktivni (Odobreni) Zadaci"
          main
        >
        </SectionTitleLineWithButton>

        <CardBox has-table>
          <TableAvailableAssignments />
        </CardBox>

        <SectionTitleLineWithButton
          class="mt-8"
          :icon="mdiClipboardTextOff"
          title="Odbijeni zadaci"
          main
        >
        </SectionTitleLineWithButton>

        <CardBox has-table>
          <TableRejectedAssignments />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
<style scoped>
.copy-container {
  position: relative;
  cursor: pointer;
}

.copy-icon {
  position: absolute;
  right: 0.5rem; /* You can adjust this */
  top: 0.5rem; /* You can adjust this */
  opacity: 0;
  transition: opacity 0.2s;
}

.copy-container:hover .copy-icon {
  opacity: 1;
}
</style>
