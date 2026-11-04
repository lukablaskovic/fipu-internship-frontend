<script setup>
import SectionMain from "@/components/Section/SectionMain.vue";
import { mdiChartTimeline, mdiClose, mdiFullscreen } from "@mdi/js";
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";


import { UserTaskMappings } from "@/helpers/maps";
import { useMainStore } from "@/stores/main_store";

import { BPMN_STUDIO_URL } from "@/config";
import { Model, ProcessInstance } from "@/services/bpmn_engine_api";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableInstanceData from "@/components/BPMN/TableInstanceData.vue";
import LoadingAnimatedIcon from "@/components/LoadingAnimatedIcon.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import BpmnDiagram from "@/components/BPMN/BpmnDiagram.vue";
import { Dialog } from "reka-ui/namespaced";
import BaseButton from "@/components/Base/BaseButton.vue";
import ButtonMenu from "@/components/Base/ButtonMenu.vue";


const mainStore = useMainStore();

const selectedTaskId = ref("");
const modal_past_bpmn_task = ref(false);

const phoneViewport = window.matchMedia("(max-width: 639px), (pointer: coarse) and (max-height: 639px)");
const mobile = ref(phoneViewport.matches);
function updateViewport(event) {
	mobile.value = event.matches;
}
onMounted(() => phoneViewport.addEventListener("change", updateViewport));
onBeforeUnmount(() => phoneViewport.removeEventListener("change", updateViewport));

function showPastTask(task) {
	selectedTaskId.value = task.id;
	modal_past_bpmn_task.value = true;
}

const userAuthenticated = computed(() => mainStore.userAuthenticated);


const process_instance_data = ref(null);


const attempts = ref([]);
const bpmn_model = ref(null);
const selectedAttempt = ref(null);
const attemptOptions = computed(() => attempts.value.map((attempt, index) => ({
	...attempt,
	label: `${attempts.value.length - index}. Model ${attempt.model.model_path.slice(-6, -5)} · ${attempt.model.version ? "v" + attempt.model.version : "verzija nepoznata"} · ${attempt.state === "cancelled" ? "Odustajanje" : attempt.state === "finished" ? "Završena praksa" : "Trenutna praksa"}`,
})));

const loadError = ref(false);

function showAttempt(attempt) {
	selectedAttempt.value = attempt.id;
	process_instance_data.value = attempt;
}

watch(process_instance_data, async (attempt, _, onCleanup) => {
	let current = true;
	onCleanup(() => { current = false; });
	bpmn_model.value = null;
	loadError.value = false;
	const file = encodeURIComponent(attempt.model.model_path);
	try {
		let xml;
		if (import.meta.env.DEV && window.location.hostname === "localhost") {
			const response = await fetch(BPMN_STUDIO_URL + "/api/models/" + file, { cache: "no-store" });
			if (!response.ok) throw new Error();
			xml = (await response.json()).xml;
		} else {
			xml = await Model.get(file);
		}
		if (!current) return;
		const root = new DOMParser().parseFromString(xml, "application/xml").documentElement;
		if (root.localName !== "definitions") throw new Error();
		bpmn_model.value = xml;
	} catch {
		if (current) loadError.value = true;
	}
});

onMounted(async () => {
	let id = mainStore.currentUser.internship_process.id;
	while (id && !attempts.value.some(attempt => attempt.id === id)) {
		const attempt = await ProcessInstance.get(id);
		if (!attempt) break;
		attempts.value.push(attempt);
		if (attempts.value.length === 1) showAttempt(attempt);
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
						color="border-fipu_blue bg-transparent text-fipu_text_blue hover:border-current dark:text-fipu_light_blue"
						:label="attemptOptions.find(attempt => attempt.id === selectedAttempt)?.label"
						:options="[attemptOptions]"
						left
						@update:model-value="showAttempt" />
				</div>
				<p v-if="process_instance_data" class="mb-4 wrap-break-word" aria-live="polite">
					ID instance procesa: <code>{{ process_instance_data.id }}</code>
				</p>
				<p class="mb-4">Ovdje možete pronaći BPMN graf koji prikazuje aktualno stanje vašeg procesa prakse.</p>
				<p><span class="font-bold text-yellow-700 dark:text-yellow-300">Žutom</span> bojom označene su aktivnosti i događaji koji čekaju izvršavanje.</p>
				<p><span class="font-bold text-green-700 dark:text-green-300">Zelenom</span> bojom označene su završene aktivnosti i događaji.</p>
				<!-- Modal for past tasks (without FormDynamic) -->
				<CardBoxModal v-if="modal_past_bpmn_task" v-model="modal_past_bpmn_task" :title="UserTaskMappings.getTaskProperty(selectedTaskId, 'form_title')" button-label="Povratak">
					<p class="mb-2">Ovaj zadatak je već obavljen.</p>
					<TableInstanceData :instance-id="process_instance_data.id" :task-id="selectedTaskId" :variables="process_instance_data.variables" />
				</CardBoxModal>
			</SectionMain>
			<template v-if="bpmn_model && process_instance_data">
				<Dialog.Root v-if="mobile" :key="'mobile-' + selectedAttempt">
					<Dialog.Trigger as-child>
						<BaseButton class="mx-4 mb-4" :icon="mdiFullscreen" label="Otvori dijagram preko cijelog zaslona" />
					</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Content class="fixed inset-0 z-4001 overflow-hidden bg-white @container-size" :aria-describedby="undefined">
							<Dialog.Title class="sr-only">BPMN dijagram prakse</Dialog.Title>
							<Dialog.Close as-child>
								<BaseButton class="diagram-close absolute z-10 h-11 w-11" :icon="mdiClose" aria-label="Zatvori dijagram" />
							</Dialog.Close>
							<BpmnDiagram class="landscape-diagram" :xml="bpmn_model" :instance="process_instance_data" @past-task-modal="showPastTask" />
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
				<BpmnDiagram v-else :key="selectedAttempt" class="student-process-diagram" :xml="bpmn_model" :instance="process_instance_data" @past-task-modal="showPastTask" />
			</template>
			<p v-else-if="loadError" role="alert">Učitavanje odabranog modela nije uspjelo.</p>
			<div v-else-if="process_instance_data" class="flex items-center justify-center pt-36">
				<LoadingAnimatedIcon></LoadingAnimatedIcon>
			</div>
		</LayoutAuthenticated>
	</div>
</template>

<style scoped>
.student-process-diagram {
	height: auto;
	aspect-ratio: 3 / 1;
}
.diagram-close {
	top: max(.75rem, env(safe-area-inset-top));
	right: max(.75rem, env(safe-area-inset-right));
}
/* The landscape viewer is rotated clockwise inside a portrait viewport. */
@media (orientation: portrait) {
	.diagram-close {
		top: auto;
		bottom: max(.75rem, env(safe-area-inset-bottom));
		transform: rotate(90deg);
	}
}
</style>
