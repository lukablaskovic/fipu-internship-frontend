<script setup>
import { computed } from "vue";
import { mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiDomain, mdiLaptop } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import TableCompanies from "@/components/Tables/TableCompanies.vue";
import router from "@/router";
import BaseIcon from "@/components/Base/BaseIcon.vue";
const userAuthenticated = computed(() => mainStore.userAuthenticated);
const userAdmin = computed(() => mainStore.userAdmin);
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiDomain" title="Poslodavci" main>
        </SectionTitleLineWithButton>

        <div v-if="!userAdmin" class="mb-4">
          <p class="text-sm md:text-base">
            Ukoliko ne možete naći zadatak koji vam se sviđa, javite se
            poslodavcu, predstavite se i zamolite ih da ispune zadatak.
          </p>
          <p class="flex flex-wrap items-center text-sm md:text-base">
            Nakon što poslodavac ispuni zadatak, prijavite ge u
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
          <TableCompanies />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
