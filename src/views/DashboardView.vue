<script setup>
import { computed, ref, onMounted } from "vue";
import { adminStore, mainStore } from "@/main.js";
import {
  mdiAccountMultiple,
  mdiAccountSchoolOutline,
  mdiPlayPause,
  mdiReload,
  mdiChartPie,
  mdiViewDashboard,
  mdiCommentProcessing,
} from "@mdi/js";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBoxWidget from "@/components/CardBoxWidget.vue";
import CardBox from "@/components/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBoxTransaction from "@/components/CardBoxTransaction.vue";
import CardBoxClient from "@/components/CardBoxClient.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

mainStore.fetchCurrentUser();

const clientBarItems = computed(() => mainStore.clients.slice(0, 4));
const userAuthenticated = computed(() => mainStore.userAuthenticated);
const transactionBarItems = computed(() => mainStore.history);

onMounted(async () => {
  let data = await adminStore.getStudents();
  console.log(data);
});
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiViewDashboard"
          title="Nadzorna ploča"
          main
        >
        </SectionTitleLineWithButton>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <CardBoxWidget
            trend="12%"
            trend-type="up"
            color="text-emerald-500"
            :icon="mdiAccountSchoolOutline"
            :number="512"
            label="Uspješno odrađenih praksi"
          />
          <CardBoxWidget
            trend="12%"
            trend-type="down"
            color="text-blue-500"
            :icon="mdiAccountMultiple"
            :number="47"
            label="Studenti u procesu prakse"
          />
          <CardBoxWidget
            trend="Upozorenje"
            trend-type="alert"
            color="text-red-500"
            :icon="mdiPlayPause"
            :number="10"
            label="Studenti koji čekaju alokaciju"
          />
        </div>
        <SectionTitleLineWithButton
          :icon="mdiCommentProcessing"
          title="Najnoviji događaji"
          main
        >
        </SectionTitleLineWithButton>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="flex flex-col justify-between">
            <CardBoxTransaction
              v-for="(transaction, index) in transactionBarItems"
              :key="index"
              :amount="transaction.amount"
              :date="transaction.date"
              :business="transaction.business"
              :type="transaction.type"
              :name="transaction.name"
              :account="transaction.account"
            />
          </div>
          <div class="flex flex-col justify-between">
            <CardBoxClient
              v-for="client in clientBarItems"
              :key="client.id"
              :name="client.name"
              :login="client.login"
              :date="client.created"
              :progress="client.progress"
            />
          </div>
        </div>

        <CardBox class="mb-6">
          <div v-if="chartData">
            <line-chart :data="chartData" class="h-96" />
          </div>
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
