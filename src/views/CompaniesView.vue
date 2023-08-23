<script setup>
import { computed } from "vue";
import { mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiViewDashboard } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import NotificationBar from "@/components/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

import TableAllCompanies from "@/components/Tables/TableAllCompanies.vue";

mainStore.fetchCurrentUser();

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
          <TableAllCompanies />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
