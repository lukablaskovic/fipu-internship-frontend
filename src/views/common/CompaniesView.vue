<script setup>
import { computed } from "vue";
import { mainStore } from "@/main.js";
import {
  mdiMonitorCellphone,
  mdiDomain,
  mdiDomainPlus,
  mdiLaptop,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import TableCompanies from "@/components/Tables/TableCompanies.vue";
import TableNewCompanies from "@/components/Tables/TableNewCompanies.vue";
import { router } from "@/router";
import BaseIcon from "@/components/Base/BaseIcon.vue";
const userAuthenticated = computed(() => mainStore.userAuthenticated);
const userAdmin = computed(() => mainStore.userAdmin);
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <div v-if="userAdmin">
          <SectionTitleLineWithButton
            :icon="mdiDomainPlus"
            title="Novi Poslodavci"
            main
          >
          </SectionTitleLineWithButton>
          <p class="mb-4">
            U tablici se nalaze poduzeća koja su prijavili zadatke za izvođenje
            prakse međutim još nisu registrirani za provođenje - potrebno je
            ručno unijeti podatke o poduzeću.
          </p>

          <CardBox has-table>
            <TableNewCompanies />
          </CardBox>
        </div>
        <SectionTitleLineWithButton
          class="mt-4"
          :icon="mdiDomain"
          title="Svi Poslodavci"
          main
        >
        </SectionTitleLineWithButton>
        <p class="mb-4">
          U tablici se nalaze poduzeća koja su registrirana za provođenje
          studentske prakse u suradnji s Fakultetom informatike u Puli.
        </p>
        <div v-if="!userAdmin" class="mb-4">
          <p class="text-sm md:text-base">
            Ukoliko ne možete naći zadatak koji vam se sviđa, javite se
            poslodavcu, predstavite se i zamolite ih da ispune zadatak
            <a href="">putem ove poveznice</a>.
          </p>
          <p class="flex flex-wrap items-center text-sm md:text-base">
            Nakon što poslodavac ispuni zadatak, prijavite ga u
            <span
              class="text-fipu_blue cursor-pointer inline-flex items-center md:ml-1 whitespace-normal"
              @click="router.push('/moja-praksa')"
            >
              <BaseIcon
                :path="mdiLaptop"
                class="flex-none align-middle"
                :size="18"
              ></BaseIcon>

              Moja praksa
            </span>
          </p>
        </div>

        <CardBox has-table>
          <TableCompanies />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
