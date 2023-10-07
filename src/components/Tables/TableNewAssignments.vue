<script setup>
import { computed, ref, onMounted, watch } from "vue";

import { mdiEye, mdiCheckCircle, mdiCloseBox } from "@mdi/js";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { mainStore, guestStore, adminStore, snackBarStore } from "@/main.js";
import { useRouter, useRoute } from "vue-router";

import Utils from "@/helpers/utils.js";

defineProps({
	checkable: Boolean,
});

const MAX_NUM_ASSIGNMENTS = 3;

const isModalActive = ref(null);
const allAvailableAssignments = ref([]);

let checkedAssignments = computed(() => guestStore.checkedAssignments);
let assignment_highlight = ref("");
const router = useRouter();
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
	const result = await guestStore.fetchAvailableAssignments();
	allAvailableAssignments.value = result.filter((task) => task.dostupno_mjesta > 0 && task.voditelj_odobrio.value == "u razradi");
	adminStore.newAssignments = allAvailableAssignments.value;
	guestStore.resetAssignments();
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
		guestStore.addAssignment(assignment);
	} else {
		guestStore.removeAssignment(assignment);
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
	<CardBoxModal v-if="isModalActive" v-model="isModalActive" :title="'📃' + isModalActive['id_zadatak']" button-label="Zatvori" button="fipu_blue" has-cancel:false @cancel="mainStore.activateLogoutModal(false)">
		<hr />
		<div><b>Poslodavac: </b>{{ isModalActive["Poslodavac"][0].value }}</div>

		<div><b>Zadatak studenta:</b> {{ isModalActive["opis_zadatka"] }}</div>
		<div><b>Broj studenata (max):</b> {{ isModalActive["broj_studenata"] }}</div>

		<div>
			<b>Preferirane tehnologije:</b>
			{{ isModalActive["preferirane_tehnologije"] }}
		</div>

		<div>
			<b>Preferencije za studenta: </b>
			{{ isModalActive["preferencije_za_studenta"] }}
		</div>

		<div>
			<b>Potrebno imati: </b>
			{{ isModalActive["potrebno_imati"] }}
		</div>
		<div>
			<b>Trajanje (sati): </b>
			{{ isModalActive["trajanje_sati"] }}
		</div>

		<div>
			<b>Željeno okvirno vrijeme početka: </b>
			{{ isModalActive["zeljeno_okvirno_vrijeme_pocetka"] }}
		</div>
		<div>
			<b>Angažman FIPU: </b>
			{{ isModalActive["angazman_fipu"] }}
		</div>
		<div>
			<b>Kontakt email: </b>
			<span class="underline">{{ isModalActive["poslodavac_email"] }}</span>
		</div>
		<div><b>Lokacija: </b>{{ isModalActive["lokacija"] }}</div>
		<div>
			<b>Napomena</b>
			{{ isModalActive["napomena"] }}
		</div>
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

	<table>
		<thead>
			<tr>
				<th v-if="checkable"></th>

				<th>ID Zadatka</th>
				<th>Kontakt email</th>
				<th>Preferirane tehnologije</th>
				<th>Trajanje (sati)</th>
				<th>Lokacija</th>
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

				<td class="before:hidden lg:w-1 whitespace-nowrap">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiEye" small @click="isModalActive = assignment" />
					</BaseButtons>
				</td>
				<td class="before:hidden lg:w-1 whitespace-nowrap">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="success" :icon="mdiCheckCircle" small @click="handleConfirmation('accept', assignment)" />
					</BaseButtons>
				</td>
				<td class="before:hidden lg:w-1 whitespace-nowrap">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="danger" :icon="mdiCloseBox" small @click="handleConfirmation('decline', assignment)" />
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
