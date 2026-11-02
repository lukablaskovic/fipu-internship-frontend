<template>
	<CardBoxModal v-model="assignmentLimitActive" title="Možete odabrati najviše 3 zadatka." button-label="U redu" />

	<LoadingOverlay :is-active="!dataLoaded" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>

	<CardBoxModal v-if="isModalActive" v-model="isModalActive" large button-label="Zatvori" button="fipu_blue" has-cancel:false @cancel="isModalActive = null">
		<CardboxAllocation :data="isModalActive"></CardboxAllocation>
		<br />
	</CardBoxModal>

	<div class="flex flex-wrap items-center gap-2 p-3 text-sm lg:px-6">
		<input v-model="searchQuery" type="search" aria-label="Pretraži zadatke" placeholder="Zadatak, poslodavac, tehnologija ili lokacija…" class="min-w-0 basis-full rounded-lg border-gray-300 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-1 sm:basis-0" />
		<FormControlListbox v-model="location" :options="locationOptions" aria-label="Lokacija" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
		<FormControlListbox v-model="hours" :options="hourOptions" aria-label="Trajanje prakse" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
		<div class="flex items-center gap-1 lg:hidden">
			<FormControlListbox v-model="sortColumn" :options="columns" aria-label="Poredaj po" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
			<BaseButton :icon="descending ? mdiSortDescending : mdiSortAscending" :aria-label="descending ? 'Poredaj uzlazno' : 'Poredaj silazno'" small @click="descending = !descending" />
		</div>
	</div>

	<table v-if="filteredAssignments.length || !dataLoaded">
		<thead>
			<tr>
				<th v-if="checkable"></th>
				<th />
				<th v-for="column in columns" :key="column.id" :aria-sort="column.id === sortColumn.id ? (descending ? 'descending' : 'ascending') : 'none'">
					<button type="button" class="flex items-center gap-1 text-left" @click="toggleSort(column)">
						{{ column.label }}
						<BaseIcon v-if="column.id === sortColumn.id" :path="descending ? mdiSortDescending : mdiSortAscending" :size="16" w="w-4" h="h-4" aria-hidden="true" />
					</button>
				</th>
				<th />
			</tr>
		</thead>
		<tbody>
			<template v-if="!dataLoaded">
				<SkeletonLoaderAssignmentRow v-for="n in perPage" :key="n" :checkable="checkable" :is-admin="mainStore.userAdmin" />
			</template>
			<template v-else>
				<tr v-for="assignment in paginatedAssignments" :key="assignment['id_zadatak']" :class="{ 'selected-row': assignment_highlight === assignment['id_zadatak'] }">
					<TableCheckboxCell v-if="checkable" :value="isCheckedAssignment(assignment)" :disabled="disableUnchecked && !isCheckedAssignment(assignment)" @checked="checked($event, assignment)" />

					<td class="border-b-0 before:hidden lg:w-6">
						<UserAvatar :avatar="getCompanyLogo(assignment)" class="mx-auto h-24 w-24 lg:h-6 lg:w-6" />
					</td>

					<td data-label="ID Zadatka">
						<TableCellText :value="assignment['id_zadatak']" />
					</td>
					<td data-label="Kontakt email" class="break-all">
						<TableCellText :value="assignment['poslodavac_email']" />
					</td>
					<td data-label="Preferirane tehnologije" class="break-words lg:max-w-[200px]">
						<TableCellText :value="assignment['preferirane_tehnologije']" />
					</td>

					<td data-label="Trajanje (sati)">
						<TableCellText :value="assignment['trajanje_sati']" />
					</td>
					<td data-label="Lokacija">
						<TableCellText :value="assignment['lokacija']" />
					</td>

					<td v-if="mainStore.userAdmin" data-label="Max. studenata">
						<TableCellText :value="assignment['broj_studenata']" />
					</td>

					<td v-if="mainStore.userAdmin" data-label="Dostupno mjesta">
						<TableCellText :value="assignment['dostupno_mjesta']" />
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
	<CardBoxComponentEmpty v-if="!filteredAssignments.length && dataLoaded" />

	<div v-if="filteredAssignments.length" class="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
		<BaseLevel>
			<div class="flex flex-wrap items-center justify-center gap-3">
				<ButtonMenu class="pagination-page-size" :options="tableButtonMenuOptions" :icon="mdiMenuDown" small left @update:model-value="handlePerPageChange" />
				<BasePagination :page="currentPage + 1" :total="filteredAssignments.length" :items-per-page="perPage" @update:page="currentPage = $event - 1" />
			</div>
			<small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
		</BaseLevel>
	</div>
