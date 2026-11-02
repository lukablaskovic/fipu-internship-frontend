<script setup>
import { internshipStages } from "@/helpers/internship-stages";
import { mdiAccountMultiple, mdiAccount, mdiClose } from "@mdi/js";
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import { Dialog } from "reka-ui/namespaced";
import { ProcessInstance } from "@/services/bpmn_engine_api";

import { UserTaskMappings, SendTaskMappings } from "@/helpers/maps";
import { useAdminStore } from "@/stores/admin_store";
import { useMainStore } from "@/stores/main_store";
import { useSnackBarStore } from "@/stores/snackbar_store";


import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import TableInstanceData from "@/components/BPMN/TableInstanceData.vue";
import LoadingAnimatedIcon from "@/components/LoadingAnimatedIcon.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import TableStudents from "@/components/Tables/TableStudents.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import FormDynamic from "@/components/Form/FormDynamic.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BpmnDiagram from "@/components/BPMN/BpmnDiagram.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControlListbox from "@/components/Premium/FormControlListbox.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
const bpmn_diagram_active = ref(false);
const selectedStudent = ref(null);
const selectedTaskId = ref("");
let diagramTrigger;
function restoreDiagramFocus(event) {
	if (diagramTrigger?.isConnected) {
		event.preventDefault();
		diagramTrigger.focus();
	}
}

import BPMN_red from "/BPMN/red_bpmn_professor_pending.png";
import BPMN_blue from "/BPMN/blue_bpmn_default.png";
import BPMN_green from "/BPMN/green_bpmn_done.png";
import BPMN_msg_event from "/BPMN/msg_event.png";

const adminStore = useAdminStore();
const mainStore = useMainStore();
const snackBarStore = useSnackBarStore();

const modal_select_bpmn_task = ref(false);
const modal_past_bpmn_task = ref(false);
const modal_send_task = ref(false);
const bpmn_help_modal = ref(false);

const router = useRouter();
const process_instance_data = ref(null);
const bpmn_model = ref(null);
const taskInfo = ref();
const answers = ref(null);
const coordinatorTask = computed(() => {
	const task = selectedTaskId.value;
	return process_instance_data.value?.pending.includes(task) && ["alociranje_profesor", "model_b_odobrenje_zadatka", "upis_ocjene"].includes(task) ? task : null;
});

watch([modal_select_bpmn_task, () => process_instance_data.value?.id, coordinatorTask], async ([open, instanceId, task], _, onCleanup) => {
	answers.value = null;
	taskInfo.value = undefined;
	if (!open || !task) return;
	let cancelled = false;
	onCleanup(() => { cancelled = true; });
	const info = await ProcessInstance.getTaskInfo(instanceId, task);
	if (!cancelled) taskInfo.value = info;
});

