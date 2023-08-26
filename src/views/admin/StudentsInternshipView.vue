<script setup>
import { computed, ref, onMounted } from "vue";
import { adminStore, mainStore } from "@/main.js";
import { mdiMonitorCellphone, mdiAccountMultiple, mdiTableOff } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import NotificationBar from "@/components/Notification/NotificationBar.vue";
import FormDynamic from "@/components/Form/FormDynamic.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableStudents from "@/components/Tables/TableStudents.vue";
import BpmnDiagram from "@/components/BPMN/BpmnDiagram.vue";
import axios from "axios";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import { UserTaskMappings } from "@/helpers/maps";

const bpmnKey = ref(0);

const bpmn_model = ref(null);
const modal_select_bpmn_task = ref(false);

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
  bpmnKey.value++;
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

        <CardBox has-table>
          <TableStudents @show-student-diagram="handleProcessDiagram" />
        </CardBox>
        <CardBox
          v-if="adminStore.studentsFetched && !adminStore.students.length"
        >
          <CardBoxComponentEmpty />
        </CardBox>
        <CardBoxModal
          v-if="modal_select_bpmn_task"
          v-model="modal_select_bpmn_task"
          :title="
            UserTaskMappings.getTaskFormTitle(process_instance_data.pending[0])
          "
          button-label="Potvrda"
          has-cancel
        >
          <FormDynamic
            :form-fields="
              adminStore.selectedStudent.process_instance_data.pending_task_info
                .form_fields
            "
            :documentation="
              adminStore.selectedStudent.process_instance_data.pending_task_info
                .documentation
            "
          >
          </FormDynamic>
        </CardBoxModal>
      </SectionMain>
      <BpmnDiagram
        v-if="bpmn_model && process_instance_data"
        :key="bpmnKey"
        :xml="bpmn_model"
        :current-order="
          UserTaskMappings.getCurrentOrder(process_instance_data.pending[0])
        "
        :highlight-color="
          UserTaskMappings.getBpmnTaskColor(process_instance_data.pending[0])
        "
        :highlight-element-id="process_instance_data.pending[0]"
        @open-modal="modal_select_bpmn_task = true"
      />
    </LayoutAuthenticated>
  </div>
</template>
