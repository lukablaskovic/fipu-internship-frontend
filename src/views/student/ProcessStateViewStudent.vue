<script setup>
import SectionMain from "@/components/Section/SectionMain.vue";
import { mdiChartTimeline } from "@mdi/js";
import { ref, onMounted } from "vue";
import { computed } from "vue";
import axios from "axios";

import { UserTaskMappings } from "@/helpers/maps";
import { adminStore, mainStore } from "@/main.js";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TableInstanceData from "@/components/BPMN/TableInstanceData.vue";
import LoadingAnimatedIcon from "@/components/LoadingAnimatedIcon.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import BpmnDiagram from "@/components/BPMN/BpmnDiagram.vue";

import CardBox from "@/components/Cardbox/CardBox.vue";

const modal_select_bpmn_task = ref(false);
const modal_past_bpmn_task = ref(false);
const modal_send_task = ref(false);

const userAuthenticated = computed(() => mainStore.userAuthenticated);

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

const process_instance_id = ref(null);
const bpmn_model = ref(null);

onMounted(async () => {
	process_instance_id.value = mainStore.currentUser.internship_process.id; //ok
	await loadDataForStudent(process_instance_id.value);
	let model = mainStore.currentUserProcessInstanceData.model.model_path.split(".")[0];

	bpmn_model.value = await fetchXML(model);
});
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton class="mt-4" :icon="mdiChartTimeline" title="Stanje procesa" main> </SectionTitleLineWithButton>
				<div class="hidden sm:block">
					<p class="mb-4">Ovdje možete pronaći BPMN graf koji prikazuje aktualno stanje vašeg procesa prakse.</p>
					<p><span class="font-bold text-fipu_blue">Plavom</span> bojom označena je trenutna aktivnost koju mora izvršiti student.</p>
					<p><span class="font-bold text-green-500">Zelenom</span> bojom označene su uspješno provedene aktivnosti.</p>
					<p><span class="font-bold text-red-500">Crvenom</span> bojom je označena trenutna aktivnost koju mora izvršiti voditelj prakse.</p>
					<hr class="my-4" />
					<p>Pronašli ste pogrešku? Molimo da kontaktirate voditelja prakse.</p>
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
				</div>
				<p class="block sm:hidden">BPMN graf je moguće pregledati samo u Desktop prikazu aplikacije. Sorry!</p>
			</SectionMain>
			<div class="hidden sm:block">
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
			</div>
		</LayoutAuthenticated>
	</div>
</template>
