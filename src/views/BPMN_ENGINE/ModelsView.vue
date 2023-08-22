<script setup>
import { computed } from "vue";
import { mainStore } from "@/main.js";
import { mdiFileXmlBox } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import TableModels from "@/components/TableModels.vue";
import FormField from "@/components/FormField.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
mainStore.fetchCurrentUser();

const userAuthenticated = computed(() => mainStore.userAuthenticated);
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiFileXmlBox"
          title="Učitani BPMN modeli"
          main
        >
        </SectionTitleLineWithButton>
        <CardBox has-table>
          <TableModels />
        </CardBox>
        <FormField label="Avatar" help="Dozvoljeno: .xml i .bpmn">
          <FormFilePicker label="Prenesi" />
        </FormField>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
