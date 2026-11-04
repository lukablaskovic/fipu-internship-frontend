<script setup>
import InternshipPageHeader from "@/components/Internship/InternshipPageHeader.vue";
import StudentWithdrawAction from "@/components/Internship/StudentWithdrawAction.vue";

import { mdiProgressClock, mdiNewBox } from "@mdi/js";
import IconTextLink from "@/components/IconTextLink.vue";
import { computed } from "vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import SectionMain from "@/components/Section/SectionMain.vue";

import { useMainStore } from "@/stores/main_store";

const mainStore = useMainStore();

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
		<SectionMain class="relative">
			<InternshipPageHeader />
			<br />
			<img src="/illustrations/selection.svg" class="absolute right-0 top-0 mr-6 mt-4 w-1/5 max-w-full" />
			<SectionTitleLineWithButton :icon="mdiProgressClock" main title="Postupak odobrenja je u tijeku"></SectionTitleLineWithButton>
			<div class="flex flex-wrap text-base">Voditelj vam još nije odobrio zadatak. Ako čekate dugo (nekoliko dana), molimo da kontaktirate voditelja stručne prakse.</div>
			<span class="mb-4 flex flex-wrap text-base">
				Ako vam poslodavac još nije prijavio zadatak, javite im se da to što prije to učine na <span class="inline-flex"> <IconTextLink :to="'/poslodavci/novi-zadatak'" :icon="mdiNewBox" :text="'Prijava zadatka'"></IconTextLink>.</span>
			</span>
			<hr class="mb-4" />
			<div class="flex flex-wrap text-base">Ukoliko nemate dogovor s voditeljem prakse i poslodavcem, odabrali ste pogrešan proces prakse te u tom slučaju molimo da kontaktirate voditelja.</div>
			<br />
			<StudentWithdrawAction />
		</SectionMain>
	</component>
</template>

<style scoped>
@reference "../../../css/main.css";
.ghost {
	opacity: 0.5;
	background: theme("colors.fipu_light_blue / 25%");
}
</style>
