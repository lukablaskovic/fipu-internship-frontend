<script setup>
import { computed, ref, onMounted } from "vue";
import { mainStore } from "@/main.js";
import { mdiChartBar } from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BpmnDiagram from "@/components/BPMN/BpmnDiagram.vue";

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
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiChartBar"
          title="Moja praksa"
          main
        >
        </SectionTitleLineWithButton>

        <div>
          <BpmnDiagram v-if="bpmn_model" :xml="bpmn_model" />
        </div>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
