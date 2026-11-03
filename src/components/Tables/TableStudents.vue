<script setup>
import SortableTableHeader from "@/components/Tables/SortableTableHeader.vue";
import TableCellText from "@/components/Tables/TableCellText.vue";
import { getInternshipStage } from "@/helpers/internship-stages";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TablePagination from "@/components/Tables/TablePagination.vue";
import { usePagination } from "@/composables/usePagination.js";
import { Progress } from "reka-ui/namespaced";
import { mdiEye, mdiCloseOutline } from "@mdi/js";
import SkeletonLoaderTableRow from "../SkeletonLoaderTableRow.vue";
import { UserTaskMappings } from "@/helpers/maps";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import { computed, ref, watch } from "vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { useAdminStore } from "@/stores/admin_store";

import { useRoute } from "vue-router";

const adminStore = useAdminStore();

const props = defineProps({ checkable: Boolean, search: { type: String, default: "" } });

const route = useRoute();
const emit = defineEmits(["show-student-diagram"]);

const students = computed(() => adminStore.students);
const studentsFetched = computed(() => adminStore.studentsFetched);

const sortDirection = ref("asc");
const sortColumn = ref("ime");

const selectedStudentInstanceID = ref(null);
const selectedStudentForDelete = ref(null);
const instanceDeleteModalActive = ref(false);
const deletionConfirmationText = ref("");
const deletionConfirmed = computed(() => deletionConfirmationText.value.toLowerCase() === "prekidam odabrani proces prakse");

// --- Sorting ---
function getProgressValue(student) {
	return UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "order", student["process_instance_data"]["state"]);
}

function sortStudents(studentsList) {
	return [...studentsList].sort((a, b) => {
		let valueA, valueB;

		if (sortColumn.value === "progress") {
			valueA = getProgressValue(a);
			valueB = getProgressValue(b);
		} else {
			valueA = (a[sortColumn.value] || "").toLowerCase();
			valueB = (b[sortColumn.value] || "").toLowerCase();
		}

		return sortDirection.value === "asc" ? (valueA > valueB ? 1 : -1) : valueA < valueB ? 1 : -1;
	});
}

function toggleSortDirection(column) {
	if (sortColumn.value === column) {
		sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
	} else {
		sortColumn.value = column;
		sortDirection.value = "asc";
	}
}

// --- Filtering ---
function getFilteredStudents(studentsToFilter) {
	let filtered = [...studentsToFilter];

	if (!adminStore.filterFinishedInstances) {
		filtered = filtered.filter((student) => !["finished", "cancelled"].includes(student.process_instance_data.state));
	}

	if (adminStore.filterModelState !== "AB") {
		filtered = filtered.filter((student) => student.Model_prakse.value === adminStore.filterModelState);
	}

	const stage = adminStore.filterInternshipStage;
	if (stage && stage !== "all" && stage !== "") {
		if (stage === "ceka_odobrenje") {
			filtered = filtered.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === "Čeka odobrenje zadatka");
		} else if (stage === "ceka_alokaciju") {
			filtered = filtered.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === "Čeka alokaciju profesora");
		} else {
			filtered = filtered.filter((student) => getInternshipStage(student) === stage);
		}
	}

	const search = props.search.trim().toLocaleLowerCase("hr");
	return filtered.filter((student) => [student.ime, student.prezime, student.JMBAG, student.email].join(" ").toLocaleLowerCase("hr").includes(search));
}

// --- Computed properties for display ---
const filteredAndSortedStudents = computed(() => {
	const filtered = getFilteredStudents(students.value);
	return sortStudents(filtered);
});

const { perPage, currentPage, itemsPaginated: studentsPaginated } = usePagination(filteredAndSortedStudents);

watch(filteredAndSortedStudents, () => { currentPage.value = 0; });

// --- Actions ---
function showDiagram(student) {
	selectedStudentInstanceID.value = student["process_instance_id"];
	emit("show-student-diagram", student);
}

function deleteProcessInstance(student) {
	selectedStudentForDelete.value = student;
	deletionConfirmationText.value = "";
	instanceDeleteModalActive.value = true;
}

function confirmInstanceDeletion() {
	if (!deletionConfirmed.value || !selectedStudentForDelete.value) return;
	return adminStore.removeInstanceData(selectedStudentForDelete.value);
}

// --- Lifecycle and Watchers ---
watch(students, () => {
	if (route.params.process_instance_id) {
		selectedStudentInstanceID.value = route.params.process_instance_id;
		const selectedStudent = students.value.find((student) => student["process_instance_id"] === route.params.process_instance_id);
		if (selectedStudent) {
			emit("show-student-diagram", selectedStudent);
		}
	} else {
		selectedStudentInstanceID.value = null;
	}
}, { immediate: true });

watch(selectedStudentInstanceID, (newVal) => {
	if (newVal) {
		const index = filteredAndSortedStudents.value.findIndex((s) => s.process_instance_id === newVal);
		if (index !== -1) {
			currentPage.value = Math.floor(index / perPage.value);
		}
	}
});

</script>

