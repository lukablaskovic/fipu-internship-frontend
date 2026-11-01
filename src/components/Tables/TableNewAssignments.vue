<script setup>
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import BasePagination from "@/components/Base/BasePagination.vue";
import { computed, ref, onMounted, watch } from "vue";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import CardBoxAllocation from "../Cardbox/CardBoxAllocation.vue";
import { mainStore, adminStore, snackBarStore } from "@/main.js";
import { mdiEye, mdiCheckCircle, mdiCloseBox } from "@mdi/js";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";

import { useRoute } from "vue-router";

import Utils from "@/helpers/utils.js";

defineProps({
	checkable: Boolean,
});

const MAX_NUM_ASSIGNMENTS = 3;

const isModalActive = ref(null);
const assignmentLimitActive = ref(false);
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
	allAvailableAssignments.value = result.filter((task) => task.dostupno_mjesta > 0 && task.voditelj_odobrio.value == "u razradi");

	if (Utils.isArrayEmpty(allAvailableAssignments.value)) {
		snackBarStore.pushMessage("Nema novih zadataka", "info");
		adminStore.newAssignmentsFound = false;
	} else {
		snackBarStore.pushMessage("Pronađeni su novi zadaci, molimo da ih pregledate", "info");
		adminStore.newAssignmentsFound = true;
	}

	adminStore.newAssignments = allAvailableAssignments.value;
	mainStore.resetAssignments();
});

const perPage = ref(5);
const currentPage = ref(0);
const assignmentsPaginated = computed(() => allAvailableAssignments.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1)));

const numPages = computed(() => Math.ceil(allAvailableAssignments.value.length / perPage.value));
const currentPageHuman = computed(() => numPages.value ? currentPage.value + 1 : 0);


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
			assignmentLimitActive.value = true;
			assignmentCheckedStates[assignment["id_zadatak"]] = false;
			return;
		}
		mainStore.addAssignment(assignment);
	} else {
		mainStore.removeAssignment(assignment);
	}
};
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

const confirmTaskAction = async () => {
	const actionStr = confirmationModal.value.action === "accept" ? "odobreno" : "odbijeno";
	let result = adminStore.handleTask(confirmationModal.value.assignment["id_zadatak"], actionStr);
	if (result) {
		snackBarStore.pushMessage("Ažurirano stanje zadatka", "success");
		await Utils.wait(0.5);
		location.reload();
	}
	confirmationModal.value.isActive = false;
};

const cancelTaskAction = () => {
	confirmationModal.value.isActive = false;
};
</script>

<template>
	<CardBoxModal v-model="assignmentLimitActive" title="Možete odabrati najviše 3 zadatka." button-label="U redu" />

	<CardBoxModal v-if="isModalActive" v-model="isModalActive" large button-label="Zatvori" button="fipu_blue" has-cancel:false @cancel="mainStore.activateLogoutModal(false)">
		<CardBoxAllocation :data="isModalActive"></CardBoxAllocation>

		<br />
	</CardBoxModal>

	<CardBoxModal v-model="confirmationModal.isActive" title="Potvrda akcije" :button-label="confirmationModal.action === 'accept' ? 'Prihvati' : 'Odbij'" has-cancel @cancel="cancelTaskAction" @confirm="confirmTaskAction">
		<div v-if="confirmationModal.action === 'accept'" class="mb-4">
			Jeste li sigurni da želite prihvatiti zadatak -
			<b>{{ confirmationModal.assignment["id_zadatak"] }}</b> ?
		</div>
		<div v-else class="mb-4">
			Jeste li sigurni da želite odbiti zadatak -
			<b>{{ confirmationModal.assignment["id_zadatak"] }}</b> ?
		</div>
	</CardBoxModal>

	<table v-if="allAvailableAssignments.length">
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
				<th />
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

				<td data-label="Max. Broj studenata">
					{{ assignment["broj_studenata"] }}
				</td>

				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiEye" small @click="isModalActive = assignment" />
					</BaseButtons>
				</td>
				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="success" :icon="mdiCheckCircle" small @click="handleConfirmation('accept', assignment)" />
					</BaseButtons>
				</td>
				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="danger" :icon="mdiCloseBox" small @click="handleConfirmation('decline', assignment)" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>
	<CardBoxComponentEmpty v-if="!allAvailableAssignments.length" />

	<div v-if="allAvailableAssignments.length" class="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
		<BaseLevel>
			<div class="flex flex-wrap items-center justify-center gap-3">
				<BasePagination :page="currentPage + 1" :total="allAvailableAssignments.length" :items-per-page="perPage" @update:page="currentPage = $event - 1" />
			</div>
			<small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
		</BaseLevel>
	</div>
</template>
