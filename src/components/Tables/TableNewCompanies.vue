<script setup>
import { computed, ref, onMounted, watch, reactive } from "vue";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import { mainStore, adminStore, snackBarStore } from "@/main.js";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import CardBoxModal from "../Cardbox/CardBoxModal.vue";
import { mdiContentSaveCheckOutline } from "@mdi/js";
import FormControl from "../Form/FormControl.vue";
import { useVuelidate } from "@vuelidate/core";
import { useRoute } from "vue-router";
import Utils from "@/helpers/utils";

import { required, helpers, numeric } from "@vuelidate/validators";

import { getFirstErrorForField } from "@/helpers/validators";

defineProps({
	checkable: Boolean,
});

const newCompanies = ref([]);

const rules = {
	web: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	direktor: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	maticni_broj: {
		required: helpers.withMessage("Polje je obavezno", required),
		numeric: helpers.withMessage("Polje smije sadržavati samo brojeve", numeric),
	},
	OIB: {
		required: helpers.withMessage("Polje je obavezno", required),
		numeric: helpers.withMessage("Polje smije sadržavati samo brojeve", numeric),
	},
	adresa: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
};

let company_highlight = ref("");
const route = useRoute();

async function loadData() {
	const naziv = route.params.naziv;
	if (naziv) {
		company_highlight.value = naziv;
	}
}

watch(() => route.params.naziv, loadData, {
	immediate: true,
});

const companyForms = ref({});

onMounted(async () => {
	let results = await mainStore.fetchCompanies();
	const filteredCompanies = results.filter((company) => {
		return (company.web === "" || company.web === null) && (company.OIB === "" || company.OIB === null) && (company.adresa === "" || company.adresa === null) && (company.maticni_broj === "" || company.maticni_broj === null) && (company.direktor === "" || company.direktor === null);
	});
	if (Utils.isArrayEmpty(filteredCompanies)) {
		snackBarStore.pushMessage("Nema novih poduzeća", "info");
		adminStore.newCompaniesFound = false;
	} else {
		snackBarStore.pushMessage("Pronađena su nova poduzeća, molimo ažurirajte podatke", "info");
		adminStore.newCompaniesFound = true;
	}
	for (const company of filteredCompanies) {
		companyForms.value[company.id] = {
			naziv: company.naziv,
			web: company.web,
			direktor: company.direktor || "",
			maticni_broj: company.maticni_broj || "",
			OIB: company.OIB || "",
			adresa: company.adresa || "",
		};
	}
	newCompanies.value = filteredCompanies;
});
const companiesValidationState = reactive({});

const computedCompanyForms = computed(() => {
	const forms = {};
	for (const company of newCompanies.value) {
		forms[company.id] = companyForms.value[company.id];
	}
	return forms;
});

const initializeValidationState = () => {
	for (const company of newCompanies.value) {
		companiesValidationState[company.id] = rules;
	}
};

onMounted(initializeValidationState);

watch(newCompanies, initializeValidationState);

const v$ = useVuelidate(companiesValidationState, computedCompanyForms);

const isLoading = ref(false);

const selectedCompany = ref(null);
const confirmationModal = ref({
	isActive: false,
});

function previewCompany(companyId) {
	selectedCompany.value = companyId;
	confirmationModal.value.isActive = true;
}

function confirmTaskAction() {
	saveUpdatedCompany();
	confirmationModal.value.isActive = false;
}

async function saveUpdatedCompany() {
	isLoading.value = true;

	const validationResult = await v$.value.$validate();

	if (!validationResult) {
		isLoading.value = false;
		return;
	}

	const postData = companyForms.value[selectedCompany.value];
	let result = adminStore.saveUpdatedCompany(postData);

	if (result) {
		snackBarStore.pushMessage("Podaci su uspješno ažurirani", "success");
		await Utils.wait(1);
		location.reload();
	} else {
		snackBarStore.pushMessage("Podaci nisu ažurirani", "error");
	}
}

const perPage = ref(5);
const currentPage = ref(0);
const companiesPaginated = computed(() => newCompanies.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1)));

const numPages = computed(() => Math.ceil(newCompanies.value.length / perPage.value));
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
	<table v-if="adminStore.newCompaniesFound" style="table-layout: fixed; width: 100%">
		<thead>
			<tr>
				<th style="width: 80px" />
				<th style="width: 18%">Naziv</th>
				<th style="width: 20%">Web mjesto</th>
				<th style="width: 15%">Direktor</th>
				<th style="width: 12%">Matični broj</th>
				<th style="width: 12%">OIB</th>
				<th style="width: 18%">Adresa</th>

				<th style="width: 80px" />
			</tr>
		</thead>

		<tbody>
			<tr
				v-for="company in companiesPaginated"
				:key="company['naziv']"
				:class="{
					'selected-row': company_highlight === company['naziv'],
				}">
				<TableCheckboxCell v-if="checkable" :assignment-data="company" />

				<td v-if="company['logo'][0]" class="border-b-0 before:hidden lg:w-6">
					<UserAvatar :avatar="company['logo'][0]['url']" class="mx-auto h-24 w-24 lg:h-6 lg:w-6" />
				</td>

				<td v-else>
					<UserAvatar avatar="No-Logo.png" class="mx-auto h-24 w-24 lg:h-6 lg:w-6" />
				</td>

				<td data-label="Naziv">
					<FormControl v-model="companyForms[company.id].naziv" readonly></FormControl>
				</td>

				<td data-label="Web mjesto">
					<FormControl v-model="companyForms[company.id].web" :error="getFirstErrorForField(v$, 'web')"></FormControl>
				</td>

				<td data-label="Direktor">
					<FormControl v-model="companyForms[company.id].direktor" :error="getFirstErrorForField(v$, 'direktor')"></FormControl>
				</td>

				<td data-label="Matični broj">
					<FormControl v-model="companyForms[company.id].maticni_broj" :error="getFirstErrorForField(v$, 'maticni_broj')"></FormControl>
				</td>

				<td data-label="OIB">
					<FormControl v-model="companyForms[company.id].OIB" :error="getFirstErrorForField(v$, 'OIB')"></FormControl>
				</td>

				<td data-label="Adresa">
					<FormControl v-model="companyForms[company.id].adresa" :error="getFirstErrorForField(v$, 'adresa')"></FormControl>
				</td>

				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiContentSaveCheckOutline" small @click="previewCompany(company.id)" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>

	<CardBoxModal v-model="confirmationModal.isActive" title="Potvrda akcije" button-label="Ažuriraj" has-cancel @confirm="confirmTaskAction">
		<div class="mb-4">
			<div v-if="selectedCompany">
				<strong>Naziv:</strong> {{ companyForms[selectedCompany].naziv }}<br />
				<strong>Web mjesto:</strong> {{ companyForms[selectedCompany].web }}<br />
				<strong>Direktor:</strong> {{ companyForms[selectedCompany].direktor }}<br />
				<strong>Matični broj:</strong>
				{{ companyForms[selectedCompany].maticni_broj }}<br />
				<strong>OIB:</strong> {{ companyForms[selectedCompany].OIB }}<br />
				<strong>Adresa:</strong> {{ companyForms[selectedCompany].adresa }}<br />
			</div>
			<br />
			<hr />
			Molimo provjerite unos te nakon toga potvrdite.
		</div>
	</CardBoxModal>

	<div class="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
		<BaseLevel>
			<BaseButtons>
				<BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1" :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
			</BaseButtons>
			<small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
		</BaseLevel>
	</div>
</template>
