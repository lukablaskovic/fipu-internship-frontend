<script setup>
import { mdiClipboardText, mdiLaptop } from "@mdi/js";
import { ref, computed, onMounted } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";

import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import SectionMain from "@/components/Section/SectionMain.vue";

import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import { mainStore, studentStore, snackBarStore } from "@/main.js";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";
import Utils from "@/helpers/utils";

const prviOdabir = ref(null);
let prviOdabirDetails = ref(null);

let PrviPoslodavacLogo = ref(null);

const isModalActive = ref(false);
let selectedAssignmentDetails = ref(null);

async function fetchAssignmentDetails(assignmentId) {
	const response = await studentStore.getAssignmentDetails(assignmentId);
	return response?.data?.results?.[0] || null;
}

async function fetchCompanyLogo(companyName) {
	const response = await mainStore.fetchCompanies(companyName);
	return response?.[0]?.logo?.[0]?.url || null;
}

onMounted(async () => {
	let result = await studentStore.getInstanceInfo(mainStore.currentUser.internship_process.id);
	prviOdabir.value = result.variables["id_zadatak"];

	prviOdabirDetails.value = await fetchAssignmentDetails(prviOdabir.value);
	PrviPoslodavacLogo.value = await fetchCompanyLogo(prviOdabirDetails.value["Poslodavac"][0]["value"]);
});

const Layout = computed(() => {
	if (mainStore.userAuthenticated) {
		return LayoutAuthenticated;
	} else {
		return LayoutGuest;
	}
});

function openModal(assignmentDetails) {
	selectedAssignmentDetails.value = assignmentDetails;
	isModalActive.value = true;
}
const isLoading = ref(false);
const modalConfirmApplication = ref(false);
const napomena = ref(null);

const directApplication = async () => {
	isLoading.value = true;
	if (!mainStore.userAuthenticated) {
		snackBarStore.pushMessage("Morate biti prijavljeni da biste prijavili preferencije.", "warning");
		isLoading.value = false;
		return;
	}
	const result = await studentStore.direct_application_B(prviOdabirDetails.value, napomena.value);
	const message = result?.status === "OK" ? "Uspješno ste prijavili zadatak." : "Zadatak nije prijavljen. Molimo kontaktirajte voditelja prakse.";
	const type = result?.status === "OK" ? "success" : "danger";

	snackBarStore.pushMessage(message, type);
	isLoading.value = false;
	await Utils.wait(2);
	location.reload();
};
</script>

<template>
	<component :is="Layout">
		<SectionMain class="relative">
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main> </SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> {{ mainStore.voditelj_prakse }}</p>

			<br />
			<img src="/illustrations/guy_with_glasses.svg" class="absolute right-0 top-0 mb-12 mr-6 mt-4 hidden w-1/12 max-w-full md:block" />
			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardText" main title="Direktna prijava na zadatak"></SectionTitleLineWithButton>
			<div class="flex flex-wrap text-base">Voditelj je odobrio zadatak koji ste prijavili u dogovoru s poslodavcem. Kako biste nastavili, morate se direktno prijaviti ispod. Ako ste već odradili praksu, molimo da to navedete u napomeni.</div>
			<div class="mt-2 flex flex-wrap text-base">Možete kliknuti ispod kako biste pregledali detalje zadatka koji vam je odobren.</div>

			<br />

			<div class="mb-6 grid grid-cols-1">
				<CardBoxWidget :class="!prviOdabirDetails ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :logo="PrviPoslodavacLogo" :number="null" :text="prviOdabir" label="Odobreni zadatak" @click="openModal(prviOdabirDetails)" />
			</div>

			<CardBoxModal v-if="isModalActive" v-model="isModalActive" button-label="Zatvori" button="fipu_blue" has-cancel:false>
				<CardboxAllocation :data="selectedAssignmentDetails"></CardboxAllocation>
				<br />
			</CardBoxModal>

			<FormField class="lg:mt-4" label="Napomena (nije obavezno)">
				<FormControl v-model="napomena" type="textarea" placeholder="Ovdje dodajte napomenu..." />
			</FormField>
			<BaseButtons class="mb-16 mt-6 items-center justify-center space-y-2">
				<BaseButton type="submit" color="fipu_light_blue" label="Prijava zadatka" :loading="isLoading" @click="modalConfirmApplication = true" />
			</BaseButtons>

			<CardBoxModal v-model="modalConfirmApplication" title="Molimo potvrdite vaš odabir" button-label="Potvrđujem" has-cancel @confirm="directApplication">
				<p class="mb-2"><b>Napomena:</b> {{ napomena || "Nema napomene." }}</p>
			</CardBoxModal>
		</SectionMain>
	</component>
</template>

<style scoped>
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
</style>
