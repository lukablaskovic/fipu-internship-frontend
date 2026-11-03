<script setup>
import TableCellText from "@/components/Tables/TableCellText.vue";
import Tooltip from "@/components/Base/Tooltip.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TablePagination from "@/components/Tables/TablePagination.vue";
import { usePagination } from "@/composables/usePagination.js";
import { computed, ref, onMounted, watch } from "vue";
import SortableTableHeader from "@/components/Tables/SortableTableHeader.vue";
import FormControlListbox from "@/components/Form/FormControlListbox.vue";
import { compareValues } from "@/helpers/available-assignment-search.mjs";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiMagnify } from "@mdi/js";
import { normalizeString } from "@/helpers/search-utils.js";
import { appConfig } from "@/config";
import { ProcessInstance } from "@/services/bpmn_engine_api";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import { useMainStore } from "@/stores/main_store";
import { useStudentStore } from "@/stores/student_store";
import { useAdminStore } from "@/stores/admin_store";

import LoadingOverlay from "../LoadingOverlay.vue";
import { StudentMappings } from "@/helpers/maps";
import PillTag from "../PillTag/PillTag.vue";

const mainStore = useMainStore();
const studentStore = useStudentStore();
const adminStore = useAdminStore();

defineProps({
	checkable: Boolean,
});

const allocations = ref([]);
const search = ref("");
const modelFilter = ref("Svi modeli");
const versionFilter = ref("Sve verzije");
const statusFilter = ref("Svi statusi");
const sortColumn = ref("");
const sortDirection = ref("asc");

function sortBy(column) {
	sortDirection.value = sortColumn.value === column && sortDirection.value === "asc" ? "desc" : "asc";
	sortColumn.value = column;
}

function versionLabel(row) {
	return row.modelVersion ? `v${row.modelVersion}` : "verzija nepoznata";
}

function statusLabel(row) {
	return StudentMappings.getStatusProperty(row.status_zahtjeva?.value, "label") || "Bez statusa";
}

const versionOptions = computed(() => ["Sve verzije", ...Array.from(new Set(allocations.value.map(versionLabel))).sort(compareValues)]);
const statusOptions = computed(() => ["Svi statusi", ...Array.from(new Set(allocations.value.map(statusLabel))).sort(compareValues)]);
const dataLoaded = ref(false);

onMounted(async () => {
	const [rows] = await Promise.all([studentStore.getAllocationsPublic(), adminStore.getStudents()]);
	allocations.value = await Promise.all((rows || []).filter(row => row.Alocirani_zadatak !== null).map(async row => {
		const student = adminStore.students.find(student => row.process_instance_id
			? student.process_instance_id === row.process_instance_id
			: row.id_alokacija && student.process_instance_data.variables.id_alokacija === row.id_alokacija);
		const instance = student?.process_instance_data || (row.process_instance_id && await ProcessInstance.get(row.process_instance_id));
		const model = ["A", "B"].find(label => instance?.model?.model_path === appConfig[`bpmn_process_name_${label}`] + ".bpmn");
		const variables = adminStore.students.find(stud => stud.process_instance_data.variables.JMBAG == row.JMBAG)?.process_instance_data.variables;
		return {
			...row,
			ime: mainStore.userAdmin ? variables?.student_ime : mainStore.currentUser.ime,
			prezime: mainStore.userAdmin ? variables?.student_prezime : mainStore.currentUser.prezime,
			process_instance_id: row.process_instance_id || instance?.id,
			model: model || student?.Model_prakse?.value,
			modelVersion: instance?.model?.version,
		};
	}));
	dataLoaded.value = true;
});

function getVariableByIdAlokacija(id_alokacija, variableName) {
	const student = adminStore.students.find((stud) => stud.process_instance_data.variables.id_alokacija == id_alokacija);
	return student ? student.process_instance_data.variables[variableName] : null;
}

async function fetchPDF(type, search) {
	let result = await adminStore.fetchPDF(search);
	let url;
	if (type == "potvrda") {
		url = result.data.results[0]["ispunjena_potvrda_upload"][0].url;
	} else {
		url = result.data.results[0]["dnevnik_prakse_upload"][0].url;
	}

	window.open(url, "_blank");
}

const filteredAllocations = computed(() => {
	const term = normalizeString(search.value);
	const rows = allocations.value.filter(row => {
		if (modelFilter.value !== "Svi modeli" && row.model !== modelFilter.value) return false;
		if (versionFilter.value !== "Sve verzije" && versionLabel(row) !== versionFilter.value) return false;
		if (statusFilter.value !== "Svi statusi" && statusLabel(row) !== statusFilter.value) return false;
		return !term || normalizeString([
			row.ime, row.prezime, row.JMBAG, row.Alocirani_zadatak, row.process_instance_id, row.model,
			versionLabel(row), mainStore.userAdmin ? statusLabel(row) : "",
		].join(" ")).includes(term);
	});
	if (sortColumn.value) {
		rows.sort((a, b) => compareValues(a[sortColumn.value] ?? "", b[sortColumn.value] ?? "") * (sortDirection.value === "asc" ? 1 : -1));
	}
	return rows;
});

