<script setup>
import { computed, ref, onMounted } from "vue";
import { watch } from "vue";

import { tableButtonMenuOptions } from "@/tableButtonMenuOptions.js";
import { StudentMappings, UserTaskMappings } from "@/helpers/maps";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import { mdiEye, mdiMenuDown, mdiCloseOutline } from "@mdi/js";
import ButtonMenu from "@/components/Premium/ButtonMenu.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { adminStore } from "@/main.js";
import { useRoute } from "vue-router";

import { mdiSortAscending, mdiSortDescending } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";

const route = useRoute();

const sortDirection = ref("asc");
const sortColumn = ref("ime");
let instanceDeleteModalActive = ref(false);

function sortStudents(studentsList) {
	const sortedStudents = [...studentsList];

	sortedStudents.sort((a, b) => {
		let valueA, valueB;

		if (sortColumn.value === "progress") {
			valueA = getProgressValue(a);
			valueB = getProgressValue(b);
		} else {
			valueA = a[sortColumn.value].toLowerCase();
			valueB = b[sortColumn.value].toLowerCase();
		}

		if (sortDirection.value === "asc") {
			return valueA > valueB ? 1 : -1;
		} else {
			return valueA < valueB ? 1 : -1;
		}
	});

	return sortedStudents;
}

defineProps({
	checkable: Boolean,
});

const students = computed(() => adminStore.students);
const selectedStudentInstanceID = ref(null);
const selectedStudentInstanceIDForDelete = ref(null);

const studentsFetched = computed(() => adminStore.studentsFetched);
const emit = defineEmits(["show-student-diagram"]);

watch(selectedStudentInstanceID, (newVal) => {
	if (newVal) {
		const selectedStudent = students.value.find((student) => student.process_instance_id === newVal);

		if (selectedStudent) {
			// Start with sorting the students
			let sortedStudents = sortStudents(students.value);

			let filteredStudents = sortedStudents;

			// Apply the filter for finished instances
			if (!adminStore.filterFinishedInstances) {
				filteredStudents = filteredStudents.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) !== "Student ocjenjen");
			}

			// Apply the model state filter (A, B, AB)
			if (adminStore.filterModelState === "A") {
				filteredStudents = filteredStudents.filter((student) => student.Model_prakse.value === "A");
			} else if (adminStore.filterModelState === "B") {
				filteredStudents = filteredStudents.filter((student) => student.Model_prakse.value === "B");
			} else if (adminStore.filterModelState === "AB") {
				filteredStudents = filteredStudents.filter((student) => student.Model_prakse.value === "A" || student.Model_prakse.value === "B");
			}

			// Apply internship stage filter (ensure valid stage)
			if (adminStore.filterInternshipStage && adminStore.filterInternshipStage !== "all" && adminStore.filterInternshipStage !== "") {
				if (adminStore.filterInternshipStage === "ceka_odobrenje") {
					filteredStudents = filteredStudents.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === "Čeka odobrenje zadatka");
				} else if (adminStore.filterInternshipStage === "ceka_alokaciju") {
					filteredStudents = filteredStudents.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === "Čeka alokaciju profesora");
				} else {
					filteredStudents = filteredStudents.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === adminStore.filterInternshipStage);
				}
			}

			// Now that all filters are applied, let's check if the student exists in the filtered list
			const selectedIndexInFilteredList = filteredStudents.findIndex((student) => student.process_instance_id === newVal);

			if (selectedIndexInFilteredList !== -1) {
				// Get the selected student’s page number
				const selectedPage = Math.floor(selectedIndexInFilteredList / perPage.value);

				// Update the current page to show the selected student
				currentPage.value = selectedPage;
			} else {
				// Log if the student is not found in the filtered list
				console.log("Selected student not found in the filtered list.");
			}
		}
	}
});

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

