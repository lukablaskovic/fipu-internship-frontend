<script setup>
import { mdiAccountMultiple, mdiAccount, mdiAccountGroup } from "@mdi/js";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { nextTick } from "vue";
import axios from "axios";

import { UserTaskMappings, SendTaskMappings } from "@/helpers/maps";
import { adminStore, mainStore, snackBarStore } from "@/main.js";
import Utils from "@/helpers/utils.js";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TableInstanceData from "@/components/BPMN/TableInstanceData.vue";
import LoadingAnimatedIcon from "@/components/LoadingAnimatedIcon.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import TableStudents from "@/components/Tables/TableStudents.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import FormDynamic from "@/components/Form/FormDynamic.vue";
import BpmnDiagram from "@/components/BPMN/BpmnDiagram.vue";
import FormControl from "@/components/Form/FormControl.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
let bpmn_diagram_active = ref(false);

import BPMN_red from "/BPMN/red_bpmn_professor_pending.png";
import BPMN_blue from "/BPMN/blue_bpmn_default.png";
import BPMN_green from "/BPMN/green_bpmn_done.png";
import BPMN_msg_event from "/BPMN/msg_event.png";

const modal_select_bpmn_task = ref(false);
const modal_past_bpmn_task = ref(false);
const modal_send_task = ref(false);
const bpmn_help_modal = ref(false);

const disabledCondition = ref(true);
const updateDisabledCondition = (allFilled) => {
	disabledCondition.value = !allFilled;
};

const formDynamicValues = ref({});

async function fetchXML(model) {
	try {
		const response = await axios.get(`/bpmn_xml/${model}.xml`, {
			responseType: "text",
		});

		return response.data;
	} catch (error) {
		console.error("Failed to fetch XML:", error);
	}
}

const router = useRouter();
const process_instance_data = ref(null);
const bpmn_model = ref(null);
const bpmnKey = ref(0);

async function handleProcessDiagram() {
	try {
		process_instance_data.value = await adminStore.getProcessInstanceData(adminStore.selectedStudent);
		let model = process_instance_data.value.model.model_path.split(".")[0];

		bpmn_model.value = await fetchXML(model);

		bpmn_diagram_active.value = true;

		await nextTick();

		bpmnKey.value++;

		router.replace(`/studenti/${process_instance_data.value.id}`);
	} catch (e) {
		console.error("Failed to fetch process instance data:", e);
	}
}

const route = useRoute();
// Load data based on process_instance_id from the route
async function loadDataForStudent() {
	const id = route.params.process_instance_id;
	if (id) {
		const student = { process_instance_id: id };

		process_instance_data.value = await adminStore.getProcessInstanceData(student);
	}
}
const newEmail = ref(null);
function getPostDataForSendEmail() {
	// Find the task based on clicked_task_id
	const taskMapping = SendTaskMappings.tasks.find((task) => task._id === adminStore.bpmn_diagram.clicked_task_id);

	if (!taskMapping) return { postData: null, template: null, to: null };

	// Extract required fields from process_instance_data.variables
	const postData = {};
	for (let key in taskMapping.body) {
		if (typeof taskMapping.body[key] === "function") {
			postData[key] = taskMapping.body[key](adminStore.selectedStudent.process_instance_data.variables.process_instance_id);
		} else {
			postData[key] = adminStore.selectedStudent.process_instance_data.variables[key] || "";
		}
	}

	// Extract the 'to' value
	const to = adminStore.selectedStudent.process_instance_data.variables[taskMapping.to] || "";

	return {
		postData,
		template: taskMapping.template,
		to,
	};
}

const toggleActiveEventsFilter = () => {
	adminStore.filterFinishedInstances = !adminStore.filterFinishedInstances;
};

async function sendAnAdditionalEmail() {
	let { postData, template, to } = getPostDataForSendEmail();

	if (newEmail.value) {
		to = newEmail.value;
	}

	if (postData && template && to) {
		await adminStore.sendAnAdditionalEmail(postData, to, template);
		snackBarStore.pushMessage("Email je uspješno poslan!", "success");
		modal_send_task.value = false;
	}
}

watch(() => route.params.process_instance_id, loadDataForStudent, {
	immediate: true,
});

onMounted(async () => {
	await adminStore.getStudents();
});

async function handleNewInstance() {
	adminStore.handleNewInstance(process_instance_data.value.id, process_instance_data.value.pending[0], formDynamicValues.value);
	if (UserTaskMappings.getTaskProperty(process_instance_data.value.pending[0], "snackbar_msg")) {
		snackBarStore.pushMessage(UserTaskMappings.getTaskProperty(process_instance_data.value.pending[0], "snackbar_msg"), UserTaskMappings.getTaskProperty(process_instance_data.value.pending[0], "snackbar_color"));
	}
	await Utils.wait(2);
	location.reload();
}

