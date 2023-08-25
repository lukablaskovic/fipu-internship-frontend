<script setup>
import { computed } from "vue";
import { mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiViewDashboard } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import TableCompanies from "@/components/Tables/TableCompanies.vue";

const userAuthenticated = computed(() => mainStore.userAuthenticated);
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiViewDashboard"
          title="Poduzeća"
          main
        >
        </SectionTitleLineWithButton>

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox has-table>
          <TableCompanies />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
