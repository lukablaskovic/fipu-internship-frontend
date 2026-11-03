<script setup>
import TableCellText from "@/components/Tables/TableCellText.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TablePagination from "@/components/Tables/TablePagination.vue";
import { usePagination } from "@/composables/usePagination.js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { filterByCompany, normalizeString } from "@/helpers/search-utils.js";
import { computed, ref, onMounted, watch } from "vue";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { DEFAULT_COMPANY_LOGO, getCompanyLogoUrl } from "@/helpers/company-logo.js";
import LoadingOverlay from "../LoadingOverlay.vue";
import { mdiMagnify, mdiWeb } from "@mdi/js";

import { useRoute, useRouter } from "vue-router";
import { useMainStore } from "@/stores/main_store";

const mainStore = useMainStore();


defineProps({
	checkable: Boolean,
});

const allCompanies = ref([]);
const route = useRoute();
const router = useRouter();
const searchQuery = computed({
	get: () => typeof route.query.p === "string" ? route.query.p : "",
	set: (value) => router.replace({ query: { ...route.query, p: value || undefined } }),
});

const filteredCompanies = computed(() => {
	return filterByCompany(allCompanies.value.filter((company) => {
		return company["OIB"] && company["maticni_broj"];
	}), normalizeString(searchQuery.value));
});

const { perPage, currentPage, itemsPaginated: companiesPaginated } = usePagination(filteredCompanies);
watch(searchQuery, () => { currentPage.value = 0; });

const dataLoaded = ref(false);

let company_highlight = ref("");

async function loadData() {
	const naziv = route.params.naziv;

	let response = await mainStore.fetchCompanies();
	allCompanies.value = response;
	dataLoaded.value = true;

	if (naziv) {
		company_highlight.value = naziv;
		currentPage.value = getAssignmentPage(naziv);
	}
}

function getAssignmentPage(naziv) {
	const index = filteredCompanies.value.findIndex((company) => company["naziv"] === naziv);
	if (index === -1) return 0;
	return Math.floor(index / perPage.value);
}

watch(() => route.params.naziv, loadData, {
	immediate: true,
});

onMounted(async () => {
	let response = await mainStore.fetchCompanies();
	allCompanies.value = response;
	dataLoaded.value = true;
});

const goToCompanyWeb = (url) => {
	window.open(url, "_blank");
};
</script>

<template>
	<LoadingOverlay :is-active="!dataLoaded" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>
	<div class="table-filter-bar p-3 lg:px-6">
		<div class="relative w-full">
			<BaseIcon :path="mdiMagnify" :size="20" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400" aria-hidden="true" />
			<input v-model="searchQuery" type="search" aria-label="Pretraži poslodavce" placeholder="Pretraži poslodavce po nazivu…" class="table-filter-search w-full pl-10" />
		</div>
	</div>
	<table v-if="filteredCompanies.length || !dataLoaded" class="compact-table w-full table-fixed">
		<thead>
			<tr v-if="!mainStore.userAdmin">
				<th style="width: 80px" />
				<th style="width: 25%">Naziv</th>
				<th style="width: 30%">Web mjesto</th>
				<th style="width: 30%">Adresa</th>
				<th style="width: 80px" />
			</tr>
			<tr v-else>
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
		<tbody v-if="!mainStore.userAdmin">
			<tr v-for="company in companiesPaginated" :key="company['naziv']">
				<TableCheckboxCell v-if="checkable" class="compact-check" :assignment-data="company" />

				<td class="compact-logo border-b-0 before:hidden lg:w-6 lg:text-center">
						<UserAvatar :avatar="getCompanyLogoUrl(company) || DEFAULT_COMPANY_LOGO" :username="company.naziv" class="mx-auto h-8 w-8 lg:h-6 lg:w-6" />
					</td>

				<td data-label="Naziv" class="compact-title">
					<div class="min-w-0 break-words">
						<TableCellText :value="company['naziv']" />
					</div>
				</td>

				<td data-label="Web">
					<div class="min-w-0 break-words">
						<TableCellText :value="company['web']"><a class="underline" :href="company['web']" target="_blank">{{ company["web"] }}</a></TableCellText>
					</div>
				</td>

				<td data-label="Adresa">
					<div class="min-w-0 break-words">
						<TableCellText :value="company['adresa']" />
					</div>
				</td>

				<td class="compact-actions whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-center" class="w-full" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiWeb" :aria-label="`Otvori web mjesto: ${company.naziv}`" small @click="goToCompanyWeb(company['web'])" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
		<tbody v-else>
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
					<div class="min-w-0 break-words">
						<TableCellText :value="company['naziv']" />
					</div>
				</td>
				<td data-label="Web">
					<div class="min-w-0 break-words">
						<TableCellText :value="company['web']"><a class="underline" :href="company['web']" target="_blank">{{ company["web"] }}</a></TableCellText>
					</div>
				</td>
				<td data-label="Direktor">
					<div class="min-w-0 break-words">
						<TableCellText :value="company['direktor']" />
					</div>
				</td>

				<td data-label="Matični broj">
					<div class="min-w-0 break-words">
						<TableCellText :value="company['maticni_broj']" />
					</div>
				</td>

				<td data-label="OIB">
					<div class="min-w-0 break-words">
						<TableCellText :value="company['OIB']" />
					</div>
				</td>

				<td data-label="Adresa">
					<div class="min-w-0 break-words">
						<TableCellText :value="company['adresa']" />
					</div>
				</td>

				<td class="compact-actions whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-center" class="w-full" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiWeb" :aria-label="`Otvori web mjesto: ${company.naziv}`" small @click="goToCompanyWeb(company['web'])" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>
	<CardBoxComponentEmpty v-if="!filteredCompanies.length && dataLoaded" />

	<TablePagination v-model:page="currentPage" v-model:per-page="perPage" :total="filteredCompanies.length" class="mb-12" />
</template>
