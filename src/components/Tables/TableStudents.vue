<script setup>
import { computed, ref, onMounted } from "vue";
import { watch } from "vue";

import { tableButtonMenuOptions } from "@/tableButtonMenuOptions.js";
import { StudentMappings, UserTaskMappings } from "@/helpers/maps";
import ButtonMenu from "@/components/Premium/ButtonMenu.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { mdiEye, mdiMenuDown } from "@mdi/js";
import { adminStore } from "@/main.js";
import { useRoute } from "vue-router";

const route = useRoute();

defineProps({
	checkable: Boolean,
});

const students = computed(() => adminStore.students);
const selectedStudentInstanceID = ref(null);

const studentsFetched = computed(() => adminStore.studentsFetched);
const emit = defineEmits(["show-student-diagram"]);

watch(selectedStudentInstanceID, (newVal) => {
	if (newVal) {
		const selectedStudent = students.value.find(student => student.process_instance_id === newVal);
		if (selectedStudent) {
			updateCurrentPageForSelectedStudent(selectedStudent);
		}
	}
});

function showDiagram(student) {
	selectedStudentInstanceID.value = student["process_instance_id"];
	adminStore.setSelectedStudent(student);

	emit("show-student-diagram", student);
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

	// Paginate the filtered students
	return filteredStudents.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1));
});

const numPages = computed(() => {
	// Use `filteredStudents` length instead of `studentsPaginated`
	const filteredStudents = students.value.filter((student) => {
		// Apply all filters here again, similar to above
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
</script>

<template>
	<LoadingOverlay :is-active="!studentsFetched" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>
	<table>
		<thead>
			<tr>
				<th />
				<th>Model</th>
				<th>JMBAG</th>
				<th>Ime</th>
				<th>Prezime</th>
				<th>Email</th>
				<th>Godina studija</th>
				<th>Napredak</th>
				<th>Trenutno stanje prakse</th>
				<th />
			</tr>
		</thead>

		<tbody>
			<tr
				v-for="student in studentsPaginated"
				:key="student['process_instance_id']"
				:class="{
					'selected-row': selectedStudentInstanceID === student['process_instance_id'],
				}">
				<td class="border-b-0 before:hidden lg:w-6">
					<UserAvatar :avatar="student['avatar']" class="mx-auto flex h-22 w-22 lg:h-12 lg:w-12" />
				</td>
				<td data-label="Model_prakse">
					<PillTag :color="student.Model_prakse.value == 'A' ? 'danger' : 'success'" :label="student.Model_prakse.value" />
				</td>
				<td data-label="JMBAG">
					{{ student["JMBAG"] }}
				</td>
				<td data-label="Ime">
					{{ student["ime"] }}
				</td>
				<td data-label="Prezime">
					{{ student["prezime"] }}
				</td>
				<td data-label="Email">
					{{ student["email"] }}
				</td>
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
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>

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
