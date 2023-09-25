<script setup>
import { computed, ref, onMounted } from "vue";
import { mainStore } from "@/main.js";
import {
  mdiAccountMultiple,
  mdiAccountSchoolOutline,
  mdiChartTimelineVariant,
  mdiMonitorCellphone,
  mdiReload,
  mdiChartPie,
  mdiChartBar,
  mdiCommentProcessing,
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import TableSampleClients from "@/components/Tables/TableSampleClients.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBoxEvents from "@/components/Cardbox/CardBoxEvents.vue";
import CardBoxClient from "@/components/Cardbox/CardBoxClient.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import SectionBannerStarOnGitHub from "@/components/Section/SectionBannerStarOnGitHub.vue";

import axios from "axios";
const bpmn_model = ref(null);
const chartData = ref(null);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

onMounted(async () => {
  fillChartData();
  bpmn_model.value = await fetchXML();
});

const clientBarItems = computed(() => mainStore.clients.slice(0, 4));
const userAuthenticated = computed(() => mainStore.userAuthenticated);
const transactionBarItems = computed(() => mainStore.history);

async function fetchXML() {
  try {
    // Make sure to set the responseType to 'text' since we're reading the XML as a string.
    const response = await axios.get(
      `/bpmn_xml/${mainStore.bpmn_process_name}.xml`,
      {
        responseType: "text",
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch XML:", error);
  }
}
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton :icon="mdiChartBar" title="Statistika" main>
        </SectionTitleLineWithButton>
        <!--
      <div>
        <BpmnDiagram v-if="bpmn_model" :xml="bpmn_model" />
      </div>
      -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <CardBoxWidget
            trend="12%"
            trend-type="up"
            color="text-lime-500"
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
            trend="Overflow"
            trend-type="alert"
            color="text-red-500"
            :icon="mdiChartTimelineVariant"
            :number="256"
            suffix="%"
            label="Performance"
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
            <CardBoxEvents
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

        <SectionBannerStarOnGitHub class="mt-6 mb-6" />

        <SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview">
          <BaseButton
            :icon="mdiReload"
            color="whiteDark"
            @click="fillChartData"
          />
        </SectionTitleLineWithButton>

        <CardBox class="mb-6">
          <div v-if="chartData">
            <line-chart :data="chartData" class="h-96" />
          </div>
        </CardBox>

        <SectionTitleLineWithButton
          :icon="mdiAccountMultiple"
          title="Studenti u procesu prakse"
        />

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox has-table>
          <TableSampleClients />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
