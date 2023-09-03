<script setup>
import { computed } from "vue";
import { mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiClipboardCheck, mdiLaptop } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import TableAllocations from "@/components/Tables/TableAllocations.vue";
import router from "@/router";
import BaseIcon from "@/components/Base/BaseIcon.vue";
const userAuthenticated = computed(() => mainStore.userAuthenticated);
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiClipboardCheck"
          :title="
            mainStore.userAdmin ? 'Alokacije' : 'Alokacije - Javni prikaz'
          "
          main
        >
        </SectionTitleLineWithButton>

        <div v-if="!mainStore.userAdmin" class="mb-4">
          <p class="text-sm md:text-base">
            Ovdje možete pronaći javni popis alociranih zadataka. Ukoliko se ne
            možete pronaći znači da vas profesor još nije alocirao te morate
            pričekati.
          </p>
          <p class="flex flex-wrap items-center text-sm md:text-base">
            Ako još niste prijavili zadatak, to možete učiniti u
            <span
              class="text-fipu_blue cursor-pointer inline-flex items-center md:ml-2 whitespace-normal"
              @click="router.push('/moja-praksa')"
            >
              <BaseIcon
                :path="mdiLaptop"
                class="flex-none align-middle mr-1"
                :size="18"
              ></BaseIcon>

              Moja praksa
            </span>
          </p>
        </div>

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox has-table>
          <TableAllocations />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
