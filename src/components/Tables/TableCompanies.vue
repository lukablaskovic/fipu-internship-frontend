<script setup>
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

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
	const pagesList = [];

	for (let i = 0; i < numPages.value; i++) {
		pagesList.push(i);
	}

	return pagesList;
});

const allCompanies = ref([]);

let company_highlight = ref("");
const route = useRoute();

async function loadData() {
	const naziv = route.params.naziv;

	let response = await mainStore.fetchCompanies();
	allCompanies.value = response;

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
});

const goToCompanyWeb = (url) => {
	window.open(url, "_blank");
};
</script>

<template>
	<LoadingOverlay :is-active="!allCompanies.length" title="Učitavanje..." description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."> </LoadingOverlay>
	<table>
		<thead>
			<tr v-if="!mainStore.userAdmin">
				<th />
				<th>Naziv</th>
				<th>Web mjesto</th>
				<th />
			</tr>
			<tr v-else>
				<th />
				<th>Naziv</th>
				<th>Web mjesto</th>
				<th>Direktor</th>
				<th>Matični broj</th>
				<th>OIB</th>
				<th>Adresa</th>

				<th />
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
					{{ company["naziv"] }}
				</td>

				<td data-label="Web" class="max-w-xs whitespace-normal break-all">
					<a class="underline" :href="company['web']" target="_blank">{{ company["web"] }}</a>
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
					{{ company["naziv"] }}
				</td>
				<td data-label="Web" class="max-w-xs whitespace-normal break-all">
					<a class="underline" :href="company['web']" target="_blank">{{ company["web"] }}</a>
				</td>
				<td data-label="Direktor">
					{{ company["direktor"] }}
				</td>

				<td data-label="Matični broj">
					{{ company["maticni_broj"] }}
				</td>

				<td data-label="OIB">
					{{ company["OIB"] }}
				</td>

				<td data-label="Adresa">
					{{ company["adresa"] }}
				</td>

				<td class="whitespace-nowrap before:hidden lg:w-1">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiWeb" small @click="goToCompanyWeb(company['web'])" />
					</BaseButtons>
				</td>
			</tr>
		</tbody>
	</table>

	<div class="mb-12 border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
		<BaseLevel>
			<BaseButtons>
				<ButtonMenu :options="tableButtonMenuOptions" :icon="mdiMenuDown" small left @update:modelValue="handlePerPageChange" />

				<BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1" :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
			</BaseButtons>

			<small class=""> Stranica {{ currentPageHuman }} od {{ numPages }}</small>
		</BaseLevel>
	</div>
</template>
