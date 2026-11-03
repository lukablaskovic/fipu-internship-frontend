<template>
	<CardBoxModal v-model="assignmentLimitActive" title="Možete odabrati najviše 3 zadatka." button-label="U redu" />

	<LoadingOverlay :is-active="!dataLoaded" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>

	<AssignmentDetailsModal v-model="isModalActive" />

	<div class="assignment-filters table-filter-bar p-3 lg:px-6">
		<div class="assignment-search relative min-w-0 basis-full sm:flex-1 sm:basis-0">
			<BaseIcon :path="mdiMagnify" :size="20" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400" aria-hidden="true" />
			<input v-model="searchQuery" type="search" aria-label="Pretraži zadatke" placeholder="Zadatak, poslodavac, tehnologija ili lokacija…" class="table-filter-search w-full pl-10" />
		</div>
		<FormControlListbox v-model="location" :options="locationOptions" aria-label="Lokacija" button-class="table-filter-select" />
		<div class="assignment-sort flex items-center gap-1 lg:hidden">
			<FormControlListbox v-model="sortColumn" :options="columns" aria-label="Poredaj po" button-class="table-filter-select" />
			<BaseButton color="bg-transparent border-transparent text-gray-700 dark:text-white" :icon="descending ? mdiSortDescending : mdiSortAscending" :aria-label="descending ? 'Poredaj uzlazno' : 'Poredaj silazno'" small @click="descending = !descending" />
		</div>
	</div>

	<table v-if="filteredAssignments.length || !dataLoaded" class="available-assignments">
		<thead>
			<tr>
				<th v-if="checkable"></th>
				<th />
				<SortableTableHeader v-for="column in columns" :key="column.id" :label="column.label" :active="column.id === sortColumn.id" :direction="descending ? 'desc' : 'asc'" @sort="toggleSort(column)" />
				<th />
			</tr>
		</thead>
		<tbody>
			<template v-if="!dataLoaded">
				<SkeletonLoaderAssignmentRow v-for="n in perPage" :key="n" :checkable="checkable" :is-admin="mainStore.userAdmin" />
			</template>
			<template v-else>
				<tr v-for="assignment in paginatedAssignments" :key="assignment['id_zadatak']" :class="{ 'selected-row': assignment_highlight === assignment['id_zadatak'], 'assignment-checked': isCheckedAssignment(assignment) }">
					<TableCheckboxCell v-if="checkable" class="assignment-check" :value="isCheckedAssignment(assignment)" :disabled="disableUnchecked && !isCheckedAssignment(assignment)" @checked="checked($event, assignment)" />

					<td class="assignment-logo border-b-0 before:hidden lg:w-6 lg:text-center">
						<RouterLink v-if="getLinkedCompany(assignment)?.value" :to="{ name: 'poslodavci', query: { p: getLinkedCompany(assignment).value } }" :aria-label="`Poslodavac ${getLinkedCompany(assignment).value}`" class="inline-block rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-fipu_blue">
							<UserAvatar :avatar="getCompanyLogo(assignment)" class="mx-auto h-8 w-8 lg:h-6 lg:w-6" />
						</RouterLink>
						<UserAvatar v-else :avatar="getCompanyLogo(assignment)" class="mx-auto h-8 w-8 lg:h-6 lg:w-6" />
					</td>

					<td data-label="ID Zadatka" class="assignment-title">
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

					<td class="assignment-actions whitespace-nowrap before:hidden lg:w-1">
						<BaseButtons type="justify-start lg:justify-end" no-wrap>
							<BaseButton color="fipu_blue" :icon="mdiEye" :aria-label="`Detalji zadatka ${assignment.id_zadatak}`" small @click="isModalActive = assignment" />
						</BaseButtons>
					</td>
				</tr>
			</template>
		</tbody>
	</table>
	<CardBoxComponentEmpty v-if="!filteredAssignments.length && dataLoaded" />

	<TablePagination v-model:page="currentPage" v-model:per-page="perPage" :total="filteredAssignments.length" />
</template>

