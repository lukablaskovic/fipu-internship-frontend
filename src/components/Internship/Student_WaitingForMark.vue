<script setup>
import { mdiLaptop, mdiClipboardCheck, mdiAlphaSBox, mdiEmail } from "@mdi/js";
import { ref, computed, onMounted } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mainStore, studentStore } from "@/main.js";
import { adminStore } from "@/main.js";
import { router } from "@/router";

const student = ref(null);
const allocated_assignment = ref(null);
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
		<SectionMain v-if="allocated_assignment != null">
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main> </SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b>{{ mainStore.voditelj_prakse }}</p>
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiAlphaSBox" main title="U postupku ocjenjivanja"></SectionTitleLineWithButton>
			<p>Vaš proces prakse je završio. Nakon što vam profesor pregleda potvrdu i odobori dnevnik prakse, ocjena će vam biti unesena u Studomat.</p>
			<div class="flex flex-wrap text-base">Ako čekate više od 7 dana, molimo vas da se obratite voditelju prakse.</div>
			<br />
			<p>
				📃Potvrdu o obavljenoj praksi možete preuzeti
				<a target="_blank" class="cursor-pointer text-fipu_blue" @click="fetchPDF('potvrda', student.variables.id_dnevnik_prakse)">ovdje</a>.
			</p>
			<p>
				📓Dnevnik prakse možete preuzeti
				<a target="_blank" class="cursor-pointer text-fipu_blue" @click="fetchPDF('dnevnik', student.variables.id_dnevnik_prakse)">ovdje</a>.
			</p>
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardCheck" main title="Odrađeni zadatak"></SectionTitleLineWithButton>
			<CardboxAllocation v-if="allocated_assignment != null" :data="allocated_assignment"></CardboxAllocation>

			<br />
			<hr />

			<br />

			<hr />
		</SectionMain>
	</component>
</template>
<style scoped>
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
</style>
