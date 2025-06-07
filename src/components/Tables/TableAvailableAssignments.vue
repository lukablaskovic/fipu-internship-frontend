<template>
	<LoadingOverlay :is-active="!allAvailableAssignments.length" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>

	<CardBoxModal v-if="isModalActive" v-model="isModalActive" button-label="Zatvori" button="fipu_blue" has-cancel:false @cancel="mainStore.activateLogoutModal(false)">
		<CardboxAllocation :data="isModalActive"></CardboxAllocation>
		<br />
	</CardBoxModal>

	<div class="mb-4">
		<input type="text" v-model="searchQuery" placeholder="Pretraži zadatke..." class="w-full border border-gray-50 p-2 text-gray-700 outline-none focus:border-fipu_blue" />
	</div>

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
			<template v-if="!allAvailableAssignments.length">
				<SkeletonLoaderAssignmentRow v-for="n in perPage" :key="n" :checkable="checkable" :is-admin="mainStore.userAdmin" />
			</template>
			<template v-else>
				<tr v-if="paginatedAssignments.length === 0">
					<td colspan="9" class="py-4 text-center">Nema rezultata...</td>
				</tr>
				<tr v-for="assignment in paginatedAssignments" :key="assignment['id_zadatak']" :class="{ 'selected-row': assignment_highlight === assignment['id_zadatak'] }">
					<TableCheckboxCell v-if="checkable" :value="isCheckedAssignment(assignment)" :disabled="disableUnchecked && !isCheckedAssignment(assignment)" @checked="checked($event, assignment)" />

					<td class="border-b-0 before:hidden lg:w-6">
						<UserAvatar :avatar="getCompanyLogo(assignment)" class="mx-auto h-24 w-24 lg:h-6 lg:w-6" />
					</td>

					<td data-label="id_zadatak">
						{{ assignment["id_zadatak"] }}
					</td>
					<td data-label="Kontakt email">
						{{ assignment["poslodavac_email"] }}
					</td>
					<td data-label="Preferirane tehnologije" class="max-w-[100px] truncate">
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

					<td class="whitespace-nowrap before:hidden lg:w-1">
						<BaseButtons type="justify-start lg:justify-end" no-wrap>
							<BaseButton color="fipu_blue" :icon="mdiEye" small @click="isModalActive = assignment" />
						</BaseButtons>
					</td>
				</tr>
			</template>
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

<script setup>
import { computed, ref, onMounted, watch } from "vue";

import SkeletonLoaderAssignmentRow from "@/components/SkeletonLoaderAssignmentRow.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import { tableButtonMenuOptions } from "@/tableButtonMenuOptions.js";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import ButtonMenu from "@/components/Premium/ButtonMenu.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import { mainStore, adminStore } from "@/main.js";
import { mdiEye, mdiMenuDown } from "@mdi/js";

import { useRoute } from "vue-router";

defineProps({ checkable: Boolean });

const perPage = ref(10);

function handlePerPageChange(option) {
	perPage.value = option.value;
	currentPage.value = 0;
}

const currentPage = ref(0);
const searchQuery = ref("");

const filteredAssignments = computed(() => {
	const query = searchQuery.value.toLowerCase();
	if (!query) {
		return allAvailableAssignments.value;
	}

	return allAvailableAssignments.value.filter((assignment) => {
		const idMatch = assignment["id_zadatak"].toString().toLowerCase().includes(query);
		const techMatch = assignment["preferirane_tehnologije"].toLowerCase().includes(query);
		return idMatch || techMatch;
	});
});

// Paginated version of filtered assignments
const paginatedAssignments = computed(() => {
	const start = perPage.value * currentPage.value;
	const end = perPage.value * (currentPage.value + 1);
	return filteredAssignments.value.slice(start, end);
});

const numPages = computed(() => Math.ceil(filteredAssignments.value.length / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
	const pagesList = [];
	for (let i = 0; i < numPages.value; i++) {
		pagesList.push(i);
	}
	return pagesList;
});

const MAX_NUM_ASSIGNMENTS = 3;

const isModalActive = ref(null);

const allAvailableAssignments = ref([]);

let checkedAssignments = computed(() => mainStore.checkedAssignments);
let assignment_highlight = ref("");

const route = useRoute();

async function loadData() {
	const id_zadatak = route.params.id_zadatak;

	const resultAssignments = await mainStore.fetchAvailableAssignments();
	allAvailableAssignments.value = resultAssignments.filter((task) => {
		const condition = adminStore.availableAssignmentsFilter ? task.dostupno_mjesta > 0 : task.dostupno_mjesta >= 0;
		return condition && task.voditelj_odobrio.value == "odobreno";
	});

	if (id_zadatak) {
		assignment_highlight.value = id_zadatak;
		currentPage.value = getAssignmentPage(id_zadatak);
	}
}

watch(() => route.params.id_zadatak, loadData, { immediate: true });

onMounted(async () => {
	const result = await mainStore.fetchAvailableAssignments();
	allAvailableAssignments.value = result.filter((task) => {
		const condition = adminStore.availableAssignmentsFilter ? task.dostupno_mjesta > 0 : task.dostupno_mjesta >= 0;
		return condition && task.voditelj_odobrio.value == "odobreno";
	});
	mainStore.resetAssignments();
});

onMounted(async () => {
	mainStore.allCompanies = await mainStore.fetchCompanies();
});

const getCompanyLogo = (assignment) => {
	return mainStore.allCompanies.find((c) => c.naziv === assignment?.Poslodavac?.[0]?.value)?.logo?.[0]?.url ?? "No-Logo.png";
};

function getAssignmentPage(id) {
	const index = allAvailableAssignments.value.findIndex((assignment) => assignment["id_zadatak"] === id);
	if (index === -1) return 0;
	return Math.floor(index / perPage.value);
}

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
		const result = await mainStore.fetchAvailableAssignments();

		allAvailableAssignments.value = result.filter((task) => {
			const condition = adminStore.availableAssignmentsFilter ? task.dostupno_mjesta > 0 : task.dostupno_mjesta >= 0;
			return condition && task.voditelj_odobrio.value == "odobreno";
		});
	},
	{ immediate: true },
);

const isCheckedAssignment = (assignment) => {
	return checkedAssignments.value.some((a) => a["id_zadatak"] === assignment["id_zadatak"]);
};

const checked = (value, assignment) => {
	if (value) {
		if (checkedAssignments.value.length >= MAX_NUM_ASSIGNMENTS) {
			alert("Možete odabrati najviše 3 zadatka.");
			assignmentCheckedStates[assignment["id_zadatak"]] = false;
			return;
		}
		mainStore.addAssignment(assignment);
	} else {
		mainStore.removeAssignment(assignment);
	}
};
</script>
