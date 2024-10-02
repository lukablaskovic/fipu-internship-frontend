<script setup>
import { computed, ref, onMounted, watch } from "vue";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import CardBoxAllocation from "../Cardbox/CardBoxAllocation.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import { useRoute } from "vue-router";
import { mainStore } from "@/main.js";
import { mdiEye } from "@mdi/js";

defineProps({
	checkable: Boolean,
});

const MAX_NUM_ASSIGNMENTS = 3;

const isModalActive = ref(null);
const allAvailableAssignments = ref([]);

let checkedAssignments = computed(() => mainStore.checkedAssignments);
let assignment_highlight = ref("");
const route = useRoute();

async function loadData() {
	const id_zadatak = route.params.id_zadatak;
	if (id_zadatak) {
		assignment_highlight.value = id_zadatak;
	}
}

watch(() => route.params.id_zadatak, loadData, {
	immediate: true,
});

onMounted(async () => {
	const result = await mainStore.fetchAvailableAssignments();
	allAvailableAssignments.value = result.filter((task) => task.voditelj_odobrio.value == "odbijeno");

	mainStore.resetAssignments();
});

const perPage = ref(5);
const currentPage = ref(0);
const assignmentsPaginated = computed(() => allAvailableAssignments.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1)));

const numPages = computed(() => Math.ceil(allAvailableAssignments.value.length / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
	const pagesList = [];

	for (let i = 0; i < numPages.value; i++) {
		pagesList.push(i);
	}

	return pagesList;
});

const assignmentCheckedStates = ref({});

const disableUnchecked = computed(() => {
	return checkedAssignments.value.length >= MAX_NUM_ASSIGNMENTS;
});

watch(checkedAssignments, (newVals) => {
	newVals.forEach((assignment) => {
		assignmentCheckedStates.value[assignment["id_zadatak"]] = false;
	});
});

const isCheckedAssignment = (assignment) => {
	return checkedAssignments.value.some((a) => a["id_zadatak"] === assignment["id_zadatak"]);
};

const checked = (value, assignment) => {
	// When checking
	if (value) {
		if (checkedAssignments.value.length >= MAX_NUM_ASSIGNMENTS) {
			alert("You can only select a maximum of 3 assignments.");
			assignmentCheckedStates[assignment["id_zadatak"]] = false;
			return;
		}
		mainStore.addAssignment(assignment);
	} else {
		mainStore.removeAssignment(assignment);
	}
};
</script>

<template>
	<!--
	<LoadingOverlay :is-active="!allAvailableAssignments.length" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>
  -->
	<CardBoxModal v-if="isModalActive" v-model="isModalActive" button-label="Zatvori" button="fipu_blue" has-cancel:false @cancel="mainStore.activateLogoutModal(false)">
		<CardBoxAllocation :data="isModalActive"></CardBoxAllocation>

		<br />
	</CardBoxModal>

	<table>
		<thead>
			<tr>
				<th v-if="checkable"></th>

				<th>ID Zadatka</th>
				<th>Kontakt email</th>
				<th>Preferirane tehnologije</th>
				<th>Trajanje (sati)</th>
				<th>Lokacija</th>
				<th>Max. mjesta</th>
				<th />
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="assignment in assignmentsPaginated"
				:key="assignment['id_zadatak']"
				:class="{
					'selected-row': assignment_highlight === assignment['id_zadatak'],
				}">
				<TableCheckboxCell v-if="checkable" :value="isCheckedAssignment(assignment)" :disabled="disableUnchecked && !isCheckedAssignment(assignment)" @checked="checked($event, assignment)" />

				<td data-label="id_zadatak">
					{{ assignment["id_zadatak"] }}
				</td>
				<td data-label="Kontakt email">
					{{ assignment["poslodavac_email"] }}
				</td>
				<td data-label="Preferirane tehnologije">
					{{ assignment["preferirane_tehnologije"] }}
				</td>
				<td data-label="Trajanje (sati)">
					{{ assignment["trajanje_sati"] }}
				</td>
				<td data-label="Lokacija">
					{{ assignment["lokacija"] }}
				</td>
				<td v-if="mainStore.userAdmin" data-label="Max. studenata">
					{{ assignment["broj_studenata"] }}
				</td>

				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiEye" small @click="isModalActive = assignment" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>

	<div class="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
		<BaseLevel>
			<BaseButtons>
				<BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1" :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
			</BaseButtons>
			<small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
		</BaseLevel>
	</div>
</template>
