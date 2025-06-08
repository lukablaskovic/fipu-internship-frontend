<script setup>
import { mdiLaptop, mdiCheckDecagram, mdiClipboardCheck } from "@mdi/js";
import { ref, computed, onMounted } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import SectionMain from "@/components/Section/SectionMain.vue";

import { mainStore, studentStore, adminStore } from "@/main.js";

const allocated_assignment = ref(null);
const student = ref(null);

onMounted(async () => {
	student.value = await studentStore.getInstanceInfo(mainStore.currentUser.internship_process.id);
	if (studentStore.allocated_assignment == null) {
		let result = await studentStore.getAssignmentDetails(studentStore.student_process_instance_data.variables["Alocirani_zadatak"]);
		studentStore.allocated_assignment = result.data.results[0];

		allocated_assignment.value = result.data.results[0];
	} else {
		allocated_assignment.value = studentStore.allocated_assignment;
	}
});

async function fetchPDF(type, search) {
	let result = await adminStore.fetchPDF(search);
	let url;

	if (type == "potvrda") {
		url = result.data.results[0]["ispunjena_potvrda_upload"][0].url;
	} else {
		url = result.data.results[0]["dnevnik_prakse_upload"][0].url;
	}

	window.open(url, "_blank");
}

const Layout = computed(() => {
	if (mainStore.userAuthenticated) {
		return LayoutAuthenticated;
	} else {
		return LayoutGuest;
	}
});
</script>

<template>
	<component :is="Layout">
		<SectionMain v-if="allocated_assignment != null" class="relative">
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main> </SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> {{ mainStore.voditelj_prakse }}</p>

			<br />
			<img src="/illustrations/success.svg" class="absolute right-0 top-0 mr-6 mt-4 hidden w-1/5 max-w-full md:block" />
			<SectionTitleLineWithButton :icon="mdiCheckDecagram" main title="Praksa gotova!"></SectionTitleLineWithButton>
			<p>Vaš proces prakse je završio. Profesor je potvrdio unos ocjene u Studomat.</p>
			<br />
			<p>Nadamo se da vam je kolegij bio od koristi i da ste puno toga naučili! Sretno u daljnjem studiranju! 🎓</p>

			<br />
			<p>
				📃 Potvrdu o obavljenoj praksi možete preuzeti
				<a target="_blank" class="cursor-pointer text-fipu_blue" @click="fetchPDF('potvrda', student.variables.id_dnevnik_prakse)">ovdje</a>.
			</p>
			<p>
				📓 Dnevnik prakse možete preuzeti
				<a target="_blank" class="cursor-pointer text-fipu_blue" @click="fetchPDF('dnevnik', student.variables.id_dnevnik_prakse)">ovdje</a>.
			</p>
			<br />
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardCheck" main title="Odrađeni zadatak"></SectionTitleLineWithButton>
			<CardboxAllocation v-if="allocated_assignment != null" :data="allocated_assignment"></CardboxAllocation>
		</SectionMain>
	</component>
</template>
<style scoped>
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
</style>
