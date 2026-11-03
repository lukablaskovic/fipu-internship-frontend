<script setup>
import Tooltip from "@/components/Base/Tooltip.vue";
import AssignmentDetailsModal from "@/components/Internship/AssignmentDetailsModal.vue";
import SortableTableHeader from "@/components/Tables/SortableTableHeader.vue";
import TableCellText from "@/components/Tables/TableCellText.vue";
import { computed, ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { mdiEye, mdiCheckCircle, mdiCloseBox } from "@mdi/js";
import { useAdminStore } from "@/stores/admin_store";
import { useSnackBarStore } from "@/stores/snackbar_store";
import { usePagination } from "@/composables/usePagination.js";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import TablePagination from "@/components/Tables/TablePagination.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import PillTag from "@/components/PillTag/PillTag.vue";

const adminStore = useAdminStore();
const snackBarStore = useSnackBarStore();

const props = defineProps({
	search: { type: String, default: "" },
	status: { type: String, default: "all" },
	availability: { type: String, default: "all" },
});
const route = useRoute();
const assignments = ref([]);
const isModalActive = ref(null);
const loading = ref(true);
const loadError = ref(false);
const sortColumn = ref("id_zadatak");
const sortDirection = ref("asc");
const columns = [
	{ key: "id_zadatak", label: "ID Zadatka" },
	{ key: "poslodavac_email", label: "Kontakt email" },
	{ key: "preferirane_tehnologije", label: "Preferirane tehnologije" },
	{ key: "trajanje_sati", label: "Trajanje (sati)" },
	{ key: "lokacija", label: "Lokacija" },
	{ key: "broj_studenata", label: "Max. mjesta" },
	{ key: "dostupno_mjesta", label: "Dostupno mjesta" },
	{ key: "voditelj_odobrio", label: "Status" },
];
const statuses = {
	"u razradi": { label: "Neodobren", color: "warning" },
	odobreno: { label: "Odobren", color: "success" },
	odbijeno: { label: "Odbijen", color: "danger" },
};
const filteredAssignments = computed(() => {
	const query = props.search.trim().toLocaleLowerCase("hr");
	return assignments.value.filter((assignment) => {
		const status = assignment.voditelj_odobrio?.value;
		return (props.status === "all" || status === props.status)
			&& (props.availability === "all" || (props.availability === "free" ? assignment.dostupno_mjesta > 0 : assignment.dostupno_mjesta <= 0))
			&& [assignment.id_zadatak, assignment.poslodavac_email, assignment.preferirane_tehnologije, assignment.lokacija, assignment.opis_zadatka, ...(assignment.Poslodavac || []).map((company) => company.value)].join(" ").toLocaleLowerCase("hr").includes(query);
	}).sort((a, b) => {
		const valueA = sortColumn.value === "voditelj_odobrio" ? a.voditelj_odobrio?.value : a[sortColumn.value];
		const valueB = sortColumn.value === "voditelj_odobrio" ? b.voditelj_odobrio?.value : b[sortColumn.value];
		return String(valueA ?? "").localeCompare(String(valueB ?? ""), "hr", { numeric: true, sensitivity: "base" }) * (sortDirection.value === "asc" ? 1 : -1);
	});
});
const { perPage, currentPage, itemsPaginated: assignmentsPaginated } = usePagination(filteredAssignments);

function toggleSort(column) {
	sortDirection.value = sortColumn.value === column && sortDirection.value === "asc" ? "desc" : "asc";
	sortColumn.value = column;
}
watch([() => props.search, () => props.status, () => props.availability, sortColumn, sortDirection], () => { currentPage.value = 0; });
watch([() => route.params.id_zadatak, assignments], async () => {
	await nextTick();
	const index = filteredAssignments.value.findIndex((assignment) => String(assignment.id_zadatak) === route.params.id_zadatak);
	if (index >= 0) currentPage.value = Math.floor(index / perPage.value);
});

async function refreshAssignments() {
	const result = await adminStore.getAssignments();
	if (!Array.isArray(result)) throw new Error("Assignments could not be fetched");
	assignments.value = result;
}
async function loadAssignments() {
	loading.value = true;
	loadError.value = false;
	try {
		await refreshAssignments();
	} catch {
		loadError.value = true;
	} finally {
		loading.value = false;
	}
}
onMounted(loadAssignments);

const confirmationModal = ref({
	isActive: false,
	action: null,
	assignment: { id_zadatak: null },
});

const handleConfirmation = (action, assignment) => {
	confirmationModal.value = {
		isActive: true,
		action,
		assignment: assignment,
	};
};

const isLoading = ref(false);
const confirmTaskAction = async () => {
	if (isLoading.value) return;
	isLoading.value = true;
	let saved = false;
	try {
		const actionStr = confirmationModal.value.action === "accept" ? "odobreno" : "odbijeno";
		const result = await adminStore.handleTask(confirmationModal.value.assignment["id_zadatak"], actionStr);
		if (!result) throw new Error("Approval failed");
		saved = true;
		confirmationModal.value.isActive = false;
		snackBarStore.pushMessage("Ažurirano stanje zadatka", "success");
		await refreshAssignments();
	} catch (error) {
		snackBarStore.pushMessage(saved ? "Stanje je spremljeno, ali popis zadataka nije osvježen. Pokušajte ponovno otvoriti popis." : "Stanje zadatka nije ažurirano. Molimo pokušajte ponovno.", "danger");
	} finally {
		isLoading.value = false;
	}
};

const cancelTaskAction = () => {
	confirmationModal.value.isActive = false;
};
</script>

<template>
	<AssignmentDetailsModal v-model="isModalActive" />

	<CardBoxModal v-model="confirmationModal.isActive" :disabled-condition="isLoading" title="Potvrda akcije" :button-label="confirmationModal.action === 'accept' ? 'Prihvati' : 'Odbij'" has-cancel @cancel="cancelTaskAction" @confirm="confirmTaskAction">
		<div v-if="confirmationModal.action === 'accept'" class="mb-4">
			Jeste li sigurni da želite prihvatiti zadatak -
			<b>{{ confirmationModal.assignment["id_zadatak"] }}</b> ?
		</div>
		<div v-else class="mb-4">
			Jeste li sigurni da želite odbiti zadatak -
			<b>{{ confirmationModal.assignment["id_zadatak"] }}</b> ?
		</div>
	</CardBoxModal>

	<div v-if="loading" class="p-6 text-center" role="status">Učitavanje...</div>
	<div v-else-if="loadError" class="space-y-3 p-6 text-center" role="alert">
		<p>Zadatke nije moguće učitati. Pokušajte ponovno.</p>
		<BaseButton label="Pokušaj ponovno" color="fipu_blue" @click="loadAssignments" />
	</div>
	<template v-else>
		<table v-if="filteredAssignments.length">
			<thead>
				<tr>
					<SortableTableHeader v-for="column in columns" :key="column.key" :label="column.label" :active="sortColumn === column.key" :direction="sortDirection" @sort="toggleSort(column.key)" />
					<th><span class="sr-only">Akcije</span></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="assignment in assignmentsPaginated" :key="assignment.id_zadatak" :class="{ 'selected-row': route.params.id_zadatak === String(assignment.id_zadatak) }">
					<td v-for="column in columns" :key="column.key" :data-label="column.label" class="break-words" :class="{ 'lg:max-w-[200px]': ['id_zadatak', 'poslodavac_email', 'preferirane_tehnologije'].includes(column.key) }">
						<PillTag v-if="column.key === 'voditelj_odobrio'" :label="statuses[assignment.voditelj_odobrio?.value]?.label || 'Nepoznat'" :color="statuses[assignment.voditelj_odobrio?.value]?.color || 'info'" small />
						<TableCellText v-else :value="assignment[column.key] ?? '—'" />
					</td>
					<td class="whitespace-nowrap before:hidden lg:w-1">
						<BaseButtons type="justify-start lg:justify-end" no-wrap>
							<Tooltip content="Detalji zadatka"><BaseButton color="fipu_blue" :icon="mdiEye" :aria-label="`Detalji zadatka ${assignment.id_zadatak}`" small @click="isModalActive = assignment" /></Tooltip>
							<template v-if="assignment.voditelj_odobrio?.value === 'u razradi'">
								<Tooltip content="Prihvati zadatak"><BaseButton :disabled="isLoading" color="success" :icon="mdiCheckCircle" :aria-label="`Prihvati zadatak ${assignment.id_zadatak}`" small @click="handleConfirmation('accept', assignment)" /></Tooltip>
								<Tooltip content="Odbij zadatak"><BaseButton :disabled="isLoading" color="danger" :icon="mdiCloseBox" :aria-label="`Odbij zadatak ${assignment.id_zadatak}`" small @click="handleConfirmation('decline', assignment)" /></Tooltip>
							</template>
						</BaseButtons>
					</td>
				</tr>
			</tbody>
		</table>
		<CardBoxComponentEmpty v-else />
		<TablePagination v-model:page="currentPage" v-model:per-page="perPage" :total="filteredAssignments.length">{{ filteredAssignments.length }} od {{ assignments.length }} zadataka · </TablePagination>
	</template>
</template>
