<script setup>
import { computed, ref } from "vue";
import { mainStore, adminStore } from "@/main.js";
import { mdiDomain, mdiDomainPlus, mdiLaptop } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import TableCompanies from "@/components/Tables/TableCompanies.vue";
import TableNewCompanies from "@/components/Tables/TableNewCompanies.vue";
import { router } from "@/router";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";

const userAuthenticated = computed(() => mainStore.userAuthenticated);
const userAdmin = computed(() => mainStore.userAdmin);
const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const addNewAssignmentLink = ref(`${VITE_FRONTEND_URL}/poslodavci/novi-zadatak`);
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="userAuthenticated">
			<SectionMain>
				<div v-if="userAdmin">
					<SectionTitleLineWithButton :icon="mdiDomainPlus" title="Novi poslodavci" main> </SectionTitleLineWithButton>
					<p class="mb-4">U tablici se nalaze poduzeća koja su prijavili zadatke za izvođenje prakse međutim još nisu registrirani za provođenje - potrebno je ručno unijeti podatke o poduzeću.</p>

					<CardBox has-table>
						<TableNewCompanies />
					</CardBox>

					<CardBox v-if="!adminStore.newCompaniesFound">
						<CardBoxComponentEmpty />
					</CardBox>
				</div>
				<SectionTitleLineWithButton class="mt-4" :icon="mdiDomain" title="Svi poslodavci" main> </SectionTitleLineWithButton>
				<p class="mb-4">U tablici se nalaze poduzeća koja su registrirana za provođenje studentske prakse u suradnji s Fakultetom informatike u Puli.</p>
				<div v-if="!userAdmin" class="mb-4">
					<p class="text-sm md:text-base mb-2">Ukoliko ne možete naći zadatak koji vam se sviđa, javite se poslodavcu, predstavite se i zamolite ih da ispune zadatak putem poveznice ispod.</p>
					<FormField class="md:w-1/2" label="Forma za prijavu novog zadatka">
						<FormControl v-model="addNewAssignmentLink" :icon-left="mdiClipboardCheck" :icon-right="mdiContentCopy" name="addNewAssignmentLink" readonly copyable />
					</FormField>

					<p class="flex flex-wrap items-center text-sm md:text-base">
						Nakon što poslodavac ispuni zadatak, prijavite ga u
						<span class="text-fipu_blue cursor-pointer inline-flex items-center md:ml-1 whitespace-normal" @click="router.push('/moja-praksa')">
							<BaseIcon :path="mdiLaptop" class="flex-none align-middle" :size="18"></BaseIcon>

							Moja praksa
						</span>
					</p>
				</div>

				<CardBox has-table>
					<TableCompanies />
				</CardBox>
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>
