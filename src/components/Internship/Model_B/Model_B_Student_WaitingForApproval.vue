<script setup>
import { mdiProgressClock, mdiLaptop, mdiNewBox } from "@mdi/js";
import IconTextLink from "@/components/IconTextLink.vue";
import { computed, onMounted } from "vue";

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
			<SectionTitleLineWithButton :icon="mdiProgressClock" main title="Postupak odobrenja je u tijeku"></SectionTitleLineWithButton>
			<div class="flex flex-wrap text-base">Voditelj vam još nije odobrio zadatak. Ako čekate dugo (nekoliko dana), molimo da kontaktirate voditelja stručne prakse.</div>
			<span class="flex flex-wrap text-base">
				Ako vam poslodavac još nije prijavio zadatak, javite im se da to što prije to učine na <span class="inline-flex"> <IconTextLink :to="'/poslodavci/novi-zadatak'" :icon="mdiNewBox" :text="'Prijava zadatka'"></IconTextLink>.</span>
			</span>
			<hr class="mb-4" />
			<div class="flex flex-wrap text-base">Ukoliko nemate dogovor s voditeljem prakse i poslodavcem, odabrali ste pogrešan proces prakse te u tom slučaju molimo da kontaktirate voditelja.</div>
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
