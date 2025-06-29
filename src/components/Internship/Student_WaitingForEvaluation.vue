<script setup>
import { mdiProgressClock, mdiLaptop, mdiClipboardCheck } from "@mdi/js";
import { ref, computed, onMounted } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardboxAllocation from "@/components/Cardbox/CardBoxAllocation.vue";
import SectionMain from "@/components/Section/SectionMain.vue";

import { mainStore, studentStore } from "@/main.js";

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
		<SectionMain v-if="allocated_assignment != null" class="relative">
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main> </SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> {{ mainStore.voditelj_prakse }}</p>

			<img src="/illustrations/evaluation.svg" class="absolute right-0 top-0 mr-6 mt-4 hidden w-1/5 max-w-full md:block" />

			<br />
			<SectionTitleLineWithButton :icon="mdiProgressClock" main title="U procesu evaluacije"></SectionTitleLineWithButton>
			<p>
				Alocirani ste na zadatak:
				<b>{{ studentStore.allocated_assignment["id_zadatak"] }} </b>
			</p>
			<p>
				Mentora kontaktirajte putem maila:
				<b>{{ studentStore.allocated_assignment["poslodavac_email"] }}</b
				>.
			</p>
			<br />
			<p>Predstavite se i recite koji ste zadatak dobili u sklopu studentske prakse. Ukoliko se provodi selekcija, morat ćete istu obaviti u dogovoru s poslodavcem.</p>
			<p>
				Kada vas poslodavac prihvati, o tome ćete biti pravovremeno obaviješteni te morate dogovoriti datum početka prakse i ostale detalje.
				<u>Nakon</u> što to obavite, u aplikaciji ćete ispuniti <b>Prijavnicu</b> prije početka izvođenja same prakse.
			</p>

			<br />
			<p>Kako bi se evaluacija uspješno evidentirala, mentor mora isto potvrditi preko poveznice koja mu je stigla na email.</p>
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiClipboardCheck" main title="Alocirani zadatak"></SectionTitleLineWithButton>
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