async function handleProcessDiagram(student) {
	selectedStudent.value = student;
	selectedTaskId.value = "";
	diagramTrigger = document.activeElement;
	try {
		process_instance_data.value = await adminStore.getProcessInstanceData(selectedStudent.value);
		bpmn_model.value = await ProcessInstance.diagram(process_instance_data.value.id);

		bpmn_diagram_active.value = true;

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
	const taskMapping = SendTaskMappings.tasks.find((task) => task._id === selectedTaskId.value);

	if (!taskMapping) return { postData: null, template: null, to: null };

	const postData = {};
	for (let key in taskMapping.body) {
		if (typeof taskMapping.body[key] === "function") {
			postData[key] = taskMapping.body[key](selectedStudent.value.process_instance_data.variables.process_instance_id);
		} else {
			postData[key] = selectedStudent.value.process_instance_data.variables[key] || "";
		}
	}

	const to = selectedStudent.value.process_instance_data.variables[taskMapping.to] || "";

	return { postData, template: taskMapping.template, to };
}

const studentSearch = ref("");
const modelOptions = [{ id: "AB", label: "Svi modeli" }, { id: "A", label: "Model A" }, { id: "B", label: "Model B" }];
const processOptions = [{ id: true, label: "Sve instance" }, { id: false, label: "Aktivne instance" }];
const stageOptions = [{ id: "all", label: "Sve faze procesa" }, { id: "ceka_alokaciju", label: "Čeka alokaciju (A)" }, { id: "ceka_odobrenje", label: "Čeka odobrenje (B)" }, ...internshipStages.map((stage) => ({ id: stage, label: stage }))];
const modelFilter = computed({
	get: () => modelOptions.find((option) => option.id === adminStore.filterModelState),
	set: (option) => {
		adminStore.filterModelState = option.id;
		router.replace({ query: { ...route.query, model: option.id === "AB" ? undefined : option.id } });
	},
});
const processFilter = computed({
	get: () => processOptions.find((option) => option.id === adminStore.filterFinishedInstances),
	set: (option) => { adminStore.filterFinishedInstances = option.id; },
});
const stageFilter = computed({
	get: () => stageOptions.find((option) => option.id === adminStore.filterInternshipStage),
	set: (option) => {
		adminStore.filterInternshipStage = option.id;
		router.replace({ query: { ...route.query, stage: option.id === "all" ? undefined : option.id } });
	},
});

let email_postData = ref(null);
let email_template = ref(null);
let email_to = ref(null);

async function sendAnAdditionalEmail() {
	let postData = email_postData.value;
	let template = email_template.value;
	let to = email_to.value;

	if (newEmail.value) {
		to = newEmail.value;
	}

	if (template === "poslodavac_after_allocation") {
		const link = await ProcessInstance.evaluationLink(selectedStudent.value.process_instance_id);
		if (!link?.url) {
			snackBarStore.pushMessage("Nema aktivne evaluacije za ovog studenta.", "danger");
			return;
		}
		postData = { ...postData, evaluacija_url: link.url };
	}

	if (postData && template && to) {
		await adminStore.sendAnAdditionalEmail(postData, to, template);
		snackBarStore.pushMessage("Dodatni email uspješno poslan!", "success");
		modal_send_task.value = false;
	}
}

watch(() => route.params.process_instance_id, loadDataForStudent, { immediate: true });

watch(modal_send_task, (newValue) => {
	let { postData, template, to } = getPostDataForSendEmail();
	email_postData.value = postData;
	email_template.value = template;
	email_to.value = to;

	if (newValue) {
		newEmail.value = to;
	}
});

watch(() => route.query.model, (model) => {
	adminStore.filterModelState = modelOptions.some((option) => option.id === model) ? model : "AB";
}, { immediate: true });
watch(() => route.query.stage, (stage) => {
	adminStore.filterInternshipStage = stageOptions.some((option) => option.id === stage) ? stage : "all";
}, { immediate: true });

watch(() => route.query.instances, (instances) => {
	if (instances === "all") adminStore.filterFinishedInstances = true;
}, { immediate: true });

onMounted(() => adminStore.getStudents());

const isSubmitting = ref(false);
async function handleNewInstance() {
	if (isSubmitting.value || !coordinatorTask.value || !answers.value) return;
	isSubmitting.value = true;
	let saved = false;
	const instanceId = process_instance_data.value.id;
	const task = coordinatorTask.value;
	try {
		const result = await adminStore.handleNewInstance(instanceId, task, answers.value);
		if (result?.status !== "OK") throw new Error("Process update failed");
		saved = true;
		if (UserTaskMappings.getTaskProperty(task, "snackbar_msg")) {
			snackBarStore.pushMessage(UserTaskMappings.getTaskProperty(task, "snackbar_msg"), UserTaskMappings.getTaskProperty(task, "snackbar_color"));
		}
		if (!(await adminStore.getStudents())) throw new Error("Students could not be fetched");
		const student = adminStore.students.find((student) => student.process_instance_id === instanceId);
		if (!student) throw new Error("Student could not be fetched");
		selectedStudent.value = student;
		process_instance_data.value = student.process_instance_data;
	} catch (error) {
		snackBarStore.pushMessage(saved ? "Promjena je spremljena, ali popis studenata nije osvježen. Pokušajte ponovno otvoriti popis." : "Promjena nije spremljena. Molimo pokušajte ponovno.", "danger");
	} finally {
		isSubmitting.value = false;
	}
}

onMounted(loadDataForStudent);
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="mainStore.userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Studenti u procesu prakse" button-enabled main @click="bpmn_help_modal = true"> </SectionTitleLineWithButton>
				<div class="table-filter-bar mb-3 flex flex-wrap items-center gap-2 text-sm">
					<input v-model="studentSearch" type="search" aria-label="Pretraži studente" placeholder="Ime, JMBAG ili email…" class="min-w-0 basis-full rounded-lg border-gray-300 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-1 sm:basis-0" />
					<FormControlListbox v-model="modelFilter" :options="modelOptions" aria-label="Model prakse" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
					<FormControlListbox v-model="processFilter" :options="processOptions" aria-label="Status instance" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
					<FormControlListbox v-model="stageFilter" :options="stageOptions" aria-label="Faza procesa" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
				</div>

				<CardBox has-table>
					<TableStudents :search="studentSearch" @show-student-diagram="handleProcessDiagram" />
				</CardBox>

				<CardBoxModal v-if="bpmn_help_modal" v-model="bpmn_help_modal" :title="'BPMN Graf - Legenda'" button-label="Povratak">
					<div class="mb-4 flex items-center space-x-4">
						<img :src="BPMN_blue" alt="Description 1" class="h-32 w-32 object-contain" />
						<p class="text-sm"><b>Plava boja</b> - <i> pending task</i>. Zahtjeva akciju studenta ili poslodavca.</p>
					</div>

					<div class="mb-4 flex items-center space-x-4">
						<img :src="BPMN_green" alt="Description 2" class="h-32 w-32 object-contain" />
						<p class="text-sm"><b>Zelena boja</b> - <i>finished task</i>. Uspješno procesirani kroz BPMN engine.</p>
					</div>

					<div class="mb-4 flex items-center space-x-4">
						<img :src="BPMN_red" alt="Description 3" class="h-32 w-32 object-contain" />
						<p class="text-sm"><b>Crvena boja</b> - <i>pending task</i>. Zahtjeva akciju voditelja prakse.</p>
					</div>

					<div class="mb-4 flex items-center space-x-4">
						<img :src="BPMN_msg_event" alt="Description 3" class="h-32 w-32 object-contain" />
						<p class="text-sm"><b>Send task</b> - Prošle <i>message taskove</i> je moguće ponovno pozvati.</p>
					</div>

					<hr />
					<br />
				</CardBoxModal>
			</SectionMain>

			<Dialog.Root v-model:open="bpmn_diagram_active">
				<Dialog.Portal>
					<Dialog.Overlay class="reka-animated fixed inset-0 z-[4000] bg-slate-950/80" />
					<Dialog.Content
						class="reka-animated fixed inset-0 z-[4001] flex min-h-0 flex-col overflow-hidden bg-white text-slate-900 shadow-lg dark:bg-slate-900 dark:text-slate-100 sm:inset-4 sm:rounded-xl"
						:aria-describedby="undefined"
						@close-auto-focus="restoreDiagramFocus">
						<header class="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 p-4 dark:border-slate-700">
							<div class="min-w-0">
								<Dialog.Title class="text-xl font-semibold">BPMN dijagram</Dialog.Title>
								<p v-if="selectedStudent" class="truncate text-sm text-slate-600 dark:text-slate-300">{{ selectedStudent.ime }} {{ selectedStudent.prezime }}</p>
							</div>
							<Dialog.Close as-child><BaseButton :icon="mdiClose" aria-label="Zatvori BPMN prikaz" /></Dialog.Close>
						</header>
						<BpmnDiagram
							v-if="bpmn_model && process_instance_data"
							class="bpmn-dialog-canvas"
							:xml="bpmn_model"
							:instance="process_instance_data"
							@current-task-modal="selectedTaskId = $event.id; modal_select_bpmn_task = true"
							@past-task-modal="selectedTaskId = $event.id; modal_past_bpmn_task = true"
							@send-task-modal="selectedTaskId = $event.id; modal_send_task = true" />
						<div v-else class="flex flex-1 items-center justify-center" role="status">
							<LoadingAnimatedIcon />
						</div>
						<!-- Modal for the current task -->
						<CardBoxModal
							v-if="modal_select_bpmn_task"
							v-model="modal_select_bpmn_task"
							is-bpmn
							description="Trenutni korak procesa prakse."
							:title="UserTaskMappings.getTaskProperty(selectedTaskId, 'form_title')"
							button-label="Potvrda"
							has-cancel
							:has-confirm="!!coordinatorTask"
							:disabled-condition="!answers || isSubmitting"
							@confirm="handleNewInstance()">
							<p v-if="!coordinatorTask" class="mb-4">
								{{ UserTaskMappings.getTaskProperty(selectedTaskId, "bpmn_pending_info_msg", process_instance_data["state"]) }}
							</p>

							<p v-else-if="taskInfo === undefined" role="status">Učitavanje obrasca…</p>
							<p v-else-if="!taskInfo?.form_fields" role="alert">Obrazac nije učitan. Ponovno otvorite zadatak.</p>
							<FormDynamic v-else :task="taskInfo" :preferences-id="process_instance_data.variables.id_preferencije" :check-assignment="selectedTaskId === 'model_b_odobrenje_zadatka'" @answers="answers = $event" />
						</CardBoxModal>

						<!-- Modal for past tasks (without FormDynamic) -->
						<CardBoxModal v-if="modal_past_bpmn_task" v-model="modal_past_bpmn_task" is-bpmn :title="UserTaskMappings.getTaskProperty(selectedTaskId, 'form_title')" description="Ovaj zadatak je već obavljen. Pregled spremljenih podataka." button-label="Zatvori">
							<TableInstanceData :instance-id="process_instance_data.id" :task-id="selectedTaskId" :variables="process_instance_data.variables" />
						</CardBoxModal>

						<CardBoxModal v-if="modal_send_task" v-model="modal_send_task" is-bpmn title="Ponovno slanje e-maila" description="Ponovno pošaljite obavijest za ovaj korak procesa." has-cancel button-label="Pošalji" @confirm="sendAnAdditionalEmail()">
							<p class="mb-5 text-slate-600 dark:text-slate-300">Obavijest je već poslana. Možete je poslati ponovno na spremljenu ili novu adresu. Promjena primatelja ovdje neće ažurirati adresu u procesu.</p>

							<FormField label="E-mail primatelja">
								<FormControl v-model="newEmail" :icon-left="mdiAccount" name="email" type="email" autocomplete="email" />
							</FormField>
						</CardBoxModal>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</LayoutAuthenticated>
	</div>
</template>

<style scoped>
.bpmn-dialog-canvas {
	flex: 1;
	height: auto;
	min-height: 0;
	overflow: hidden;
}
</style>
