<script setup>
import { ref, computed, onMounted } from "vue";

import { mdiClipboardCheckOutline, mdiLaptop } from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/SectionMain.vue";

import CardBox from "@/components/CardBox.vue";

import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import TableDostupniZadaci from "@/components/TableDostupniZadaci.vue";
import draggable from "vuedraggable";

import { useGuestStore } from "@/stores/guest";
const guestStore = useGuestStore();

const checkedAssignments = computed(() => guestStore.checkedAssignments);

const enabled = ref(true);
const dragging = ref(false);

const chartData = ref(null);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

function checkMove(e) {
  window.console.log("Future index: " + e.draggedContext.futureIndex);
}

onMounted(async () => {
  fillChartData();
  console.log(checkedAssignments.value);
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
        Pogledajte zanimljive slobodne zadatke te odaberite i rasporedite 3
        najdraža (1. odabir | 2. odabir | 3. odabir).
      </p>
      <p>
        <b>Napomena:</b> Da biste prijavili preferencije, morate se prijaviti u
        aplikaciji.
      </p>
      <br />
      <CardBox has-table>
        <TableDostupniZadaci checkable />
      </CardBox>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheckOutline"
        main
        title="Odabrani zadaci"
      ></SectionTitleLineWithButton>
      <div class="flex justify-center items-center">
        <div class="flex flex-row text-center">
          <draggable
            :list="checkedAssignments"
            :disabled="!enabled"
            item-key="id"
            class="list-group flex flex-row space-x-4"
            ghost-class="ghost"
            :move="checkMove"
            @start="dragging = true"
            @end="dragging = false"
          >
            <template #item="{ element, index }">
              <div
                class="list-group-item flex-shrink-0 w-40 h-40 bg-gray-200 rounded-lg shadow-lg flex flex-col items-center justify-center text-lg p-4"
                :class="{ 'not-draggable': !enabled, 'cursor-move': enabled }"
              >
                <span class="mb-2 font-bold">{{ index + 1 }}. odabir</span>
                {{ element["ID Zadatka"] }}
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </SectionMain>
  </LayoutGuest>
</template>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
