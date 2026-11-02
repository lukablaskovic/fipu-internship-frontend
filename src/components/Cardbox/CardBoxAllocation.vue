<template>
	<article :key="props.data.id_zadatak" class="min-w-0 break-words text-sm text-gray-700 dark:text-gray-200">
		<header class="flex items-center gap-4">
			<UserAvatar v-if="companyLogo" :username="props.data.Poslodavac?.[0]?.value" :avatar="companyLogo" class="h-12 w-12 [&_img]:object-contain" />
			<div class="min-w-0">
				<h1 class="text-xl font-bold leading-tight text-gray-900 dark:text-white sm:text-2xl">{{ props.data.id_zadatak }}</h1>
				<div class="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span class="font-medium">{{ props.data.Poslodavac?.[0]?.value }}</span>
					<a v-if="props.data.poslodavac_email" :href="'mailto:' + props.data.poslodavac_email" class="min-w-0 text-sky-700 underline underline-offset-2 dark:text-sky-300">{{ props.data.poslodavac_email }}</a>
				</div>
			</div>
		</header>

		<dl class="my-5 grid gap-x-5 gap-y-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3 dark:bg-slate-800 [&_dt]:text-xs [&_dt]:font-medium [&_dt]:text-slate-600 dark:[&_dt]:text-slate-300 [&_dd]:mt-1 [&_dd]:whitespace-pre-line [&_dd]:font-semibold">
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

		<div class="space-y-4">
			<section>
				<h2 class="font-semibold text-gray-900 dark:text-white">Opis zadatka</h2>
				<ExpandableText class="max-w-prose text-base" :text="props.data.opis_zadatka || 'Nije navedeno'" />
			</section>
			<template v-for="(label, field) in sections" :key="field">
				<section v-if="props.data[field]?.trim()">
					<h2 class="font-semibold text-gray-900 dark:text-white">{{ label }}</h2>
					<ExpandableText class="max-w-prose" :text="props.data[field]" />
				</section>
			</template>
		</div>

		<dl class="mt-5 space-y-2 border-t border-gray-200 pt-4 dark:border-slate-700 [&_dt]:font-medium">
			<div class="flex flex-wrap items-baseline gap-x-3">
				<dt>Selekcija</dt>
				<dd><ExpandableText :text="props.data.selekcija === true ? props.data.proces_selekcije || 'Da' : 'Ne'" /></dd>
			</div>
			<div v-if="props.data.angazman_fipu !== 'Ne'" class="flex flex-wrap items-baseline gap-x-3">
				<dt>FIPU angažman</dt>
				<dd class="whitespace-pre-line">{{ props.data.angazman_fipu || "Ne" }}</dd>
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
