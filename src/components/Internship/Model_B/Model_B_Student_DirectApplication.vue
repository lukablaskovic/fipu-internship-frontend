<script setup>
import AssignmentDetailsModal from "@/components/Internship/AssignmentDetailsModal.vue";
import InternshipPageHeader from "@/components/Internship/InternshipPageHeader.vue";
import StudentWithdrawAction from "@/components/Internship/StudentWithdrawAction.vue";

import { mdiClipboardText } from "@mdi/js";
import { ref, computed, onMounted } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import SectionMain from "@/components/Section/SectionMain.vue";

import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import { useMainStore } from "@/stores/main_store";
import { useStudentStore } from "@/stores/student_store";
import { useSnackBarStore } from "@/stores/snackbar_store";

import FormControl from "@/components/Form/FormControl.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";

const mainStore = useMainStore();
const studentStore = useStudentStore();
const snackBarStore = useSnackBarStore();

const prviOdabir = computed(() => studentStore.student_process_instance_data.variables["id_zadatak"]);
let prviOdabirDetails = ref(null);

let PrviPoslodavacLogo = ref(null);

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
}
const isLoading = ref(false);
const modalConfirmApplication = ref(false);
const napomena = ref(null);

const directApplication = async () => {
	if (isLoading.value) return;
	isLoading.value = true;
	if (!mainStore.userAuthenticated) {
		snackBarStore.pushMessage("Morate biti prijavljeni da biste prijavili preferencije.", "warning");
		isLoading.value = false;
		return;
	}
	let saved = false;
	try {
		const result = await studentStore.direct_application_B(napomena.value);
		if (result?.status !== "OK") throw new Error("Submission failed");
		saved = true;
		snackBarStore.pushMessage("Uspješno ste prijavili zadatak.", "success");
		await studentStore.getPendingUserTask(mainStore.currentUser.internship_process.id);
	} catch (error) {
		snackBarStore.pushMessage(saved ? "Podaci su spremljeni, ali stanje prakse nije osvježeno. Ponovno otvorite Moju praksu." : "Podaci nisu poslani. Molimo pokušajte ponovno ili kontaktirajte voditelja prakse.", "danger");
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<component :is="Layout">
		<SectionMain class="relative">
			<InternshipPageHeader />

			<br />
			<img src="/illustrations/selection.svg" class="absolute right-0 top-0 mb-12 mr-6 mt-4 hidden w-1/5 max-w-full md:block" />
			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardText" main title="Direktna prijava na zadatak"></SectionTitleLineWithButton>
			<div class="flex flex-wrap text-base">Voditelj je odobrio zadatak koji ste prijavili u dogovoru s poslodavcem.</div>
			<div class="mt-2 flex flex-wrap text-base">Kako biste nastavili, morate se direktno prijaviti ispod. Ako ste već odradili praksu, molimo da to navedete u napomeni.</div>
			<div class="mt-2 flex flex-wrap text-base">Možete kliknuti ispod kako biste pregledali detalje zadatka koji vam je odobren.</div>

			<br />

			<div class="mb-6 grid grid-cols-1">
				<CardBoxWidget :class="!prviOdabirDetails ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :logo="PrviPoslodavacLogo" :number="null" :text="prviOdabir" label="Odobreni zadatak" @click="openModal(prviOdabirDetails)" />
			</div>

			<AssignmentDetailsModal v-model="selectedAssignmentDetails" />

			<FormField class="lg:mt-4" label="Napomena (nije obavezno)">
				<FormControl v-model="napomena" type="textarea" placeholder="Ovdje dodajte napomenu..." />
			</FormField>
			<BaseButtons class="mb-16 mt-6 items-center justify-center space-y-2">
				<BaseButton type="submit" color="fipu_light_blue" label="Prijava zadatka" :loading="isLoading" @click="modalConfirmApplication = true" />
			</BaseButtons>

			<CardBoxModal v-model="modalConfirmApplication" title="Molimo potvrdite vaš odabir" button-label="Potvrđujem" has-cancel @confirm="directApplication">
				<p class="mb-2"><b>Napomena:</b> {{ napomena || "Nema napomene." }}</p>
			</CardBoxModal>
			<StudentWithdrawAction />
		</SectionMain>
	</component>
</template>

<style scoped>
.ghost {
	opacity: 0.5;
	background: theme("colors.fipu_light_blue / 25%");
}
</style>
