<script setup>
import { mdiClipboardCheckOutline, mdiProgressClock, mdiLaptop, mdiNumeric1Circle, mdiNumeric2CircleOutline, mdiNumeric3CircleOutline, mdiEmail } from "@mdi/js";
import { ref, computed, onMounted } from "vue";
import { router } from "@/router";

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

onMounted(async () => {
	let result = await studentStore.getInstanceInfo(mainStore.currentUser.internship_process.id);
	prviOdabir.value = result.variables["Prvi_odabir"][0];
	drugiOdabir.value = result.variables["Drugi_odabir"][0];
	treciOdabir.value = result.variables["Treci_odabir"][0];
});

const Layout = computed(() => {
	if (mainStore.userAuthenticated) {
		return LayoutAuthenticated;
	} else {
		return LayoutGuest;
	}
});

const isModalActive = ref(null);
let modalLoading = ref(false);
async function getAssignmentDetailsInModal(assignment_id) {
	modalLoading.value = true;
	let assignment = await studentStore.getAssignmentDetails(assignment_id);
	isModalActive.value = assignment.data.results[0];
	modalLoading.value = false;
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
			<SectionTitleLineWithButton :icon="mdiProgressClock" main title="U procesu alokacije..."></SectionTitleLineWithButton>
			<div class="flex flex-wrap text-base">Zadatak vam još nije dodijeljen. Ako čekate više od 10 dana, javite se voditelju prakse.</div>
			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardCheckOutline" main title="Vaš odabir"></SectionTitleLineWithButton>

			<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<CardBoxWidget :class="modalLoading ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :icon="mdiNumeric1Circle" :number="null" :text="prviOdabir" label="1. odabir" @click="getAssignmentDetailsInModal(prviOdabir)" />

				<CardBoxWidget :class="modalLoading ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :icon="mdiNumeric2CircleOutline" :number="null" :text="drugiOdabir" label="2. odabir" @click="getAssignmentDetailsInModal(drugiOdabir)" />
				<CardBoxWidget :class="modalLoading ? 'cursor-wait' : 'cursor-pointer'" color="text-fipu_blue" hoverable :icon="mdiNumeric3CircleOutline" :number="null" :text="treciOdabir" label="3. odabir" @click="getAssignmentDetailsInModal(treciOdabir)" />
			</div>
			<CardBoxModal v-if="isModalActive" v-model="isModalActive" button-label="Zatvori" button="fipu_blue" has-cancel:false @cancel="mainStore.activateLogoutModal(false)">
				<CardboxAllocation :data="isModalActive"></CardboxAllocation>

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
