<script setup>
import { computed, ref, onMounted, watch } from "vue";

import { mdiEye } from "@mdi/js";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import { mainStore, guestStore, adminStore } from "@/main.js";
import UserAvatar from "@/components/User/UserAvatar.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";

import { useRoute } from "vue-router";

defineProps({
	checkable: Boolean,
});

const MAX_NUM_ASSIGNMENTS = 3;

const isModalActive = ref(null);
const allAvailableAssignments = ref([]);
const allCompanies = ref([]);

let checkedAssignments = computed(() => guestStore.checkedAssignments);
let assignment_highlight = ref("");

const route = useRoute();

async function loadData() {
	const id_zadatak = route.params.id_zadatak;
	if (id_zadatak) {
		assignment_highlight.value = id_zadatak;
	}
	let result = await mainStore.fetchCompanies();
	allCompanies.value = result.data.results;
}

watch(() => route.params.id_zadatak, loadData, {
	immediate: true,
});

onMounted(async () => {
	const result = await guestStore.fetchAvailableAssignments();
	allAvailableAssignments.value = result.filter((task) => {
		const condition = adminStore.availableAssignmentsFilter ? task.dostupno_mjesta > 0 : task.dostupno_mjesta >= 0;
		return condition && task.voditelj_odobrio.value == "odobreno";
	});
	guestStore.resetAssignments();
});

const getCompanyLogo = (assignment) => {
	const company = allCompanies.value.find((c) => c.naziv === assignment["Poslodavac"][0].value);
	return company && company["logo"] && company["logo"][0] && company["logo"][0]["url"] ? company["logo"][0]["url"] : "No-Logo.png";
};

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

watch(
	() => adminStore.availableAssignmentsFilter,
	async () => {
		const result = await guestStore.fetchAvailableAssignments();

		allAvailableAssignments.value = result.filter((task) => {
			const condition = adminStore.availableAssignmentsFilter ? task.dostupno_mjesta > 0 : task.dostupno_mjesta >= 0;
			return condition && task.voditelj_odobrio.value == "odobreno";
		});
	},
	{ immediate: true }
);

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
		guestStore.addAssignment(assignment);
	} else {
		guestStore.removeAssignment(assignment);
	}
};
</script>

<template>
	<LoadingOverlay :is-active="!allAvailableAssignments.length" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>
	<CardBoxModal v-if="isModalActive" v-model="isModalActive" button-label="Zatvori" button="fipu_blue" has-cancel:false @cancel="mainStore.activateLogoutModal(false)">
		<CardboxAllocation :data="isModalActive"></CardboxAllocation>

		<br />
	</CardBoxModal>

	<table>
		<thead>
			<tr>
				<th v-if="checkable"></th>
				<th />
				<th>ID Zadatka</th>
				<th>Kontakt email</th>
				<th>Preferirane tehnologije</th>
				<th>Trajanje (sati)</th>
				<th>Lokacija</th>
				<th v-if="mainStore.userAdmin">Max. mjesta</th>
				<th v-if="mainStore.userAdmin">Dostupno mjesta</th>

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

				<td class="border-b-0 lg:w-6 before:hidden">
					<UserAvatar :avatar="getCompanyLogo(assignment)" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
				</td>

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

				<td v-if="mainStore.userAdmin" data-label="Dostupno mjesta">
					{{ assignment["dostupno_mjesta"] }}
				</td>

				<td class="before:hidden lg:w-1 whitespace-nowrap">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiEye" small @click="isModalActive = assignment" />
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
