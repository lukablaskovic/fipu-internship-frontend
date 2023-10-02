<script setup>
import { adminStore } from "@/main.js";
import { mdiClipboardCheck, mdiFilePdfBox } from "@mdi/js";
import VuePdfEmbed from "vue-pdf-embed";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableAllocations from "@/components/Tables/TableAllocations.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
</script>

<template>
  <div>
    <LayoutAuthenticated>
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiClipboardCheck"
          title="Alokacije Prakse"
          main
        >
        </SectionTitleLineWithButton>

        <CardBox has-table>
          <TableAllocations />
        </CardBox>

        <CardBoxModal
          v-model="adminStore.pdfModalActive"
          title=""
          button-label="Zatvori"
          :has-confirm="false"
          large=""
        >
          <div class="mt-6">
            <SectionTitleLineWithButton
              :icon="mdiFilePdfBox"
              :title="adminStore.modalTitle"
              main
            >
            </SectionTitleLineWithButton>
            <div class="flex justify-center">
              <vue-pdf-embed
                height="1080"
                class="mb-6"
                :source="adminStore.pdfSource"
              />
            </div>
          </div>
        </CardBoxModal>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
