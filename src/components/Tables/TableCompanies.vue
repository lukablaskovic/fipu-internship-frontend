<script setup>
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import BasePagination from "@/components/Base/BasePagination.vue";
import { computed, ref, onMounted, watch } from "vue";

import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import { tableButtonMenuOptions } from "@/tableButtonMenuOptions.js";
import ButtonMenu from "@/components/Premium/ButtonMenu.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { mdiWeb, mdiMenuDown } from "@mdi/js";

import { useRoute } from "vue-router";
import { mainStore } from "@/main.js";

defineProps({
	checkable: Boolean,
});

const perPage = ref(10);
const currentPage = ref(0);

const filteredCompanies = computed(() => {
	return allCompanies.value.filter((company) => {
		return company["OIB"] && company["maticni_broj"];
	});
});

const companiesPaginated = computed(() => {
	return filteredCompanies.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1));
});

const numPages = computed(() => {
	return Math.ceil(filteredCompanies.value.length / perPage.value);
});

const currentPageHuman = computed(() => numPages.value ? currentPage.value + 1 : 0);


const allCompanies = ref([]);
const dataLoaded = ref(false);

let company_highlight = ref("");
const route = useRoute();

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
	const index = allCompanies.value.findIndex((assignment) => assignment["naziv"] === naziv);
	if (index === -1) return 0;
	return Math.floor(index / perPage.value);
}

function handlePerPageChange(option) {
	perPage.value = option.value;
	currentPage.value = 0;
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
	<table v-if="filteredCompanies.length || !dataLoaded" style="table-layout: fixed; width: 100%">
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
				<TableCheckboxCell v-if="checkable" :assignment-data="company" />

				<td v-if="company['logo'][0]" class="border-b-0 before:hidden lg:w-6">
					<UserAvatar :avatar="company['logo'][0]['url']" class="mx-auto h-24 w-24 lg:h-6 lg:w-6" />
				</td>
				<td v-else>
					<UserAvatar avatar="No-Logo.png" class="mx-auto h-24 w-24 lg:h-6 lg:w-6" />
				</td>

				<td data-label="Naziv">
					<div class="overflow-x-auto whitespace-nowrap">
						{{ company["naziv"] }}
					</div>
				</td>

				<td data-label="Web">
					<div class="overflow-x-auto whitespace-nowrap">
						<a class="underline" :href="company['web']" target="_blank">{{ company["web"] }}</a>
					</div>
				</td>

				<td data-label="Adresa">
					<div class="overflow-x-auto whitespace-nowrap">
						{{ company["adresa"] }}
					</div>
				</td>

				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiWeb" small @click="goToCompanyWeb(company['web'])" />
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
				<TableCheckboxCell v-if="checkable" :assignment-data="company" />

				<td v-if="company['logo'][0]" class="border-b-0 before:hidden lg:w-6">
					<UserAvatar :avatar="company['logo'][0]['url']" class="mx-auto h-24 w-24 lg:h-6 lg:w-6" />
				</td>
				<td v-else>
					<UserAvatar avatar="No-Logo.png" class="mx-auto h-24 w-24 lg:h-6 lg:w-6" />
				</td>

				<td data-label="Naziv">
					<div class="overflow-x-auto whitespace-nowrap">
						{{ company["naziv"] }}
					</div>
				</td>
				<td data-label="Web">
					<div class="overflow-x-auto whitespace-nowrap">
						<a class="underline" :href="company['web']" target="_blank">{{ company["web"] }}</a>
					</div>
				</td>
				<td data-label="Direktor">
					<div class="overflow-x-auto whitespace-nowrap">
						{{ company["direktor"] }}
					</div>
				</td>

				<td data-label="Matični broj">
					<div class="overflow-x-auto whitespace-nowrap">
						{{ company["maticni_broj"] }}
					</div>
				</td>

				<td data-label="OIB">
					<div class="overflow-x-auto whitespace-nowrap">
						{{ company["OIB"] }}
					</div>
				</td>

				<td data-label="Adresa">
					<div class="overflow-x-auto whitespace-nowrap">
						{{ company["adresa"] }}
					</div>
				</td>

				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiWeb" small @click="goToCompanyWeb(company['web'])" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>
	<CardBoxComponentEmpty v-if="!filteredCompanies.length && dataLoaded" />

	<div v-if="filteredCompanies.length" class="mb-12 border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
		<BaseLevel>
			<div class="flex flex-wrap items-center justify-center gap-3">
				<ButtonMenu class="pagination-page-size" :options="tableButtonMenuOptions" :icon="mdiMenuDown" small left @update:model-value="handlePerPageChange" />

				<BasePagination :page="currentPage + 1" :total="filteredCompanies.length" :items-per-page="perPage" @update:page="currentPage = $event - 1" />
			</div>

			<small class=""> Stranica {{ currentPageHuman }} od {{ numPages }}</small>
		</BaseLevel>
	</div>
</template>