onMounted(async () => {
	await adminStore.getStudents();
	if (route.params.process_instance_id) {
		selectedStudentInstanceID.value = route.params.process_instance_id;
		const selectedStudent = students.value.find((student) => student["process_instance_id"] === route.params.process_instance_id);
		if (selectedStudent) {
			adminStore.setSelectedStudent(selectedStudent);
			emit("show-student-diagram", selectedStudent); // Trigger the diagram display immediately
		}
	} else {
		selectedStudentInstanceID.value = null;
		adminStore.setSelectedStudent(null);
	}
});

function updateCurrentPageForSelectedStudent(selectedStudent) {
	const selectedIndex = students.value.indexOf(selectedStudent);
	if (selectedIndex !== -1) {
		currentPage.value = Math.floor(selectedIndex / perPage.value);
	}
}

const perPage = ref(10);
const currentPage = ref(0);

function handlePerPageChange(option) {
	perPage.value = option.value;
	currentPage.value = 0;
}

const studentsPaginated = computed(() => {
	let filteredStudents = students.value;

	if (!adminStore.filterFinishedInstances) {
		filteredStudents = filteredStudents.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) !== "Student ocjenjen");
	}

	if (adminStore.filterModelState === "A") {
		filteredStudents = filteredStudents.filter((student) => student.Model_prakse.value === "A");
	} else if (adminStore.filterModelState === "B") {
		filteredStudents = filteredStudents.filter((student) => student.Model_prakse.value === "B");
	} else if (adminStore.filterModelState === "AB") {
		filteredStudents = filteredStudents.filter((student) => student.Model_prakse.value === "A" || student.Model_prakse.value === "B");
	}

	// Adjusted internship stage filter logic with manual checks for specific values
	if (adminStore.filterInternshipStage && adminStore.filterInternshipStage !== "all" && adminStore.filterInternshipStage !== "") {
		// Manual checks for specific internship stages
		if (adminStore.filterInternshipStage === "ceka_odobrenje") {
			filteredStudents = filteredStudents.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === "Čeka odobrenje zadatka");
		} else if (adminStore.filterInternshipStage === "ceka_alokaciju") {
			filteredStudents = filteredStudents.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === "Čeka alokaciju profesora");
		} else {
			// Default case for other internship stages
			filteredStudents = filteredStudents.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === adminStore.filterInternshipStage);
		}
	}

	filteredStudents = sortStudents(filteredStudents);

	return filteredStudents.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1));
});

const numPages = computed(() => {
	const filteredStudents = students.value.filter((student) => {
		let match = true;

		if (!adminStore.filterFinishedInstances) {
			match = match && UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) !== "Student ocjenjen";
		}

		if (adminStore.filterModelState === "A") {
			match = match && student.Model_prakse.value === "A";
		} else if (adminStore.filterModelState === "B") {
			match = match && student.Model_prakse.value === "B";
		} else if (adminStore.filterModelState === "AB") {
			match = match && (student.Model_prakse.value === "A" || student.Model_prakse.value === "B");
		}

		// Adjusted internship stage filter logic
		if (adminStore.filterInternshipStage && adminStore.filterInternshipStage !== "all" && adminStore.filterInternshipStage !== "") {
			match = match && UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) === adminStore.filterInternshipStage;
		}

		return match;
	});

	return Math.ceil(filteredStudents.length / perPage.value);
});

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
	return Array.from({ length: numPages.value }, (_, i) => i);
});

function getProgressValue(student) {
	return UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "order", student["process_instance_data"]["state"]);
}
function toggleSortDirection(column) {
	if (sortColumn.value === column) {
		sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
	} else {
		sortColumn.value = column;
		sortDirection.value = "asc";
	}
}

watch(studentsPaginated, (newList) => {
	if (newList.length === 0 && numPages.value > 1) {
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
			<tr
				v-for="student in studentsPaginated"
				:key="student['process_instance_id']"
				:class="{
					'selected-row bg-blue-100 dark:bg-blue-900': selectedStudentInstanceID === student['process_instance_id'],
				}">
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
						:class="{
							'progress-red': getProgressValue(student) <= 3,
							'progress-yellow': getProgressValue(student) == 4,
							'progress-green': getProgressValue(student) >= 5,
						}"
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