</template>

<script setup>
import { compareValues, findAssignments } from "@/helpers/available-assignment-search.mjs";
import FormControlListbox from "@/components/Premium/FormControlListbox.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import TableCellText from "@/components/Tables/TableCellText.vue";
import { fetchAvailableAssignments } from "@/services/baserow_client_api";

import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import BasePagination from "@/components/Base/BasePagination.vue";
import { usePagination, tableButtonMenuOptions } from "@/composables/usePagination.js";
import { computed, ref, onMounted, watch } from "vue";

import SkeletonLoaderAssignmentRow from "@/components/SkeletonLoaderAssignmentRow.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import ButtonMenu from "@/components/Premium/ButtonMenu.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import { useMainStore } from "@/stores/main_store";

import { mdiEye, mdiMenuDown, mdiSortAscending, mdiSortDescending } from "@mdi/js";
import { DEFAULT_COMPANY_LOGO, fetchCompanyForAssignment, findCompanyForAssignment, getCompanyLogoKey, getCompanyLogoUrl, rememberCompany } from "@/helpers/company-logo.js";

import { useRoute } from "vue-router";

const mainStore = useMainStore();

const props = defineProps({ checkable: Boolean, availableOnly: { type: Boolean, default: true } });

const searchQuery = ref("");
const companiesLoaded = ref(false);
const companyLogoCache = ref({});
const loadingCompanyLogoKeys = new Set();

const allAvailableAssignments = ref([]);

const columns = computed(() => [
	{ id: "id_zadatak", label: "ID Zadatka" },
	{ id: "poslodavac_email", label: "Kontakt email" },
	{ id: "preferirane_tehnologije", label: "Preferirane tehnologije" },
	{ id: "trajanje_sati", label: "Trajanje (sati)" },
	{ id: "lokacija", label: "Lokacija" },
	...(mainStore.userAdmin ? [{ id: "broj_studenata", label: "Max. mjesta" }, { id: "dostupno_mjesta", label: "Dostupno mjesta" }] : []),
]);
const sortColumn = ref(columns.value[0]);
const descending = ref(false);
function toggleSort(column) {
	descending.value = column.id === sortColumn.value.id && !descending.value;
	sortColumn.value = column;
}

function filterOptions(key, label, suffix = "") {
	const values = allAvailableAssignments.value.map(task => String(task[key] ?? "").trim()).filter(Boolean);
	return [{ id: "", label }, ...Array.from(new Set(values)).sort(compareValues).map(id => ({ id, label: id + suffix }))];
}
const locationOptions = computed(() => filterOptions("lokacija", "Sve lokacije"));
const hourOptions = computed(() => filterOptions("trajanje_sati", "Sva trajanja", " sati"));
const location = ref(locationOptions.value[0]);
const hours = ref(hourOptions.value[0]);
const filteredAssignments = computed(() => findAssignments(allAvailableAssignments.value, searchQuery.value, location.value.id, hours.value.id, sortColumn.value.id, descending.value));

const { perPage, currentPage, itemsPaginated: paginatedAssignments, numPages, currentPageHuman, handlePerPageChange } = usePagination(filteredAssignments);

