<script setup>
import { computed, ref, onMounted } from "vue";
import { mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiCloudCog } from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import axios from "axios";
import TableMicroservices from "@/components/Tables/TableMicroservices.vue";
const bpmn_model = ref(null);
const chartData = ref(null);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

onMounted(async () => {
  fillChartData();
  bpmn_model.value = await fetchXML();
});

const userAuthenticated = computed(() => mainStore.userAuthenticated);

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
        <SectionTitleLineWithButton
          :icon="mdiCloudCog"
          title="Mikroservisi"
          main
        >
        </SectionTitleLineWithButton>

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox has-table>
          <TableMicroservices />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
