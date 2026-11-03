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
import ButtonMenu from "@/components/Base/ButtonMenu.vue";


const mainStore = useMainStore();

const selectedTaskId = ref("");
const modal_past_bpmn_task = ref(false);

const userAuthenticated = computed(() => mainStore.userAuthenticated);


const process_instance_data = ref(null);


const attempts = ref([]);
const bpmn_model = ref(null);
const selectedAttempt = ref(null);
const attemptOptions = computed(() => attempts.value.map((attempt, index) => ({
	...attempt,
	label: `${attempts.value.length - index}. Model ${attempt.model.model_path.slice(-6, -5)} · ${attempt.model.version ? "v" + attempt.model.version : "verzija nepoznata"} · ${attempt.state === "cancelled" ? "Odustajanje" : "Trenutna praksa"}`,
})));

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
				<SectionTitleLineWithButton class="mt-4" :icon="mdiChartTimeline" title="Stanje procesa vaše prakse" main> </SectionTitleLineWithButton>
				<div v-if="attempts.length > 1" class="mb-4 flex flex-wrap items-center gap-2">
					<span>Povijest praksi</span>
					<ButtonMenu
						color="fipu_blue"
						:label="attemptOptions.find(attempt => attempt.id === selectedAttempt)?.label"
						:options="[attemptOptions]"
						left
						@update:model-value="showAttempt" />
				</div>
				<div class="hidden sm:block">
					<p class="mb-4">Ovdje možete pronaći BPMN graf koji prikazuje aktualno stanje vašeg procesa prakse.</p>
					<p><span class="font-bold text-yellow-700 dark:text-yellow-300">Žutom</span> bojom označene su aktivnosti i događaji koji čekaju izvršavanje.</p>
					<p><span class="font-bold text-green-700 dark:text-green-300">Zelenom</span> bojom označene su završene aktivnosti i događaji.</p>
					<hr class="my-4" />
					<p>Pronašli ste pogrešku? Molimo da kontaktirate voditelja prakse.</p>
					<!-- Modal for past tasks (without FormDynamic) -->
					<CardBoxModal v-if="modal_past_bpmn_task" v-model="modal_past_bpmn_task" :title="UserTaskMappings.getTaskProperty(selectedTaskId, 'form_title')" button-label="Povratak">
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
					class="student-process-diagram"
					:xml="bpmn_model"
					:instance="process_instance_data"
					@past-task-modal="selectedTaskId = $event.id; modal_past_bpmn_task = true" />
				<div v-else-if="process_instance_data" class="flex items-center justify-center pt-36">
					<LoadingAnimatedIcon></LoadingAnimatedIcon>
				</div>
			</div>
		</LayoutAuthenticated>
	</div>
</template>

<style scoped>
.student-process-diagram {
	height: auto;
	aspect-ratio: 3 / 1;
}
</style>
