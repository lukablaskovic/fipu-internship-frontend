<script setup>
import { computed, ref, onMounted } from "vue";
import { adminStore, mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiAccountMultiple } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import NotificationBar from "@/components/NotificationBar.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import TableStudents from "@/components/Tables/TableStudents.vue";
import BpmnDiagram from "@/components/BPMN/BpmnDiagram.vue";
import axios from "axios";

const bpmn_model = ref(null);
const process_instance_data = ref(null);

const userAuthenticated = computed(() => mainStore.userAuthenticated);

async function fetchXML() {
  try {
    const response = await axios.get("/bpmn_xml/strucna_praksa_edited.xml", {
      responseType: "text",
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch XML:", error);
  }
}

async function handleProcessDiagram() {
  process_instance_data.value = await adminStore.getProcessInstanceData(
    adminStore.selectedStudent
  );
}

onMounted(async () => {
  await adminStore.getStudents();
  bpmn_model.value = await fetchXML();
});
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiAccountMultiple"
          title="Studenti u procesu prakse"
          main
        >
        </SectionTitleLineWithButton>

        <NotificationBar color="info" :icon="mdiMonitorCellphone">
          <b>Responsive table.</b> Collapses on mobile
        </NotificationBar>

        <CardBox has-table>
          <TableStudents @show-student-diagram="handleProcessDiagram" />
        </CardBox>
      </SectionMain>
      <BpmnDiagram
        v-if="bpmn_model && process_instance_data"
        :xml="bpmn_model"
        :highlight-element-id="process_instance_data.pending[0]"
      />
    </LayoutAuthenticated>
  </div>
</template>
