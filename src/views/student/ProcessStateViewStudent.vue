<script setup>
import SectionMain from "@/components/Section/SectionMain.vue";
import { mdiChartTimeline } from "@mdi/js";
import { ref, onMounted } from "vue";
import { computed } from "vue";


import { UserTaskMappings } from "@/helpers/maps";
import { useMainStore } from "@/stores/main_store";

import { ProcessInstance } from "@/services/bpmn_engine_api";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableInstanceData from "@/components/BPMN/TableInstanceData.vue";
import LoadingAnimatedIcon from "@/components/LoadingAnimatedIcon.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import BpmnDiagram from "@/components/BPMN/BpmnDiagram.vue";


const mainStore = useMainStore();

const selectedTaskId = ref("");
const modal_select_bpmn_task = ref(false);
const modal_past_bpmn_task = ref(false);
const modal_send_task = ref(false);

const userAuthenticated = computed(() => mainStore.userAuthenticated);


const process_instance_data = ref(null);


const attempts = ref([]);
const bpmn_model = ref(null);
const selectedAttempt = ref(null);

async function showAttempt(attempt) {
	selectedAttempt.value = attempt.id;
	process_instance_data.value = attempt;
	bpmn_model.value = null;
	const xml = await ProcessInstance.diagram(attempt.id);
	if (selectedAttempt.value === attempt.id) bpmn_model.value = xml;
}

onMounted(async () => {
	let id = mainStore.currentUser.internship_process.id;
	while (id && !attempts.value.some(attempt => attempt.id === id)) {
		const attempt = await ProcessInstance.get(id);
		if (!attempt) break;
		attempts.value.push(attempt);
		if (attempts.value.length === 1) await showAttempt(attempt);
		id = attempt.variables?.previous_instance_id;
	}
});
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton class="mt-4" :icon="mdiChartTimeline" title="Stanje procesa" main> </SectionTitleLineWithButton>
				<p v-if="process_instance_data" class="mb-4 font-semibold">Model {{ process_instance_data.model.model_path.slice(-6, -5) }} · {{ process_instance_data.model.version ? "v" + process_instance_data.model.version : "verzija nepoznata" }}</p>
				<label v-if="attempts.length > 1" class="mb-4 block">Povijest praksi
					<select :value="selectedAttempt" @change="showAttempt(attempts.find(item => item.id === $event.target.value))">
						<option v-for="(attempt, index) in attempts" :key="attempt.id" :value="attempt.id">
							{{ attempts.length - index }}. Model {{ attempt.model.model_path.slice(-6, -5) }} · {{ attempt.model.version ? "v" + attempt.model.version : "verzija nepoznata" }} · {{ attempt.state === 'cancelled' ? 'Odustajanje' : 'Trenutna praksa' }}
						</option>
					</select>
				</label>
				<div class="hidden sm:block">
					<p class="mb-4">Ovdje možete pronaći BPMN graf koji prikazuje aktualno stanje vašeg procesa prakse.</p>
					<p><span class="font-bold text-fipu_blue">Plavom</span> bojom označena je trenutna aktivnost koju mora izvršiti student.</p>
					<p><span class="font-bold text-green-500">Zelenom</span> bojom označene su uspješno provedene aktivnosti.</p>
					<p><span class="font-bold text-red-500">Crvenom</span> bojom je označena trenutna aktivnost koju mora izvršiti voditelj prakse ili poslodavac.</p>
					<hr class="my-4" />
					<p>Pronašli ste pogrešku? Molimo da kontaktirate voditelja prakse.</p>
					<!-- Modal for past tasks (without FormDynamic) -->
					<CardBoxModal v-if="modal_past_bpmn_task" v-model="modal_past_bpmn_task" :title="UserTaskMappings.getTaskProperty(selectedTaskId, 'form_title', process_instance_data['state'])" button-label="Povratak">
						<p class="mb-2">Ovaj zadatak je već obavljen.</p>
						<TableInstanceData :instance-id="process_instance_data.id" :task-id="selectedTaskId" :variables="process_instance_data.variables" />
					</CardBoxModal>
				</div>
				<p class="block sm:hidden">BPMN graf je moguće pregledati samo u Desktop prikazu aplikacije. Sorry!</p>
			</SectionMain>
			<div class="hidden sm:block">
				<BpmnDiagram
					v-if="bpmn_model && process_instance_data"
					:key="selectedAttempt"
					class="mt-12"
					:xml="bpmn_model"
					:current-order="UserTaskMappings.getTaskProperty(process_instance_data.pending[0], 'order', process_instance_data['state'])"
					:highlight-color="UserTaskMappings.getTaskProperty(process_instance_data.pending[0], 'bpmn_task_color', process_instance_data['state'])"
					:highlight-element-id="process_instance_data.pending[0] || UserTaskMappings.getTaskProperty(process_instance_data.pending[0], '_id', process_instance_data['state'])"
					@current-task-modal="modal_select_bpmn_task = true"
					@past-task-modal="selectedTaskId = $event.id; modal_past_bpmn_task = true"
					@send-task-modal="modal_send_task = true" />
				<div v-else-if="process_instance_data" class="flex items-center justify-center pt-36">
					<LoadingAnimatedIcon></LoadingAnimatedIcon>
				</div>
			</div>
		</LayoutAuthenticated>
	</div>
</template>
