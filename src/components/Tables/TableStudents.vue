<script setup>
import { computed, ref, onMounted } from "vue";

import { mdiEye } from "@mdi/js";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { adminStore } from "@/main.js";
import { StudentMappings, UserTaskMappings } from "@/helpers/maps";
import { useRoute } from "vue-router";
import UserAvatar from "@/components/User/UserAvatar.vue";
const route = useRoute();

defineProps({
	checkable: Boolean,
});

const students = computed(() => adminStore.students);
const selectedStudentInstanceID = ref(null);

const studentsFetched = computed(() => adminStore.studentsFetched);
const emit = defineEmits(["show-student-diagram"]);

function showDiagram(student) {
	selectedStudentInstanceID.value = student["process_instance_id"];

	adminStore.setSelectedStudent(student);
	emit("show-student-diagram", student);
}

onMounted(async () => {
	if (route.params.process_instance_id) {
		selectedStudentInstanceID.value = route.params.process_instance_id;
		const selectedStudent = students.value.find((student) => student["process_instance_id"] === route.params.process_instance_id);
		adminStore.setSelectedStudent(selectedStudent);
		updateCurrentPageForSelectedStudent(selectedStudent);
	} else {
		selectedStudentInstanceID.value = null;
		adminStore.setSelectedStudent(null);
	}
	await adminStore.getStudents();
});

function updateCurrentPageForSelectedStudent(selectedStudent) {
	const selectedIndex = students.value.indexOf(selectedStudent);
	if (selectedIndex !== -1) {
		currentPage.value = Math.floor(selectedIndex / perPage.value);
	}
}

const perPage = ref(5);
const currentPage = ref(0);
const studentsPaginated = computed(() => {
	let filteredStudents = students.value;

	if (!adminStore.filterFinishedInstances) {
		filteredStudents = filteredStudents.filter((student) => UserTaskMappings.getTaskProperty(student["process_instance_data"]["pending"][0], "name", student["process_instance_data"]["state"]) !== "Student ocjenjen");
	}

	return filteredStudents.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1));
});
const numPages = computed(() => Math.ceil(studentsPaginated.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
	const pagesList = [];
	for (let i = 0; i < numPages.value; i++) {
		pagesList.push(i);
	}
	return pagesList;
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
				<td class="border-b-0 lg:w-6 before:hidden">
					<UserAvatar :avatar="student['avatar'][0]['url']" class="flex w-22 h-22 mx-auto lg:w-12 lg:h-12" />
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

				<td class="before:hidden lg:w-1 whitespace-nowrap">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiEye" small @click="showDiagram(student)" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>

	<div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
		<BaseLevel>
			<BaseButtons>
				<BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1" :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
			</BaseButtons>
			<small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
		</BaseLevel>
	</div>
</template>
