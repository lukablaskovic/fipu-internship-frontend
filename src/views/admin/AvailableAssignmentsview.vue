<script setup>
import { ref } from "vue";
import {
  mdiClipboardTextOutline,
  mdiClipboardPlusOutline,
  mdiClipboardCheck,
  mdiContentCopy,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import TableAvailableAssignments from "@/components/Tables/TableAvailableAssignments.vue";
import TableNewAssignments from "@/components/Tables/TableNewAssignments.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import { mainStore } from "@/main";

const addNewAssignmentLink = ref(
  "http://localhost:5173/#/poslodavci/novi-zadatak"
);
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="mainStore.userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiClipboardPlusOutline"
          title="Novi zadaci"
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

        <CardBox has-table>
          <TableNewAssignments />
        </CardBox>

        <SectionTitleLineWithButton
          class="mt-4"
          :icon="mdiClipboardTextOutline"
          title="Dostupni zadaci"
          main
        >
        </SectionTitleLineWithButton>

        <CardBox has-table>
          <TableAvailableAssignments />
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
