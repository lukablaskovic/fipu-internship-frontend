<script setup>
import { mdiEye, mdiMenuDown, mdiCloseOutline, mdiSortAscending, mdiSortDescending } from "@mdi/js";
import { tableButtonMenuOptions } from "@/tableButtonMenuOptions.js";
import { StudentMappings, UserTaskMappings } from "@/helpers/maps";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import ButtonMenu from "@/components/Premium/ButtonMenu.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { computed, ref, onMounted, watch } from "vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { adminStore } from "@/main.js";
import { useRoute } from "vue-router";

defineProps({ checkable: Boolean });

const route = useRoute();
const emit = defineEmits(["show-student-diagram"]);

const students = computed(() => adminStore.students);
const studentsFetched = computed(() => adminStore.studentsFetched);

const perPage = ref(10);
const currentPage = ref(0);
const sortDirection = ref("asc");
const sortColumn = ref("ime");

const selectedStudentInstanceID = ref(null);
const selectedStudentInstanceIDForDelete = ref(null);
const instanceDeleteModalActive = ref(false);

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
		filtered = filtered.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) !== "Student ocjenjen");
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
			filtered = filtered.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === stage);
		}
	}

	return filtered;
}

// --- Computed properties for display ---
const filteredAndSortedStudents = computed(() => {
	const filtered = getFilteredStudents(students.value);
	return sortStudents(filtered);
});

const studentsPaginated = computed(() => {
	const start = perPage.value * currentPage.value;
	const end = start + perPage.value;
	return filteredAndSortedStudents.value.slice(start, end);
});

