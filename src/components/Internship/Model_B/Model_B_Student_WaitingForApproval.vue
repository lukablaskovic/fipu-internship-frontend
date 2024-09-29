<script setup>
import { mdiClipboardCheckOutline, mdiProgressClock, mdiLaptop, mdiNumeric1Circle, mdiNumeric2CircleOutline, mdiNumeric3CircleOutline, mdiEmail } from "@mdi/js";
import { ref, computed, onMounted } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import SectionMain from "@/components/Section/SectionMain.vue";

import { mainStore, studentStore } from "@/main.js";

onMounted(async () => {
	let result = await studentStore.getInstanceInfo(mainStore.currentUser.internship_process.id);
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
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main> </SectionTitleLineWithButton>
			<p><b>Akademska godina:</b> {{ mainStore.academicYear }}</p>
			<p><b>Voditelj:</b> {{ mainStore.voditelj_prakse }}</p>
			<hr />
			<br />
			<SectionTitleLineWithButton :icon="mdiProgressClock" main title="Odobrenje u tijeku"></SectionTitleLineWithButton>
			<div class="flex flex-wrap text-base">Zadatak vam još nije odobren.</div>
			<br />
		</SectionMain>
	</component>
</template>

<style scoped>
.ghost {
	opacity: 0.5;
	background: #c8ebfb;
}
</style>