onMounted(loadDataForStudent);
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="mainStore.userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Studenti u procesu prakse" button-enabled main @click="bpmn_help_modal = true"> </SectionTitleLineWithButton>
				<div class="flex flex-row">
					<div class="mb-4"><PillTag class="cursor-pointer" :left="false" :icon="adminStore.filterFinishedInstances ? mdiAccountGroup : mdiAccountMultiple" :color="adminStore.filterFinishedInstances ? 'info' : 'success'" :label="adminStore.filterFinishedInstances ? 'Sve instance' : 'Samo aktivne'" @click="toggleActiveEventsFilter" /></div>
					<div class="mb-4"><PillTag class="cursor-pointer" :icon="adminStore.filterModelState === 'A' ? mdiAlphaACircle : adminStore.filterModelState === 'B' ? mdiAlphaBCircle : mdiAlphaABCircleOutline" :color="adminStore.filterModelState === 'A' ? 'danger' : adminStore.filterModelState === 'B' ? 'success' : 'info'" :label="adminStore.filterModelState === 'A' ? 'Model A' : adminStore.filterModelState === 'B' ? 'Model B' : 'Modeli AB'" @click="toggleModelEventsFilter" /></div>
				</div>

				<CardBox has-table>
					<TableStudents @show-student-diagram="handleProcessDiagram" />
				</CardBox>

				<CardBox v-if="adminStore.studentsFetched && !adminStore.students.length">
					<CardBoxComponentEmpty />
				</CardBox>
				<p v-if="adminStore.selectedStudent != null" class="mt-2">
					Trenutno se prikazuje:
					<b>{{ adminStore.selectedStudent.ime }} {{ adminStore.selectedStudent.prezime }}</b>
				</p>
				<!-- Modal for the current task -->
				<CardBoxModal v-if="modal_select_bpmn_task" v-model="modal_select_bpmn_task" :title="UserTaskMappings.getTaskProperty(process_instance_data.pending[0], 'form_title', process_instance_data['state'])" button-label="Potvrda" has-cancel :disabled-condition="disabledCondition" @confirm="handleNewInstance()">
					<p v-if="process_instance_data.pending[0] == 'odabiranje_zadatka_student' || process_instance_data.pending[0] == 'ispunjavanje_prijavnice_student' || process_instance_data.pending[0] == 'predavanje_dnevnika_student'" class="mb-4">
						{{ UserTaskMappings.getTaskProperty(adminStore.bpmn_diagram.clicked_task_id, "bpmn_pending_info_msg", process_instance_data["state"]) }}
					</p>

					<FormDynamic v-else v-model="formDynamicValues" :form-fields="adminStore.selectedStudent.process_instance_data.pending_task_info.form_fields" :variables="adminStore.selectedStudent.process_instance_data.variables" :documentation="adminStore.selectedStudent.process_instance_data.pending_task_info.documentation" @all-fields-filled="updateDisabledCondition" />
				</CardBoxModal>

				<!-- Modal for past tasks (without FormDynamic) -->
				<CardBoxModal v-if="modal_past_bpmn_task" v-model="modal_past_bpmn_task" :title="UserTaskMappings.getTaskProperty(adminStore.bpmn_diagram.clicked_task_id, 'form_title', process_instance_data['state'])" button-label="Povratak">
					<p class="mb-2">Ovaj zadatak je već obavljen.</p>
					<TableInstanceData></TableInstanceData>
				</CardBoxModal>

				<CardBoxModal v-if="modal_send_task" v-model="modal_send_task" :title="'Ponovno slanje emaila'" has-cancel button-label="Pošalji" @confirm="sendAnAdditionalEmail()">
					<p class="">E-mail je već poslan koristeći kroz BPMN engine, no možete ga poslati ponovo pritiskom na 'Pošalji'</p>
					<p class="mb-2">Dodatno, možete unijeti e-mail te poslati na novu adresu. Ako želite poslati na adresu pohranjenu u engine-u, ostavite prazno.</p>

					<FormField label="Novi E-mail">
						<FormControl v-model="newEmail" :icon-left="mdiAccount" name="email" autocomplete="email" />
					</FormField>
				</CardBoxModal>

				<CardBoxModal v-if="bpmn_help_modal" v-model="bpmn_help_modal" :title="'BPMN Graf - Legenda'" button-label="Povratak">
					<div class="mb-4 flex items-center space-x-4">
						<img :src="BPMN_blue" alt="Description 1" class="h-32 w-32 object-contain" />
						<p class="text-sm"><b>Plava boja</b> - pending task. Zahtjeva akciju studenta ili poslodavca.</p>
					</div>

					<div class="mb-4 flex items-center space-x-4">
						<img :src="BPMN_green" alt="Description 2" class="h-32 w-32 object-contain" />
						<p class="text-sm"><b>Zelena boja</b> - finished task. Uspješno procesirani kroz BPMN engine.</p>
					</div>

					<div class="mb-4 flex items-center space-x-4">
						<img :src="BPMN_red" alt="Description 3" class="h-32 w-32 object-contain" />
						<p class="text-sm"><b>Crvena boja</b> - pending task. Zahtjeva akciju voditelja prakse.</p>
					</div>

					<div class="mb-4 flex items-center space-x-4">
						<img :src="BPMN_msg_event" alt="Description 3" class="h-32 w-32 object-contain" />
						<p class="text-sm"><b>Send task</b> - Gotove/Prošle 'send taskove' je moguće ponovno pozvati.</p>
					</div>

					<hr />
					<br />
				</CardBoxModal>
			</SectionMain>

			<BpmnDiagram
				v-if="bpmn_model && process_instance_data"
				:key="bpmnKey"
				:xml="bpmn_model"
				:current-order="UserTaskMappings.getTaskProperty(process_instance_data.pending[0], 'order', process_instance_data['state'])"
				:highlight-color="UserTaskMappings.getTaskProperty(process_instance_data.pending[0], 'bpmn_task_color', process_instance_data['state'])"
				:highlight-element-id="process_instance_data.pending[0] || UserTaskMappings.getTaskProperty(process_instance_data.pending[0], '_id', process_instance_data['state'])"
				@current-task-modal="modal_select_bpmn_task = true"
				@past-task-modal="modal_past_bpmn_task = true"
				@send-task-modal="modal_send_task = true" />
			<div v-else-if="process_instance_data" class="flex items-center justify-center pt-36">
				<LoadingAnimatedIcon></LoadingAnimatedIcon>
			</div>
		</LayoutAuthenticated>
	</div>
</template>
