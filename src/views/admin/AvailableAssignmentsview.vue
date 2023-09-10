<script setup>
import { computed } from "vue";
import { mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiClipboardTextOutline } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import TableCompanies from "@/components/Tables/TableCompanies.vue";
import router from "@/router";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import TableAvailableAssignments from "@/components/Tables/TableAvailableAssignments.vue";
const userAuthenticated = computed(() => mainStore.userAuthenticated);
const userAdmin = computed(() => mainStore.userAdmin);
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiClipboardTextOutline"
          title="Dostupni zadaci"
          main
        >
        </SectionTitleLineWithButton>

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox has-table>
          <TableAvailableAssignments />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
