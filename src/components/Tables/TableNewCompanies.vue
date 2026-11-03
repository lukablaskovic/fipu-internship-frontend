<script setup>
import TableCellText from "@/components/Tables/TableCellText.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TablePagination from "@/components/Tables/TablePagination.vue";
import { usePagination } from "@/composables/usePagination.js";
import { computed, ref, onMounted, watch, reactive } from "vue";
import { FieldRoot, FieldLabel } from "reka-ui";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import { useMainStore } from "@/stores/main_store";
import { useAdminStore } from "@/stores/admin_store";
import { useSnackBarStore } from "@/stores/snackbar_store";

import BaseButtons from "@/components/Base/BaseButtons.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { DEFAULT_COMPANY_LOGO, getCompanyLogoUrl } from "@/helpers/company-logo.js";
import BaseButton from "@/components/Base/BaseButton.vue";
import CardBoxModal from "../Cardbox/CardBoxModal.vue";
import { mdiContentSaveCheckOutline } from "@mdi/js";
import FormControl from "../Form/FormControl.vue";
import { useVuelidate } from "@vuelidate/core";
import { useRoute } from "vue-router";
import Utils from "@/helpers/utils";

import { required, helpers, numeric } from "@vuelidate/validators";

import { getFirstErrorForField } from "@/helpers/validators";

const mainStore = useMainStore();
const adminStore = useAdminStore();
const snackBarStore = useSnackBarStore();

defineProps({
	checkable: Boolean,
});

const newCompanies = ref([]);

const editableFields = [
	{ key: "web", label: "Web mjesto" },
	{ key: "direktor", label: "Direktor" },
	{ key: "maticni_broj", label: "Matični broj" },
	{ key: "OIB", label: "OIB" },
	{ key: "adresa", label: "Adresa" },
];

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

async function refreshCompanies(notify = false) {
	let results = await mainStore.fetchCompanies("", true);
	const filteredCompanies = results.filter((company) => {
		return (
			(company.web === "" || company.web === null) &&
			(company.OIB === "" || company.OIB === null) &&
			(company.adresa === "" || company.adresa === null) &&
			(company.maticni_broj === "" || company.maticni_broj === null) &&
			(company.direktor === "" || company.direktor === null)
		);
	});
	if (Utils.isArrayEmpty(filteredCompanies)) {
		if (notify) snackBarStore.pushMessage("Nema novih poduzeća", "info");
		adminStore.newCompaniesFound = false;
	} else {
		if (notify) snackBarStore.pushMessage("Pronađena su nova poduzeća, molimo ažurirajte podatke", "info");
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
	mainStore.allCompanies = results;
}

onMounted(() => refreshCompanies(true));
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

async function confirmTaskAction() {
	await saveUpdatedCompany();
}

async function saveUpdatedCompany() {
	if (isLoading.value) return;
	isLoading.value = true;
	let saved = false;
	try {
		if (!(await v$.value.$validate())) return;
		const postData = companyForms.value[selectedCompany.value];
		const result = await adminStore.saveUpdatedCompany(postData);
		if (!result) throw new Error("Company update failed");
		saved = true;
		confirmationModal.value.isActive = false;
		snackBarStore.pushMessage("Podaci su uspješno ažurirani", "success");
		await refreshCompanies();
	} catch (error) {
		snackBarStore.pushMessage(saved ? "Podaci su spremljeni, ali popis poduzeća nije osvježen. Pokušajte ponovno otvoriti popis." : "Podaci nisu ažurirani. Molimo pokušajte ponovno.", "danger");
	} finally {
		isLoading.value = false;
	}
}

const { perPage, currentPage, itemsPaginated: companiesPaginated } = usePagination(newCompanies, 5);
</script>

<template>
	<table v-if="newCompanies.length" class="compact-table w-full table-fixed">
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
				<TableCheckboxCell v-if="checkable" class="compact-check" :assignment-data="company" />

				<td class="compact-logo border-b-0 before:hidden lg:w-6 lg:text-center">
						<UserAvatar :avatar="getCompanyLogoUrl(company) || DEFAULT_COMPANY_LOGO" :username="company.naziv" class="mx-auto h-8 w-8 lg:h-6 lg:w-6" />
					</td>

				<td data-label="Naziv" class="compact-title">
					<FieldRoot>
						<FieldLabel as="div" :native-label="false" class="sr-only">Naziv</FieldLabel>
						<TableCellText :value="companyForms[company.id].naziv" />
					</FieldRoot>
				</td>

				<td v-for="field in editableFields" :key="field.key" :data-label="field.label">
						<FieldRoot class="min-w-0" :invalid="!!getFirstErrorForField(v$[company.id], field.key)">
							<FieldLabel as="div" :native-label="false" class="sr-only">{{ field.label }}</FieldLabel>
							<FormControl v-model="companyForms[company.id][field.key]" :error="getFirstErrorForField(v$[company.id], field.key)" />
						</FieldRoot>
					</td>

				<td class="compact-actions whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton :disabled="isLoading" color="fipu_blue" :icon="mdiContentSaveCheckOutline" :aria-label="`Spremi podatke: ${company.naziv}`" small @click="previewCompany(company.id)" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>
	<CardBoxComponentEmpty v-if="!newCompanies.length" />

	<CardBoxModal v-model="confirmationModal.isActive" :disabled-condition="isLoading" title="Potvrda akcije" button-label="Ažuriraj" has-cancel @confirm="confirmTaskAction">
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

	<TablePagination v-model:page="currentPage" v-model:per-page="perPage" :total="newCompanies.length" :show-per-page="false" />
</template>
