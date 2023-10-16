<script setup>
import { computed, ref, onMounted } from "vue";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { mainStore, studentStore, adminStore } from "@/main.js";
import { StudentMappings } from "@/helpers/maps";
import PillTag from "../PillTag/PillTag.vue";
defineProps({
	checkable: Boolean,
});

const allocations = ref([]);
let dataLoaded = ref(false);

onMounted(async () => {
	dataLoaded.value = false;

	allocations.value = await studentStore.getAllocationsPublic();
	dataLoaded.value = true;
});

const filteredAllocations = computed(() => {
	return allocations.value.filter((allocation) => allocation["Alocirani_zadatak"] !== null);
});

function getIdDnevnikPrakseByIdAlokacija(id_alokacija) {
	const student = adminStore.students.find((stud) => stud.process_instance_data.variables.id_alokacija == id_alokacija);
	return student ? student.process_instance_data.variables.id_dnevnik_prakse : null;
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

const perPage = ref(5);
const currentPage = ref(0);
const allocationsPaginated = computed(() => filteredAllocations.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1)));

const numPages = computed(() => Math.ceil(allocations.value.length / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
	const pagesList = [];

	for (let i = 0; i < numPages.value; i++) {
		pagesList.push(i);
	}

	return pagesList;
});
</script>

<template>
	<LoadingOverlay :is-active="!allocations.length && !dataLoaded" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>
	<table>
		<thead>
			<tr>
				<th>JMBAG</th>
				<th>Alocirani zadatak</th>
				<th>Opis zadatka</th>
				<th>Poduzeće kontakt</th>
				<th v-if="mainStore.userAdmin">Status zahtjeva</th>
				<th>Prijavnica ispunjena</th>
				<th>Dnevnik prakse predan</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="allocation in allocationsPaginated" :key="allocation['id_alokacija']">
				<TableCheckboxCell v-if="checkable" :assignment-data="company" />

				<td data-label="JMBAG">
					{{ allocation["JMBAG"] }}
				</td>
				<td data-label="Alocirani zadatak" class="underline hover:text-fipu_blue">
					<router-link :to="`/dostupni-zadaci/${allocation['Alocirani_zadatak']}`">{{ allocation["Alocirani_zadatak"] }}</router-link>
				</td>
				<td data-label="Opis zadatka">
					{{ allocation["opis_zadatka"] }}
				</td>

				<td data-label="Kontakt">
					{{ allocation["poslodavac_email"] }}
				</td>
				<td v-if="mainStore.userAdmin" data-label="Status zahtjeva">
					<PillTag :label="StudentMappings.getStatusProperty(allocation['status_zahtjeva']['value'], 'label')" :color="StudentMappings.getStatusProperty(allocation['status_zahtjeva']['value'], 'color')"></PillTag>
				</td>
				<td data-label="Prijavnica ispunjena">
					<div class="flex items-center">
						<TableCheckboxCell readonly :value="allocation['popunjena_prijavnica']" />
						<a v-if="allocation['popunjena_prijavnica'] && mainStore.userAdmin" class="text-sm underline cursor-pointer hover:text-fipu_light_blue ml-8" @click="adminStore.openPDFModal(allocation, 'Potvrda', 'source_url_for_potvrda')"> Otvori praznu potvrdu📜 </a>
					</div>
				</td>
				<td data-label="Dnevnik prakse predan">
					<div class="flex items-center">
						<TableCheckboxCell readonly :value="allocation[(allocation, 'predan_dnevnik_prakse')]" />
						<p v-if="allocation['predan_dnevnik_prakse'] && mainStore.userAdmin" class="text-sm underline cursor-pointer hover:text-fipu_light_blue ml-8" @click="fetchPDF('potvrda', getIdDnevnikPrakseByIdAlokacija(allocation['id_alokacija']))">Otvori potvrdu📃</p>
						<p v-if="allocation['predan_dnevnik_prakse'] && mainStore.userAdmin" class="text-sm underline cursor-pointer hover:text-fipu_light_blue ml-8" @click="fetchPDF('dnevnik', getIdDnevnikPrakseByIdAlokacija(allocation['id_alokacija']))">Otvori dnevnik📓</p>
					</div>
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
