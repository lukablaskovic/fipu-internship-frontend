<script setup>
import { ref, computed, onMounted } from "vue";
import { mdiLaptop, mdiCheckDecagram, mdiClipboardCheck } from "@mdi/js";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionMain from "@/components/Section/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";

import { mainStore, studentStore, snackBarStore } from "@/main.js";

const allocated_assignment = ref(null);
onMounted(async () => {
	await studentStore.getInstanceInfo(mainStore.currentUser.internship_process.id);
	if (studentStore.allocated_assignment == null) {
		let result = await studentStore.getAssignmentDetails(studentStore.student_process_instance_data.variables["Alocirani_zadatak"]);
		studentStore.allocated_assignment = result.data.results[0];

		allocated_assignment.value = result.data.results[0];
	} else {
		allocated_assignment.value = studentStore.allocated_assignment;
	}
});

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
			<p><b>Akademska godina:</b> 2023/2024</p>
			<p><b>Voditelj:</b> doc. dr. sc. Nikola Tanković</p>
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiCheckDecagram" main title="Praksa gotova!"></SectionTitleLineWithButton>
			<p>Vaš proces prakse je završio. Profesor je potvrdio unos ocjene u Studomat.</p>

			<p>Nadamo se da vam je kolegij bio od koristi i da ste puno toga naučili! 😀</p>

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
