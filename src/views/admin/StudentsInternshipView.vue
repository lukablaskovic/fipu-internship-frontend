<script setup>
import { computed, ref, onMounted } from "vue";
import {
  mdiNumeric1Circle,
  mdiNumeric2CircleOutline,
  mdiNumeric3CircleOutline,
} from "@mdi/js";
import { adminStore, mainStore, studentStore } from "@/main.js";
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
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import { UserTaskMappings } from "@/helpers/maps";

const bpmnKey = ref(0);

const bpmn_model = ref(null);
let bpmn_diagram_active = ref(false);
const modal_select_bpmn_task = ref(false);
const modal_past_bpmn_task = ref(false);

const process_instance_data = ref(null);

const userAuthenticated = computed(() => mainStore.userAuthenticated);
const clickedTaskID = computed(() => adminStore.bpmn_diagram.clicked_task_id);

const disabledCondition = ref(true);

const updateDisabledCondition = (allFilled) => {
  disabledCondition.value = !allFilled;
};

const formDynamicValues = ref({});

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
  bpmn_diagram_active.value = true;
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
        <!-- Modal for the current task -->
        <CardBoxModal
          v-if="modal_select_bpmn_task"
          v-model="modal_select_bpmn_task"
          :title="
            UserTaskMappings.getTaskFormTitle(process_instance_data.pending[0])
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
              UserTaskMappings.getBpmnPendingInfoMsg(
                adminStore.bpmn_diagram.clicked_task_id
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
            UserTaskMappings.getTaskFormTitle(
              adminStore.bpmn_diagram.clicked_task_id
            )
          "
          button-label="Povratak"
        >
          <!-- Content for past tasks (this can be different from the current task modal) -->
          <p>Ovaj zadatak je već obavljen.</p>
          <component
            :is="UserTaskMappings.getTaskCopmonent(clickedTaskID)"
          ></component>
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
        @current-task-modal="modal_select_bpmn_task = true"
        @past-task-modal="modal_past_bpmn_task = true"
      />
      <!--
      <SectionMain v-if="bpmn_diagram_active">
        <div>
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            <CardBoxWidget
              :class="modalLoading ? 'cursor-wait' : 'cursor-pointer'"
              color="text-fipu_blue"
              hoverable
              :icon="mdiNumeric1Circle"
              :number="null"
              :text="prviOdabir"
              label="1. odabir"
              @click="getAssignmentDetailsInModal(prviOdabir)"
            />

            <CardBoxWidget
              :class="modalLoading ? 'cursor-wait' : 'cursor-pointer'"
              color="text-fipu_blue"
              hoverable
              :icon="mdiNumeric2CircleOutline"
              :number="null"
              :text="drugiOdabir"
              label="2. odabir"
              @click="getAssignmentDetailsInModal(drugiOdabir)"
            />
            <CardBoxWidget
              :class="modalLoading ? 'cursor-wait' : 'cursor-pointer'"
              color="text-fipu_blue"
              hoverable
              :icon="mdiNumeric3CircleOutline"
              :number="null"
              :text="treciOdabir"
              label="3. odabir"
              @click="getAssignmentDetailsInModal(treciOdabir)"
            />
          </div>
          <CardBoxModal
            v-if="isModalActive"
            v-model="isModalActive"
            :title="isModalActive['ID Zadatka']"
            button-label="Zatvori"
            button="fipu_blue"
            has-cancel:false
          >
            <hr />
            <div>
              <b>Zadatak studenta:</b> {{ isModalActive["Zadatak studenta"] }}
            </div>
            <div>
              <b>Poslodavac: </b>{{ isModalActive["Poslodavac"][0].value }}
            </div>
            <div>
              <b>Preferirane tehnologije:</b>
              {{ isModalActive["Preferirane tehnologije"] }}
            </div>

            <div>
              <b>Preferencije za studenta: </b>
              {{ isModalActive["Preferencije za studenta"] }}
            </div>

            <div>
              <b>Potrebno imati: </b>
              {{ isModalActive["Potrebno imati"] }}
            </div>
            <div>
              <b>Trajanje (sati): </b>
              {{ isModalActive["Trajanje (sati)"] }}
            </div>

            <div>
              <b>Željeno okvirno vrijeme početka: </b>
              {{ isModalActive["Željeno okvirno vrijeme početka"] }}
            </div>
            <div>
              <b>Angažman FIPU: </b>
              {{ isModalActive["Angažman FIPU"] }}
            </div>
            <div>
              <b>Kontakt email: </b>{{ isModalActive["Kontakt email"] }}
            </div>
            <div><b>Lokacija: </b>{{ isModalActive["Lokacija"] }}</div>
            <div>
              <b>Napomena</b>
              {{ isModalActive["Napomena"] }}
            </div>
            <br />
          </CardBoxModal>
        </div>
      </SectionMain>
      -->
    </LayoutAuthenticated>
  </div>
</template>