watch([searchQuery, location, hours, sortColumn, descending], () => { currentPage.value = 0; });

const MAX_NUM_ASSIGNMENTS = 3;

const isModalActive = ref(null);
const assignmentLimitActive = ref(false);

const dataLoaded = ref(false);

const checkedAssignments = defineModel({ type: Array, default: () => [] });
let assignment_highlight = ref("");

const route = useRoute();

async function loadData() {
	const id_zadatak = route.params.id_zadatak;

	const resultAssignments = await fetchAvailableAssignments();
	allAvailableAssignments.value = resultAssignments.filter((task) => {
		const condition = props.availableOnly ? task.dostupno_mjesta > 0 : task.dostupno_mjesta >= 0;
		return condition && task.voditelj_odobrio.value == "odobreno";
	});

	dataLoaded.value = true;

	if (id_zadatak) {
		assignment_highlight.value = id_zadatak;
		currentPage.value = getAssignmentPage(id_zadatak);
	}
}

watch(() => route.params.id_zadatak, loadData, { immediate: true });

onMounted(async () => {
	const result = await fetchAvailableAssignments();
	allAvailableAssignments.value = result.filter((task) => {
		const condition = props.availableOnly ? task.dostupno_mjesta > 0 : task.dostupno_mjesta >= 0;
		return condition && task.voditelj_odobrio.value == "odobreno";
	});
});

onMounted(async () => {
	mainStore.allCompanies = await mainStore.fetchCompanies();
	companiesLoaded.value = true;
	loadCompanyLogos(paginatedAssignments.value);
});

const getCompanyLogo = (assignment) => {
	const key = getCompanyLogoKey(assignment);

	return (key && companyLogoCache.value[key]) || getCompanyLogoUrl(findCompanyForAssignment(assignment, mainStore.allCompanies)) || DEFAULT_COMPANY_LOGO;
};

const loadCompanyLogo = async (assignment) => {
	const key = getCompanyLogoKey(assignment);

	if (!key || companyLogoCache.value[key] || loadingCompanyLogoKeys.has(key)) {
		return;
	}

	if (!companiesLoaded.value && !mainStore.allCompanies.length) {
		return;
	}

	const cachedLogo = getCompanyLogoUrl(findCompanyForAssignment(assignment, mainStore.allCompanies));
	if (cachedLogo) {
		companyLogoCache.value[key] = cachedLogo;
		return;
	}

	loadingCompanyLogoKeys.add(key);
	try {
		const company = await fetchCompanyForAssignment(mainStore, assignment);
		rememberCompany(mainStore, company);
		companyLogoCache.value[key] = getCompanyLogoUrl(company) || DEFAULT_COMPANY_LOGO;
	} finally {
		loadingCompanyLogoKeys.delete(key);
	}
};

const loadCompanyLogos = (assignments) => {
	assignments.forEach((assignment) => loadCompanyLogo(assignment));
};

watch(paginatedAssignments, loadCompanyLogos, { immediate: true });
watch(() => mainStore.allCompanies, () => loadCompanyLogos(paginatedAssignments.value), { deep: true });

function getAssignmentPage(id) {
	const index = filteredAssignments.value.findIndex((assignment) => assignment["id_zadatak"] === id);
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
	() => props.availableOnly,
	async () => {
		const result = await fetchAvailableAssignments();

		allAvailableAssignments.value = result.filter((task) => {
			const condition = props.availableOnly ? task.dostupno_mjesta > 0 : task.dostupno_mjesta >= 0;
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
			assignmentLimitActive.value = true;
			assignmentCheckedStates.value[assignment["id_zadatak"]] = false;
			return;
		}
		if (!isCheckedAssignment(assignment)) checkedAssignments.value = [...checkedAssignments.value, assignment];
	} else {
		checkedAssignments.value = checkedAssignments.value.filter((item) => item.id_zadatak !== assignment.id_zadatak);
	}
};
</script>
