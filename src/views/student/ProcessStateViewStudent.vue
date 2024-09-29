<script setup>
import SectionMain from "@/components/Section/SectionMain.vue";
import { mdiListStatus } from "@mdi/js";
import { mdiAccount } from "@mdi/js";
import { ref, onMounted } from "vue";
import { computed } from "vue";
import axios from "axios";

import { UserTaskMappings, SendTaskMappings } from "@/helpers/maps";
import { adminStore, mainStore, snackBarStore } from "@/main.js";
import Utils from "@/helpers/utils.js";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TableInstanceData from "@/components/BPMN/TableInstanceData.vue";
import LoadingAnimatedIcon from "@/components/LoadingAnimatedIcon.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import FormDynamic from "@/components/Form/FormDynamic.vue";
import BpmnDiagram from "@/components/BPMN/BpmnDiagram.vue";
import FormControl from "@/components/Form/FormControl.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";

import BPMN_red from "/BPMN/red_bpmn_professor_pending.png";
import BPMN_blue from "/BPMN/blue_bpmn_default.png";
import BPMN_green from "/BPMN/green_bpmn_done.png";
import BPMN_msg_event from "/BPMN/msg_event.png";

const modal_select_bpmn_task = ref(false);
const modal_past_bpmn_task = ref(false);
const modal_send_task = ref(false);
const bpmn_help_modal = ref(false);

const disabledCondition = ref(true);

const userAuthenticated = computed(() => mainStore.userAuthenticated);

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

const process_instance_data = ref(null);
const bpmnKey = ref(0);

async function loadDataForStudent(process_instance_id) {
	if (process_instance_id) {
		const student = { process_instance_id: process_instance_id };

		process_instance_data.value = await adminStore.getProcessInstanceData(student); //ok
		mainStore.currentUserProcessInstanceData = process_instance_data.value; //ok
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

async function handleNewInstance() {
	adminStore.handleNewInstance(process_instance_data.value.id, process_instance_data.value.pending[0], formDynamicValues.value);
	if (UserTaskMappings.getTaskProperty(process_instance_data.value.pending[0], "snackbar_msg")) {
		snackBarStore.pushMessage(UserTaskMappings.getTaskProperty(process_instance_data.value.pending[0], "snackbar_msg"), UserTaskMappings.getTaskProperty(process_instance_data.value.pending[0], "snackbar_color"));
	}
	await Utils.wait(2);
	location.reload();
}

const process_instance_id = ref(null);
const bpmn_model = ref(null);

onMounted(async () => {
	process_instance_id.value = mainStore.currentUser.internship_process.id; //ok
	loadDataForStudent(process_instance_id.value);
	let model = mainStore.currentUserProcessInstanceData.model.model_path.split(".")[0];

	bpmn_model.value = await fetchXML(model);
});
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton class="mt-4" :icon="mdiListStatus" title="Stanje procesa" main> </SectionTitleLineWithButton>
				<p class="mb-4">Ispod možete vidjeti BPMN graf koji prikazuje aktualno stanje vašeg procesa prakse.</p>

				<CardBox v-if="adminStore.studentsFetched && !adminStore.students.length">
					<CardBoxComponentEmpty />
				</CardBox>
				<p v-if="adminStore.selectedStudent != null" class="mt-2">
					Trenutno se prikazuje:
					<b>{{ adminStore.selectedStudent.ime }} {{ adminStore.selectedStudent.prezime }}</b>
				</p>

				<!-- Modal for past tasks (without FormDynamic) -->
				<CardBoxModal v-if="modal_past_bpmn_task" v-model="modal_past_bpmn_task" :title="UserTaskMappings.getTaskProperty(adminStore.bpmn_diagram.clicked_task_id, 'form_title', process_instance_data['state'])" button-label="Povratak">
					<p class="mb-2">Ovaj zadatak je već obavljen.</p>
					<TableInstanceData></TableInstanceData>
				</CardBoxModal>
			</SectionMain>

			<BpmnDiagram
				class="mt-12"
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