<template>
	<p v-if="studentsFetched" class="px-4 py-2 text-xs text-gray-500 dark:text-slate-400" role="status">{{ filteredAndSortedStudents.length }} studenata</p>
	<LoadingOverlay :is-active="!studentsFetched" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>
	<table v-if="filteredAndSortedStudents.length || !studentsFetched">
		<thead>
			<tr>
				<SortableTableHeader label="Ime" :active="sortColumn === 'ime'" :direction="sortDirection" class="px-4 py-2 text-left" @sort="toggleSortDirection('ime')" />

				<SortableTableHeader label="Prezime" :active="sortColumn === 'prezime'" :direction="sortDirection" class="px-4 py-2 text-left" @sort="toggleSortDirection('prezime')" />

				<th>Model</th>
				<th>JMBAG</th>

				<SortableTableHeader label="Napredak" :active="sortColumn === 'progress'" :direction="sortDirection" class="px-4 py-2 text-left" @sort="toggleSortDirection('progress')" />

				<th>Trenutno stanje</th>
				<th />
			</tr>
		</thead>

		<tbody>
			<template v-if="!studentsFetched">
				<SkeletonLoaderTableRow v-for="n in perPage" :key="n" />
			</template>
			<template v-else>
				<tr v-for="student in studentsPaginated" :key="student['process_instance_id']" :class="{ 'selected-row bg-fipu_blue/10 dark:bg-fipu_blue/20': selectedStudentInstanceID === student['process_instance_id'] }">
					<td data-label="Ime"><TableCellText :value="student['ime']" /></td>
					<td data-label="Prezime"><TableCellText :value="student['prezime']" /></td>
					<td data-label="Model_prakse">
						<PillTag :color="student.Model_prakse.value == 'A' ? 'danger' : 'success'" :label="`Model ${student.Model_prakse.value} · ${student.process_instance_data?.model?.version ? 'v' + student.process_instance_data.model.version : 'verzija nepoznata'}`" />
					</td>
					<td data-label="JMBAG"><TableCellText :value="student['JMBAG']" /></td>
					<td data-label="Progress" class="lg:w-32">
						<Progress.Root
							class="h-3 w-2/5 self-center overflow-hidden rounded-full bg-gray-200 ring-1 ring-inset ring-black/10 dark:bg-slate-950 dark:ring-white/15 lg:w-full"
							:max="7"
							:model-value="getProgressValue(student)"
							:aria-label="`Napredak: ${student.ime} ${student.prezime}`">
							<Progress.Indicator
								class="student-progress-fill h-full origin-left rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
								:class="{ 'bg-red-500': getProgressValue(student) <= 3, 'bg-yellow-500': getProgressValue(student) == 4, 'bg-green-500': getProgressValue(student) >= 5 }"
								:style="{ width: `${(getProgressValue(student) / 7) * 100}%` }" />
						</Progress.Root>
					</td>
					<td data-label="Stanje">
						<TableCellText :value="UserTaskMappings.getTaskProperty(student['process_instance_data']['pending'][0], 'name', student['process_instance_data']['state'])" />
					</td>
					<td class="whitespace-nowrap before:hidden lg:w-1">
						<BaseButtons type="justify-start" no-wrap>
							<BaseButton color="fipu_blue" :icon="mdiEye" :aria-label="`Otvori BPMN prikaz: ${student.ime} ${student.prezime}`" small @click="showDiagram(student)" />
							<BaseButton color="danger" :icon="mdiCloseOutline" small @click="deleteProcessInstance(student)" />
						</BaseButtons>
					</td>
				</tr>
			</template>
		</tbody>
	</table>
	<CardBoxComponentEmpty v-if="!filteredAndSortedStudents.length && studentsFetched" />
	<div v-if="instanceDeleteModalActive">
		<CardBoxModal v-model="instanceDeleteModalActive" title="Brisanje procesne instance" button="danger" has-cancel button-label="Obriši" :disabled-condition="!deletionConfirmed" @confirm="confirmInstanceDeletion">
			<p>
				<b>OPREZ!</b> Ova radnja će obrisati kompletnu procesnu instancu prakse za studenta: <b>{{ selectedStudentForDelete.ime }} {{ selectedStudentForDelete.prezime }}</b> uključujući sve podatke koje je student unio,
				generirane prijavnice i dnevnik prakse. <b>Radnja je nepovratna.</b>
			</p>
			<br />
			<p><b>ID procesne instance:</b> {{ selectedStudentForDelete.process_instance_id }}</p>
			<p><b>Baserow id_preferencije:</b> {{ selectedStudentForDelete["process_instance_data"]["variables"]["id_preferencije"] }}</p>
			<p><b>Baserow id_alokacija:</b> {{ selectedStudentForDelete["process_instance_data"]["variables"]["id_alokacija"] }}</p>
			<p><b>Baserow id_prijavnica:</b> {{ selectedStudentForDelete["process_instance_data"]["variables"]["id_prijavnica"] }}</p>
			<p><b>Baserow id_dnevnik_prakse:</b> {{ selectedStudentForDelete["process_instance_data"]["variables"]["id_dnevnik_prakse"] }}</p>
			<p class="mt-2">Jeste li sigurni da želite obrisati instancu i sve podatke?</p>
			<FormField class="mt-4" name="instance-deletion-confirmation" label="Za potvrdu upišite: Prekidam odabrani proces prakse">
				<FormControl v-model="deletionConfirmationText" autocomplete="off" />
			</FormField>
		</CardBoxModal>
	</div>
	<TablePagination v-model:page="currentPage" v-model:per-page="perPage" :total="filteredAndSortedStudents.length" />
</template>

<style scoped>
.student-progress-fill {
	background-image: linear-gradient(135deg, rgb(255 255 255 / 25%) 25%, transparent 25%, transparent 50%, rgb(255 255 255 / 25%) 50%, rgb(255 255 255 / 25%) 75%, transparent 75%, transparent);
	background-size: 24px 24px;
}

@media (prefers-reduced-motion: no-preference) {
	.student-progress-fill {
		animation: progress-fill 700ms ease-out, progress-stripes 1s linear infinite;
	}
}

.student-progress-fill[data-state="complete"] {
	animation: none;
	transition: none;
}

@keyframes progress-stripes {
	to {
		background-position: 24px 0;
	}
}

@keyframes progress-fill {
	from {
		transform: scaleX(0);
	}
	to {
		transform: scaleX(1);
	}
}
</style>
