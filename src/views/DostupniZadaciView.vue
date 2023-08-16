<script setup>
import { ref, onMounted } from "vue";

import { mdiClipboardCheckOutline, mdiLaptop } from "@mdi/js";
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
      <SectionTitleLineWithButton :icon="mdiLaptop" title="Stručna praksa" main>
      </SectionTitleLineWithButton>
      <p><b>Akademska godina:</b> 2023/2024</p>
      <p><b>Voditelj:</b> doc. dr. sc. Nikola Tanković</p>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheckOutline"
        main
        title="Dostupni zadaci za praksu"
      ></SectionTitleLineWithButton>
      <p>
        Pogledajte zanimljive slobodne zadatke te odaberite 3 najdraža (1.
        odabir | 2. odabir | 3. odabir).
      </p>
      <p><b>Napomena:</b> Morate biti prijavljeni za odabir zadataka!</p>
      <br />
      <CardBox has-table>
        <TableDostupniZadaci checkable />
      </CardBox>
    </SectionMain>
  </LayoutGuest>
</template>
