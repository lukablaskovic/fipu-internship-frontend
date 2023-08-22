<script setup>
import { computed, ref, onMounted } from "vue";
import { adminStore, mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiViewDashboard } from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import NotificationBar from "@/components/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import TableAllStudents from "@/components/TableAllStudents.vue";
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

mainStore.fetchCurrentUser();

const userAuthenticated = computed(() => mainStore.userAuthenticated);

async function fetchXML() {
  try {
    // Make sure to set the responseType to 'text' since we're reading the XML as a string.
    const response = await axios.get("/bpmn_xml/strucna_praksa.xml", {
      responseType: "text",
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch XML:", error);
  }
}
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
          title="Popis prijavljenih studenata"
          main
        >
        </SectionTitleLineWithButton>

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox has-table>
          <TableAllStudents />
        </CardBox>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
