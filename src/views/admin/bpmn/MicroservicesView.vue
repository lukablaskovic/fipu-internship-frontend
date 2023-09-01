<script setup>
import { computed, ref, onMounted } from "vue";
import { mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiCloudCog } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import TableMicroservices from "@/components/Tables/TableMicroservices.vue";

import { Control } from "@/services/microservices_control";

const servicesStatus = ref({});

onMounted(async () => {
  try {
    servicesStatus.value = await Control.checkAllServiceStatuses();
    console.log(servicesStatus.value);
  } catch (error) {
    console.error("Failed to fetch service statuses:", error);
  }
});
</script>

<template>
  <div>
    <LayoutAuthenticated>
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiCloudCog"
          title="Mikroservisi"
          main
        >
        </SectionTitleLineWithButton>

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox v-if="Object.keys(servicesStatus).length" has-table>
          <TableMicroservices :services="servicesStatus" />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
