<script setup>
import { computed, ref, onMounted, watch } from "vue";

import { mdiWeb } from "@mdi/js";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { mainStore } from "@/main.js";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useRoute } from "vue-router";

defineProps({
	checkable: Boolean,
});

const perPage = ref(5);
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

	let result = await mainStore.fetchCompanies();
	allCompanies.value = result.data.results;

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

watch(() => route.params.naziv, loadData, {
	immediate: true,
});

onMounted(async () => {
	let result = await mainStore.fetchCompanies();
	allCompanies.value = result.data.results;
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

				<td v-if="company['logo'][0]" class="border-b-0 lg:w-6 before:hidden">
					<UserAvatar :avatar="company['logo'][0]['url']" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
				</td>
				<td v-else>
					<UserAvatar avatar="No-Logo.png" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
				</td>

				<td data-label="Naziv">
					{{ company["naziv"] }}
				</td>
				<td data-label="Web mjesto">
					<a class="underline" :href="company['web']" target="_blank">{{ company["web"] }}</a>
				</td>

				<td class="before:hidden lg:w-1 whitespace-nowrap">
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

				<td v-if="company['logo'][0]" class="border-b-0 lg:w-6 before:hidden">
					<UserAvatar :avatar="company['logo'][0]['url']" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
				</td>
				<td v-else>
					<UserAvatar avatar="No-Logo.png" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
				</td>

				<td data-label="Naziv">
					{{ company["naziv"] }}
				</td>
				<td data-label="Web mjesto">
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

				<td class="before:hidden lg:w-1 whitespace-nowrap">
					<BaseButtons type="justify-start lg:justify-end" no-wrap>
						<BaseButton color="fipu_blue" :icon="mdiWeb" small @click="goToCompanyWeb(company['web'])" />
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
