<script setup>
import { computed, ref, onMounted } from "vue";

import { adminStore, mainStore } from "@/main.js";
import { mdiAccountMultiple } from "@mdi/js";
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
import TableInstanceData from "@/components/BPMN/TableInstanceData.vue";
const bpmnKey = ref(0);

const bpmn_model = ref(null);
let bpmn_diagram_active = ref(false);

const modal_select_bpmn_task = ref(false);
const modal_past_bpmn_task = ref(false);

const process_instance_data = ref(null);

const userAuthenticated = computed(() => mainStore.userAuthenticated);

const disabledCondition = ref(true);

const updateDisabledCondition = (allFilled) => {
  disabledCondition.value = !allFilled;
};

const formDynamicValues = ref({});

async function fetchXML() {
  try {
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

async function handleProcessDiagram() {
  bpmn_diagram_active.value = true;
  process_instance_data.value = await adminStore.getProcessInstanceData(
    adminStore.selectedStudent
  );
  console.log(process_instance_data.value);
  bpmnKey.value++;
}

onMounted(async () => {
  adminStore.selectedStudent = null;
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
          button-enabled
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
        <p v-if="adminStore.selectedStudent != null" class="mt-2">
          Trenutno se prikazuje:
          <b
            >{{ adminStore.selectedStudent.ime }}
            {{ adminStore.selectedStudent.prezime }}</b
          >
        </p>
        <!-- Modal for the current task -->
        <CardBoxModal
          v-if="modal_select_bpmn_task"
          v-model="modal_select_bpmn_task"
          :title="
            UserTaskMappings.getTaskProperty(
              process_instance_data.pending[0],
              'form_title'
            )
          "
          button-label="Potvrda"
          has-cancel
          :disabled-condition="disabledCondition"
          @confirm="
            adminStore.handleNewInstance(
              process_instance_data.id,
              process_instance_data.pending[0],
              formDynamicValues
            )
          "
        >
          <p
            v-if="
              process_instance_data.pending[0] == 'odabiranje_zadatka_student'
            "
            class="mb-4"
          >
            {{
              UserTaskMappings.getTaskProperty(
                adminStore.bpmn_diagram.clicked_task_id,
                "bpmn_pending_info_msg"
              )
            }}
          </p>

          <FormDynamic
            v-else
            v-model="formDynamicValues"
            :form-fields="
              adminStore.selectedStudent.process_instance_data.pending_task_info
                .form_fields
            "
            :variables="
              adminStore.selectedStudent.process_instance_data.variables
            "
            :documentation="
              adminStore.selectedStudent.process_instance_data.pending_task_info
                .documentation
            "
            @all-fields-filled="updateDisabledCondition"
          />
        </CardBoxModal>

        <!-- Modal for past tasks (without FormDynamic) -->
        <CardBoxModal
          v-if="modal_past_bpmn_task"
          v-model="modal_past_bpmn_task"
          :title="
            UserTaskMappings.getTaskProperty(
              adminStore.bpmn_diagram.clicked_task_id,
              'form_title'
            )
          "
          button-label="Povratak"
        >
          <p>Ovaj zadatak je već obavljen.</p>
          <TableInstanceData></TableInstanceData>
        </CardBoxModal>
      </SectionMain>
      <BpmnDiagram
        v-if="bpmn_model && process_instance_data"
        :key="bpmnKey"
        :xml="bpmn_model"
        :current-order="
          UserTaskMappings.getTaskProperty(
            process_instance_data.pending[0],
            'order'
          )
        "
        :highlight-color="
          UserTaskMappings.getTaskProperty(
            process_instance_data.pending[0],
            'bpmn_task_color'
          )
        "
        :highlight-element-id="process_instance_data.pending[0]"
        @current-task-modal="modal_select_bpmn_task = true"
        @past-task-modal="modal_past_bpmn_task = true"
      />
    </LayoutAuthenticated>
  </div>
</template>
