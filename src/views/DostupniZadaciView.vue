<script setup>
import { ref, onMounted } from "vue";

import { mdiAccountMultiple } from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/SectionMain.vue";

import CardBox from "@/components/CardBox.vue";

import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import TableDostupniZadaci from "@/components/TableDostupniZadaci.vue";

const chartData = ref(null);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

onMounted(async () => {
  fillChartData();
});
</script>

<template>
  <LayoutGuest>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiAccountMultiple"
        title="Dostupni zadaci za praksu"
      />

      <CardBox has-table>
        <TableDostupniZadaci />
      </CardBox>
    </SectionMain>
  </LayoutGuest>
</template>