const { perPage, currentPage, itemsPaginated: allocationsPaginated } = usePagination(filteredAllocations);
watch(filteredAllocations, () => { currentPage.value = 0; });

</script>

<template>
	<LoadingOverlay :is-active="!allocations.length && !dataLoaded" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>
	<div class="table-filter-bar p-3 lg:px-6">
		<div class="relative min-w-0 basis-full sm:flex-1 sm:basis-0">
			<BaseIcon :path="mdiMagnify" :size="20" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400" aria-hidden="true" />
			<input v-model="search" type="search" aria-label="Pretraži alokacije" placeholder="Ime, JMBAG, zadatak ili ID instance…" class="table-filter-search w-full pl-10" />
		</div>
		<FormControlListbox v-model="modelFilter" :options="['Svi modeli', 'A', 'B']" aria-label="Model" button-class="table-filter-select" />
		<FormControlListbox v-model="versionFilter" :options="versionOptions" aria-label="Verzija modela" button-class="table-filter-select" />
		<FormControlListbox v-if="mainStore.userAdmin" v-model="statusFilter" :options="statusOptions" aria-label="Status zahtjeva" button-class="table-filter-select" />
	</div>
	<table v-if="filteredAllocations.length || !dataLoaded">
		<thead>
			<tr>
				<SortableTableHeader label="Ime" :active="sortColumn === 'ime'" :direction="sortDirection" @sort="sortBy('ime')" />
				<SortableTableHeader label="Prezime" :active="sortColumn === 'prezime'" :direction="sortDirection" @sort="sortBy('prezime')" />
				<th>Instance ID</th>
				<th>Model</th>
				<th>Verzija modela</th>
				<th>Alocirani zadatak</th>
				<th v-if="mainStore.userAdmin">Status zahtjeva</th>
				<th>Prijavnica ispunjena</th>
				<th>Dnevnik prakse predan</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="allocation in allocationsPaginated" :key="allocation['id_alokacija']">
				<TableCheckboxCell v-if="checkable" :assignment-data="company" />
				<td data-label="Ime">
					<TableCellText :value="allocation.ime" />
				</td>
				<td data-label="Prezime">
					<TableCellText :value="allocation.prezime" />
				</td>
				<td data-label="Instance ID">
					<Tooltip v-if="allocation.process_instance_id" :content="allocation.process_instance_id">
						<span tabindex="0" class="cursor-help font-mono">{{ allocation.process_instance_id.slice(0, 5) }}</span>
					</Tooltip>
					<span v-else>—</span>
				</td>
				<td data-label="Model" class="lg:text-center">
					<PillTag v-if="allocation.model" :color="allocation.model === 'A' ? 'danger' : 'success'" :label="allocation.model" />
				</td>
				<td data-label="Verzija modela"><TableCellText :value="versionLabel(allocation)" /></td>
				<td data-label="Alocirani zadatak" class="underline hover:text-fipu_blue">
					<TableCellText :value="allocation['Alocirani_zadatak']"><router-link :to="`/zadaci/${allocation['Alocirani_zadatak']}`">{{ allocation["Alocirani_zadatak"] }}</router-link></TableCellText>
				</td>

				<td v-if="mainStore.userAdmin" data-label="Status zahtjeva">
					<PillTag :label="statusLabel(allocation)" :color="StudentMappings.getStatusProperty(allocation.status_zahtjeva?.value, 'color')"></PillTag>
				</td>
				<td data-label="Prijavnica ispunjena">
					<div class="flex items-center">
						<TableCheckboxCell readonly :value="allocation['popunjena_prijavnica']" />
						<button v-if="allocation['popunjena_prijavnica'] && mainStore.userAdmin" type="button" class="ml-8 cursor-pointer text-sm underline hover:text-fipu_light_blue" @click="adminStore.openPDF(allocation)">
							Generirana potvrda</button
						>
					</div>
				</td>
				<td data-label="Dnevnik prakse predan">
					<div class="flex items-center">
						<TableCheckboxCell readonly :value="allocation[(allocation, 'predan_dnevnik_prakse')]" />
						<p
							v-if="allocation['predan_dnevnik_prakse'] && mainStore.userAdmin"
							class="ml-8 cursor-pointer text-sm underline hover:text-fipu_light_blue"
							@click="fetchPDF('potvrda', getVariableByIdAlokacija(allocation['id_alokacija'], 'id_dnevnik_prakse'))">
							Potpisana potvrda
						</p>
						<p
							v-if="allocation['predan_dnevnik_prakse'] && mainStore.userAdmin"
							class="ml-8 cursor-pointer text-sm underline hover:text-fipu_light_blue"
							@click="fetchPDF('dnevnik', getVariableByIdAlokacija(allocation['id_alokacija'], 'id_dnevnik_prakse'))">
							Dnevnik prakse
						</p>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	<CardBoxComponentEmpty v-if="!filteredAllocations.length && dataLoaded" />

	<TablePagination v-model:page="currentPage" v-model:per-page="perPage" :total="filteredAllocations.length" />
</template>
