<script setup>
import { mdiClipboardCheckOutline, mdiProgressClock, mdiLaptop, mdiNumeric1Circle, mdiNumeric2CircleOutline, mdiNumeric3CircleOutline, mdiEmail } from "@mdi/js";
import { ref, computed, onMounted } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";

import { mainStore, studentStore } from "@/main.js";

const prviOdabir = ref(null);
const drugiOdabir = ref(null);
const treciOdabir = ref(null);

let prviOdabirDetails = ref(null);
let drugiOdabirDetails = ref(null);
let treciOdabirDetails = ref(null);

let PrviPoslodavacLogo = ref(null);
let DrugiPoslodavacLogo = ref(null);
let TreciPoslodavacLogo = ref(null);

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
	prviOdabir.value = result.variables["Prvi_odabir"][0];
	drugiOdabir.value = result.variables["Drugi_odabir"][0];
	treciOdabir.value = result.variables["Treci_odabir"][0];

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
	isModalActive.value = true;
}
</script>

<template>
	<component :is="Layout">
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main> </SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> {{ mainStore.voditelj_prakse }}</p>
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiProgressClock" main title="Alokacija zadatka u tijeku"></SectionTitleLineWithButton>
			<div class="flex flex-wrap text-base">Zadatak vam još nije dodijeljen. Ako čekate više od 10 dana, javite se voditelju prakse.</div>
			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardCheckOutline" main title="Vaš odabir"></SectionTitleLineWithButton>

			<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<CardBoxWidget :class="!prviOdabirDetails ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :logo="PrviPoslodavacLogo" :number="null" :text="prviOdabir" label="1. odabir" @click="openModal(prviOdabirDetails)" />
				<CardBoxWidget :class="!drugiOdabirDetails ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :logo="DrugiPoslodavacLogo" :number="null" :text="drugiOdabir" label="2. odabir" @click="openModal(drugiOdabirDetails)" />
				<CardBoxWidget :class="!treciOdabirDetails ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :logo="TreciPoslodavacLogo" :number="null" :text="treciOdabir" label="3. odabir" @click="openModal(treciOdabirDetails)" />
			</div>

			<CardBoxModal v-if="isModalActive" v-model="isModalActive" button-label="Zatvori" button="fipu_blue" has-cancel:false>
				<CardboxAllocation :data="selectedAssignmentDetails"></CardboxAllocation>
				<br />
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
