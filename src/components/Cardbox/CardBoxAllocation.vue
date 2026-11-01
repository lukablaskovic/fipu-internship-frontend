<template>
	<div :key="props.data.id_zadatak" class="min-w-0 text-sm text-gray-600 dark:text-gray-300">
		<div class="flex items-start justify-between gap-6 border-b border-gray-200 pb-6 dark:border-slate-700">
			<div class="min-w-0">
				<h1 class="break-words text-xl font-bold leading-tight text-gray-900 dark:text-white sm:text-2xl">
					{{ props.data.id_zadatak }}
				</h1>
				<p class="mt-3 break-words text-sm font-medium text-gray-600 dark:text-gray-200">
					{{ props.data["Poslodavac"][0]["value"] }}:
					{{ props.data.poslodavac_email }}
				</p>
			</div>

			<div class="hidden sm:block sm:shrink-0">
				<UserAvatar :username="props.data.Poslodavac[0].value" :avatar="companyLogo" class="h-20 w-20 [&_img]:object-contain" />
			</div>
		</div>

		<div class="space-y-6 py-6">
			<section>
				<h2 class="mb-2 font-semibold text-gray-900 dark:text-white">Opis zadatka</h2>
				<ExpandableText :text="props.data.opis_zadatka" />
			</section>
			<div class="grid gap-6 sm:grid-cols-2">
				<section>
					<h2 class="mb-2 font-semibold text-gray-900 dark:text-white">Preferirane tehnologije</h2>
					<ExpandableText :text="props.data.preferirane_tehnologije" />
				</section>
				<section>
					<h2 class="mb-2 font-semibold text-gray-900 dark:text-white">Potrebno imati</h2>
					<ExpandableText :text="props.data.potrebno_imati || 'nije navedeno'" />
				</section>
				<section>
					<h2 class="mb-2 font-semibold text-gray-900 dark:text-white">Preferencije za studenta</h2>
					<ExpandableText :text="props.data.preferencije_za_studenta" />
				</section>
				<section>
					<h2 class="mb-2 font-semibold text-gray-900 dark:text-white">Napomena</h2>
					<ExpandableText :text="props.data.napomena || 'Nema napomene.'" />
				</section>
			</div>
		</div>

		<dl class="grid grid-cols-1 gap-6 border-t border-gray-200 py-6 sm:grid-cols-2 lg:grid-cols-3 dark:border-slate-700 [&_dd]:mt-1 [&_dd]:whitespace-pre-line [&_dd]:break-words [&_dd]:text-sm [&_dd]:text-gray-600 dark:[&_dd]:text-gray-300">
			<div class="flex flex-col-reverse">
				<dd class="text-xs text-gray-500 dark:text-gray-100">
					{{ props.data.zeljeno_okvirno_vrijeme_pocetka }}
				</dd>
				<dt class="text-sm font-medium text-gray-600 dark:text-gray-200">Okviran početak</dt>
			</div>

			<div class="flex flex-col-reverse">
				<dd class="text-xs text-gray-500 dark:text-gray-100">
					{{ props.data.lokacija }}
				</dd>
				<dt class="text-sm font-medium text-gray-600 dark:text-gray-200">Lokacija</dt>
			</div>

			<div class="flex flex-col-reverse">
				<dd class="text-xs text-gray-500 dark:text-gray-100">{{ props.data.trajanje_sati }} sati</dd>
				<dt class="text-sm font-medium text-gray-600 dark:text-gray-200">Trajanje</dt>
			</div>

			<div v-if="props.data.selekcija === true" class="flex flex-col-reverse">
				<dd class="text-xs text-gray-500 dark:text-gray-100">
					<ExpandableText :text="props.data.proces_selekcije" />
				</dd>
				<dt class="text-sm font-medium text-gray-600 dark:text-gray-200">Selekcija</dt>
			</div>

			<div v-else class="flex flex-col-reverse">
				<dd class="text-xs text-gray-500 dark:text-gray-100">Ne</dd>
				<dt class="text-sm font-medium text-gray-600 dark:text-gray-200">Selekcija</dt>
			</div>

			<div v-if="props.data.angazman_fipu !== 'Ne' || props.data.angazman_fipu === ''" class="flex flex-col-reverse">
				<dd class="text-xs text-gray-500 dark:text-gray-100">
					<span v-if="props.data.angazman_fipu">{{ props.data.angazman_fipu }}</span>
					<span v-else>Ne</span>
				</dd>
				<dt class="text-sm font-medium text-gray-600 dark:text-gray-200">FIPU Angažman</dt>
			</div>
		</dl>
	</div>
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
let companyLogo = ref("");

onMounted(async () => {
	let result = await mainStore.fetchCompanies(props.data["Poslodavac"][0]["value"]);
	companyLogo.value = result[0].logo[0].url;
});
</script>
<style></style>
