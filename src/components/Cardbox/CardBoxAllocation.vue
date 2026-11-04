<template>
	<article :key="props.data.id_zadatak" class="min-w-0 wrap-break-word rounded-xl sm:border border-gray-200 sm:p-4 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-200">
		<header class="flex items-center gap-4">
			<UserAvatar v-if="companyLogo" :username="props.data.Poslodavac?.[0]?.value" :avatar="companyLogo" class="h-12 w-12 [&_img]:object-contain" />
			<div class="min-w-0">
				<h1 class="text-xl font-bold leading-tight text-gray-900 dark:text-white sm:text-2xl">{{ props.data.id_zadatak }}</h1>
				<div class="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span class="font-medium">{{ props.data.Poslodavac?.[0]?.value }}</span>
					<a v-if="props.data.poslodavac_email" :href="'mailto:' + props.data.poslodavac_email" class="min-w-0 text-fipu_blue underline underline-offset-2">{{ props.data.poslodavac_email }}</a>
				</div>
			</div>
			<slot name="header-action" />
		</header>

		<dl class="my-5 grid gap-x-5 gap-y-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3 dark:bg-slate-800">
			<div>
				<dt>Lokacija</dt>
				<dd>{{ props.data.lokacija || "Nije navedeno" }}</dd>
			</div>
			<div>
				<dt>Trajanje</dt>
				<dd>{{ props.data.trajanje_sati != null && props.data.trajanje_sati !== "" ? props.data.trajanje_sati + " sati" : "Nije navedeno" }}</dd>
			</div>
			<div>
				<dt>Okviran početak</dt>
				<dd>{{ props.data.zeljeno_okvirno_vrijeme_pocetka || "Nije navedeno" }}</dd>
			</div>
		</dl>

		<dl class="space-y-4">
			<div>
				<dt>Opis zadatka</dt>
				<dd><ExpandableText class="sm:max-w-prose" :text="props.data.opis_zadatka || 'Nije navedeno'" /></dd>
			</div>
			<template v-for="(label, field) in sections" :key="field">
				<div v-if="props.data[field]?.trim()">
					<dt>{{ label }}</dt>
					<dd><ExpandableText class="sm:max-w-prose" :text="props.data[field]" /></dd>
				</div>
			</template>
			<div>
				<dt>Selekcija</dt>
				<dd><ExpandableText class="sm:max-w-prose" :text="props.data.selekcija === true ? props.data.proces_selekcije || 'Da' : 'Ne'" /></dd>
			</div>
			<div v-if="props.data.angazman_fipu !== 'Ne'">
				<dt>FIPU angažman</dt>
				<dd>{{ props.data.angazman_fipu || "Ne" }}</dd>
			</div>
		</dl>
	</article>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main_store";

import ExpandableText from "@/components/ExpandableText.vue";
import UserAvatar from "@/components/User/UserAvatar.vue";

const mainStore = useMainStore();

const props = defineProps({
	data: {
		type: Object,
		required: true,
	},
});
const sections = {
	preferirane_tehnologije: "Preferirane tehnologije",
	potrebno_imati: "Potrebno imati",
	preferencije_za_studenta: "Preferencije za studenta",
	napomena: "Napomena",
};

const companyLogo = ref("");

onMounted(async () => {
	if (!props.data.Poslodavac?.[0]?.value) return;
	const result = await mainStore.fetchCompanies(props.data.Poslodavac?.[0]?.value);
	companyLogo.value = result?.[0]?.logo?.[0]?.url || "";
});
</script>

<style scoped>
@reference "../../css/main.css";
dt {
	@apply text-base font-bold text-gray-900 dark:text-white;
}

dd {
	@apply mt-1 whitespace-pre-line text-sm font-normal leading-7;
}
</style>
