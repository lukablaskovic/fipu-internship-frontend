<script setup>
import AssignmentDetailsModal from "@/components/Internship/AssignmentDetailsModal.vue";
import InternshipPageHeader from "@/components/Internship/InternshipPageHeader.vue";
import StudentWithdrawAction from "@/components/Internship/StudentWithdrawAction.vue";

import { mdiProgressClock, mdiNumeric } from "@mdi/js";
import { ref, computed, onMounted } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import SectionMain from "@/components/Section/SectionMain.vue";


import { useMainStore } from "@/stores/main_store";
import { useStudentStore } from "@/stores/student_store";

const mainStore = useMainStore();
const studentStore = useStudentStore();


const prviOdabir = computed(() => studentStore.student_process_instance_data.variables["Prvi_odabir"][0]);
const drugiOdabir = computed(() => studentStore.student_process_instance_data.variables["Drugi_odabir"][0]);
const treciOdabir = computed(() => studentStore.student_process_instance_data.variables["Treci_odabir"][0]);

let prviOdabirDetails = ref(null);
let drugiOdabirDetails = ref(null);
let treciOdabirDetails = ref(null);

let PrviPoslodavacLogo = ref(null);
let DrugiPoslodavacLogo = ref(null);
let TreciPoslodavacLogo = ref(null);

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
	drugiOdabirDetails.value = await fetchAssignmentDetails(drugiOdabir.value);
	treciOdabirDetails.value = await fetchAssignmentDetails(treciOdabir.value);

	PrviPoslodavacLogo.value = await fetchCompanyLogo(prviOdabirDetails.value["Poslodavac"][0]["value"]);
	DrugiPoslodavacLogo.value = await fetchCompanyLogo(drugiOdabirDetails.value["Poslodavac"][0]["value"]);
	TreciPoslodavacLogo.value = await fetchCompanyLogo(treciOdabirDetails.value["Poslodavac"][0]["value"]);
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
</script>

<template>
	<component :is="Layout">
		<SectionMain class="relative">
			<InternshipPageHeader />

			<br />

			<img src="/illustrations/waitng-illustration.svg" class="absolute right-0 top-0 mr-6 mt-4 w-1/6 max-w-full" />

			<SectionTitleLineWithButton :icon="mdiProgressClock" main title="Alokacija zadatka u tijeku"></SectionTitleLineWithButton>
			<div class="flex flex-wrap text-base">Zadatak vam još nije dodijeljen. Ako čekate više od 10 dana, javite se voditelju prakse preko maila ili Google Chata.</div>
			<br />
			<SectionTitleLineWithButton :icon="mdiNumeric" main title="Vaš odabir"></SectionTitleLineWithButton>

			<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<CardBoxWidget class="rounded-lg" :class="!prviOdabirDetails ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :logo="PrviPoslodavacLogo" :number="null" :text="prviOdabir" label="1. odabir" @click="openModal(prviOdabirDetails)" />
				<CardBoxWidget class="rounded-lg" :class="!drugiOdabirDetails ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :logo="DrugiPoslodavacLogo" :number="null" :text="drugiOdabir" label="2. odabir" @click="openModal(drugiOdabirDetails)" />
				<CardBoxWidget class="rounded-lg" :class="!treciOdabirDetails ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :logo="TreciPoslodavacLogo" :number="null" :text="treciOdabir" label="3. odabir" @click="openModal(treciOdabirDetails)" />
			</div>

			<AssignmentDetailsModal v-model="selectedAssignmentDetails" />
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