<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { useCompanyLogos } from "@/composables/useCompanyLogos.js";
import { getLinkedCompany } from "@/helpers/company-logo.js";
import AssignmentDetailsModal from "@/components/Internship/AssignmentDetailsModal.vue";
import SortableTableHeader from "@/components/Tables/SortableTableHeader.vue";
import { compareValues, findAssignments } from "@/helpers/available-assignment-search.mjs";
import FormControlListbox from "@/components/Form/FormControlListbox.vue";
import TableCellText from "@/components/Tables/TableCellText.vue";
import { fetchAvailableAssignments } from "@/services/baserow_client_api";

import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TablePagination from "@/components/Tables/TablePagination.vue";
import { usePagination } from "@/composables/usePagination.js";
import { computed, ref, onMounted, watch } from "vue";

import SkeletonLoaderAssignmentRow from "@/components/SkeletonLoaderAssignmentRow.vue";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { useMainStore } from "@/stores/main_store";

import { mdiEye, mdiSortAscending, mdiSortDescending, mdiMagnify } from "@mdi/js";

import { RouterLink, useRoute } from "vue-router";

const mainStore = useMainStore();

const props = defineProps({ checkable: Boolean, availableOnly: { type: Boolean, default: true } });

const searchQuery = ref("");

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
const location = ref(locationOptions.value[0]);
const filteredAssignments = computed(() => findAssignments(allAvailableAssignments.value, searchQuery.value, location.value.id, "", sortColumn.value.id, descending.value));

const { perPage, currentPage, itemsPaginated: paginatedAssignments } = usePagination(filteredAssignments);

watch([searchQuery, location, sortColumn, descending], () => { currentPage.value = 0; });

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

const { getCompanyLogo } = useCompanyLogos(paginatedAssignments);

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

<style scoped>
@media (max-width: 1023px) {
	.assignment-filters {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.assignment-search,
	.assignment-sort {
		grid-column: 1 / -1;
	}
	.assignment-filters :deep(.form-select-trigger) {
		min-width: 0;
		min-height: 44px;
	}
	.assignment-filters :deep(.form-select-trigger > span:first-child) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.assignment-sort :deep(.form-select-trigger) {
		flex: 1;
	}
	.assignment-sort > button {
		min-width: 44px;
		min-height: 44px;
	}
	.available-assignments :deep(tbody > tr) {
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr) 44px;
		column-gap: 8px;
		padding: 12px;
	}
	.available-assignments :deep(td) {
		grid-column: 1 / -1;
		min-width: 0;
		gap: 12px;
		padding: 6px 0;
		font-size: 14px;
		line-height: 1.4;
		overflow-wrap: anywhere;
	}
	.available-assignments :deep(td::before) {
		flex: 0 0 35%;
		padding-right: 0;
		font-weight: 500;
	}
	.available-assignments .assignment-logo {
		grid-column: 1;
		grid-row: 1;
		align-self: start;
	}
	.available-assignments .assignment-title {
		grid-column: 2;
		grid-row: 1;
		justify-content: flex-start;
		align-self: center;
		border: 0;
		padding-bottom: 12px;
		text-align: left;
		font-size: 16px;
		font-weight: 600;
	}
	.available-assignments .assignment-title::before,
	.available-assignments :deep(.assignment-check::before) {
		display: none;
	}
	.available-assignments :deep(.assignment-check) {
		grid-column: 3;
		grid-row: 1;
		align-self: start;
		border: 0;
		padding: 0;
	}
	.available-assignments :deep(.assignment-check .checkbox) {
		display: flex;
		width: 44px;
		height: 44px;
		align-items: center;
		justify-content: center;
	}
	.available-assignments .assignment-actions {
		padding-top: 10px;
		padding-bottom: 0;
	}
	.assignment-actions :deep(button) {
		min-width: 44px;
		min-height: 44px;
	}
	.available-assignments .assignment-checked {
		@apply bg-fipu_light_blue/20 dark:bg-fipu_blue/20;
	}
}
</style>