const numPages = computed(() => Math.ceil(filteredAndSortedStudents.value.length / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => Array.from({ length: numPages.value }, (_, i) => i));

// --- Actions ---
function showDiagram(student) {
	selectedStudentInstanceID.value = student["process_instance_id"];
	adminStore.setSelectedStudent(student);
	emit("show-student-diagram", student);
}

function deleteProcessInstance(student) {
	selectedStudentInstanceIDForDelete.value = student["process_instance_id"];
	adminStore.setSelectedStudentForDelete(student);
	instanceDeleteModalActive.value = true;
	console.log(adminStore.selectedStudentForDelete);
}

function handlePerPageChange(option) {
	perPage.value = option.value;
	currentPage.value = 0;
}

// --- Lifecycle and Watchers ---
onMounted(async () => {
	await adminStore.getStudents();
	if (route.params.process_instance_id) {
		selectedStudentInstanceID.value = route.params.process_instance_id;
		const selectedStudent = students.value.find((student) => student["process_instance_id"] === route.params.process_instance_id);
		if (selectedStudent) {
			adminStore.setSelectedStudent(selectedStudent);
			emit("show-student-diagram", selectedStudent);
		}
	} else {
		selectedStudentInstanceID.value = null;
		adminStore.setSelectedStudent(null);
	}
});

watch(selectedStudentInstanceID, (newVal) => {
	if (newVal) {
		const index = filteredAndSortedStudents.value.findIndex((s) => s.process_instance_id === newVal);
		if (index !== -1) {
			currentPage.value = Math.floor(index / perPage.value);
		}
	}
});

watch(studentsPaginated, (newList) => {
	if (newList.length === 0 && currentPage.value > 0) {
		currentPage.value = 0;
	}
});
</script>

<template>
	<LoadingOverlay :is-active="!studentsFetched" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>
	<table>
		<thead>
			<tr>
				<th />
				<th>Model</th>
				<th>JMBAG</th>

				<th class="cursor-pointer px-4 py-2 text-left">
					<div class="flex items-center space-x-1">
						<span>Ime</span>
						<BaseIcon :path="sortColumn === 'ime' && sortDirection === 'asc' ? mdiSortAscending : mdiSortDescending" h="h-4" w="w-4" class="text-gray-600 hover:text-fipu_blue" @click="toggleSortDirection('ime')" />
					</div>
				</th>

				<th class="cursor-pointer px-4 py-2 text-left">
					<div class="flex items-center space-x-1">
						<span>Prezime</span>
						<BaseIcon :path="sortColumn === 'prezime' && sortDirection === 'asc' ? mdiSortAscending : mdiSortDescending" h="h-4" w="w-4" class="text-gray-600 hover:text-fipu_blue" @click="toggleSortDirection('prezime')" />
					</div>
				</th>

				<th>Email</th>
				<th>Godina studija</th>

				<th class="cursor-pointer px-4 py-2 text-left">
					<div class="flex items-center space-x-1">
						<span>Napredak</span>
						<BaseIcon :path="sortColumn === 'progress' && sortDirection === 'asc' ? mdiSortAscending : mdiSortDescending" h="h-4" w="w-4" class="text-gray-600 hover:text-fipu_blue" @click="toggleSortDirection('progress')" />
					</div>
				</th>

				<th>Trenutno stanje</th>
				<th />
			</tr>
		</thead>

		<tbody>
			<tr v-if="!studentsPaginated.length">
				<td colspan="10" class="py-4 text-center">Nema rezultata...</td>
			</tr>
			<tr v-for="student in studentsPaginated" :key="student['process_instance_id']" :class="{ 'selected-row bg-blue-100 dark:bg-blue-900': selectedStudentInstanceID === student['process_instance_id'] }">
				<td class="border-b-0 before:hidden lg:w-6">
					<UserAvatar :avatar="student['avatar']" class="mx-auto flex h-22 w-22 lg:h-12 lg:w-12" />
				</td>
				<td data-label="Model_prakse">
					<PillTag :color="student.Model_prakse.value == 'A' ? 'danger' : 'success'" :label="student.Model_prakse.value" />
				</td>
				<td data-label="JMBAG">{{ student["JMBAG"] }}</td>
				<td data-label="Ime">{{ student["ime"] }}</td>
				<td data-label="Prezime">{{ student["prezime"] }}</td>
				<td data-label="Email">{{ student["email"] }}</td>
				<td data-label="Godina studija">
					{{ StudentMappings.getGodinaStudija(student["godina_studija"]["value"]) }}
				</td>
				<td data-label="Progress" class="lg:w-32">
					<progress
						class="flex w-2/5 self-center lg:w-full"
						:class="{ 'progress-red': getProgressValue(student) <= 3, 'progress-yellow': getProgressValue(student) == 4, 'progress-green': getProgressValue(student) >= 5 }"
						max="7"
						:value="getProgressValue(student)">
						{{ getProgressValue(student) }}
					</progress>
				</td>
				<td data-label="Stanje">
					{{ UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) }}
				</td>
				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiEye" small @click="showDiagram(student)" />
						<BaseButton color="danger" :icon="mdiCloseOutline" small @click="deleteProcessInstance(student)" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>
	<div v-if="instanceDeleteModalActive">
		<CardBoxModal v-model="instanceDeleteModalActive" title="Brisanje procesne instance" button="danger" has-cancel @confirm="adminStore.removeInstanceData()" button-label="Obriši">
			<p>
				<b>OPREZ!</b> Ova radnja će obrisati kompletnu procesnu instancu prakse za studenta: <b>{{ adminStore.selectedStudentForDelete.ime }} {{ adminStore.selectedStudentForDelete.prezime }}</b> uključujući sve podatke koje je student unio,
				generirane prijavnice i dnevnik prakse. <b>Radnja je nepovratna.</b>
			</p>
			<br />
			<p><b>ID procesne instance:</b> {{ adminStore.selectedStudentForDelete.process_instance_id }}</p>
			<p><b>Baserow id_preferencije:</b> {{ adminStore.selectedStudentForDelete["process_instance_data"]["variables"]["id_preferencije"] }}</p>
			<p><b>Baserow id_alokacija:</b> {{ adminStore.selectedStudentForDelete["process_instance_data"]["variables"]["id_alokacija"] }}</p>
			<p><b>Baserow id_prijavnica:</b> {{ adminStore.selectedStudentForDelete["process_instance_data"]["variables"]["id_prijavnica"] }}</p>
			<p><b>Baserow id_dnevnik_prakse:</b> {{ adminStore.selectedStudentForDelete["process_instance_data"]["variables"]["id_dnevnik_prakse"] }}</p>
			<p class="mt-2">Jeste li sigurni da želite obrisati instancu i sve podatke?</p>
			<br />
		</CardBoxModal>
	</div>
	<div class="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
		<BaseLevel>
			<BaseButtons>
				<ButtonMenu :options="tableButtonMenuOptions" :icon="mdiMenuDown" small left @update:modelValue="handlePerPageChange" />

				<BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1" :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
			</BaseButtons>
			<small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
		</BaseLevel>
	</div>
</template>
