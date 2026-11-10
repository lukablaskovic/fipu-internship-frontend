<script setup>
import { fetchAvailableAssignments } from "@/services/baserow_client_api";

import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiPagePreviousOutline, mdiClipboardText, mdiMagnify, mdiAccount, mdiDomain } from "@mdi/js";
import { Combobox, ComboboxAnchor, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxViewport } from "@/components/ui/combobox";
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useAdminStore } from "@/stores/admin_store";
import { useMainStore } from "@/stores/main_store";

import { router } from "@/router";

const osKey = computed(() => {
	const userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.includes("mac")) {
		return "⌘";
	} else {
		return "Ctrl";
	}
});

const searchInput = ref(null);
const selectedValue = ref("");
const open = ref(false);
const query = ref("");
const allCompanies = ref([]);
const allAssignments = ref([]);

const routes = ["dashboard", "studenti", "alokacije", "zadaci", "poslodavci", "profil", "poruke", "poslodavci/novi-zadatak"];
const helpItems = [
	{ prefix: "student:", aliases: ["studenti", "ime", "name", "s"], description: "Student po imenu", example: "Ana Anić" },
	{ prefix: "jmbag:", aliases: ["sj", "j"], description: "Student po JMBAG-u", example: "0303000000" },
	{ prefix: "email:", aliases: ["e-mail", "eposta", "e-pošta", "e-posta", "se", "e"], description: "Student po e-mailu", example: "ana@unipu.hr" },
	{ prefix: "company:", aliases: ["poduzeće", "poduzece", "tvrtka", "poslodavac", "p", "c"], description: "Poduzeće", example: "Naziv poduzeća" },
	{ prefix: "task:", aliases: ["zadatak", "z", "t"], description: "Zadatak", example: "ID zadatka" },
];
const suggestedFilters = computed(() => {
	if (query.value.includes(":")) return [];
	const term = normalizeString(query.value);
	return helpItems.filter((item) => item.prefix.startsWith(term) || item.aliases.some((alias) => alias.startsWith(term)) || normalizeString(item.description).includes(term));
});
const currentPrefix = computed(() => query.value.includes(":") ? query.value.slice(0, query.value.indexOf(":") + 1) : "");
const activeFilter = computed(() => {
	const keyword = normalizeString(currentPrefix.value.slice(0, -1));
	return helpItems.find((item) => item.prefix === `${keyword}:` || item.aliases.includes(keyword));
});
const hasValidPrefix = computed(() => !!activeFilter.value);

const displayValue = computed({
	get: () => query.value,
	set: (value) => { query.value = value; },
});

import { normalizeString, filterByEmail, filterStudentsByName, filterByJMBAG, filterByAssignmentId, filterByCompany } from "@/helpers/search-utils.js";

const adminStore = useAdminStore();
const mainStore = useMainStore();

const filteredResults = computed(() => {
	const searchTerm = query.value ? normalizeString(query.value.slice(query.value.indexOf(":") + 1)) : "";
	if (!query.value || !searchTerm) return [];

	if (!query.value.includes(":")) {
		return routes.filter((route) => route.includes(searchTerm));
	}

	const terms = query.value.slice(query.value.indexOf(":") + 1).trim().toLowerCase().split(/\s+/);

	switch (activeFilter.value?.prefix) {
		case "student:":
			return filterStudentsByName(adminStore.students, terms);
		case "email:":
			return filterByEmail(adminStore.students, searchTerm);
		case "jmbag:":
			return filterByJMBAG(adminStore.students, searchTerm);
		case "company:":
			return filterByCompany(allCompanies.value, searchTerm);
		case "task:":
			return filterByAssignmentId(allAssignments.value, searchTerm);
		default:
			return [];
	}
});

async function showHelp() {
	open.value = true;
	await nextTick();
	searchInput.value?.$el?.focus();
}

async function insertPrefix(prefix) {
	query.value = prefix;
	open.value = true;
	await nextTick();
	searchInput.value?.$el?.focus();
}

function navigateToStudent(student) {
	const instanceId = student.process_instance_data.id;
	router.push(`/studenti/${instanceId}`);
}

watch(selectedValue, (newValue) => {
	if (newValue) {
		if (typeof newValue === "string" && routes.includes(newValue)) {
			router.push(`/${newValue}`);
		} else if (newValue.ime && newValue.prezime) {
			navigateToStudent(newValue);
		} else if (newValue.naziv && !newValue.ime && !newValue.prezime) {
			router.push(`/poslodavci/${newValue.naziv}`);
		} else if (newValue.id_zadatak) {
			router.push(`/zadaci/${newValue.id_zadatak}`);
		}
		query.value = "";
		selectedValue.value = "";
	}
});

function handleKeyDown(event) {
	if (hasValidPrefix.value && (event.key === "Backspace" || event.key === "Delete") && query.value === currentPrefix.value) {
		query.value = "";
		event.preventDefault();
	}
}

onMounted(async () => {
	const onKeydown = (event) => {
		if (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			searchInput.value?.$el?.focus();
		}
	};
	document.addEventListener("keydown", onKeydown);
	onUnmounted(() => document.removeEventListener("keydown", onKeydown));

	allCompanies.value = await mainStore.fetchCompanies();
	allAssignments.value = await fetchAvailableAssignments();
});
</script>

<template>
	<Combobox v-model="selectedValue" v-model:open="open" ignore-filter open-on-focus open-on-click :reset-search-term-on-select="false" :reset-search-term-on-blur="false">
		<ComboboxAnchor class="flex h-12 w-full items-center gap-3 rounded-xl border border-[#dce4ea] dark:border-[#475569] bg-gray-50 px-4 text-left transition-colors focus-within:ring-2 focus-within:ring-fipu_blue dark:bg-neutral-900 md:w-96">
			<ComboboxTrigger class="flex shrink-0 items-center text-gray-500 hover:text-gray-900 focus-visible:outline-solid focus-visible:outline-fipu_blue dark:text-neutral-400 dark:hover:text-neutral-200" aria-label="Upute za pretraživanje" @click="showHelp">
				<BaseIcon :path="mdiMagnify" :size="22" aria-hidden="true" />
			</ComboboxTrigger>
			<ComboboxInput
				ref="searchInput"
				v-model="displayValue"
				aria-label="Pretraživanje"
				placeholder="Pretraživanje"
				aria-describedby="search-keyboard-help"
				class="search-input min-w-0 flex-1 caret-fipu_blue border-0 bg-transparent p-0 text-base text-gray-900 placeholder:text-gray-500 focus:outline-hidden focus:ring-0 dark:text-neutral-200 dark:placeholder:text-neutral-400"
				@keydown="handleKeyDown" />
			<kbd class="pointer-events-none shrink-0 whitespace-nowrap font-sans text-sm text-gray-500 dark:text-neutral-400" aria-hidden="true">{{ osKey }} K</kbd>
		</ComboboxAnchor>
		<ComboboxList
			position="popper"
			:side-offset="8"
			align="start"
			class="z-10000 flex flex-col max-h-[min(24rem,var(--reka-combobox-content-available-height))] max-w-[calc(100vw-2rem)]">
			<ComboboxViewport class="min-h-0 max-h-[min(24rem,var(--reka-combobox-content-available-height))] overflow-y-auto p-1.5">
				<p v-if="!query" class="px-3 py-2 text-gray-500 dark:text-neutral-400">Upišite stranicu ili odaberite filter.</p>
				<ComboboxItem
					v-for="helpItem in suggestedFilters"
					:key="helpItem.prefix"
					:value="helpItem"
					:text-value="helpItem.description"
					class="cursor-pointer justify-between gap-3 py-2"
					@select.prevent="insertPrefix(helpItem.prefix)">
					<span>{{ helpItem.description }}</span>
					<code class="shrink-0 text-gray-500 dark:text-neutral-400">{{ helpItem.prefix }}</code>
				</ComboboxItem>
				<div v-if="activeFilter && query === currentPrefix" role="status" class="px-3 py-3 text-gray-500 dark:text-neutral-400">
					<p>{{ activeFilter.description }}</p>
					<p class="mt-1">Primjer: <code class="text-gray-700 dark:text-neutral-200">{{ activeFilter.prefix }}{{ activeFilter.example }}</code></p>
				</div>
				<div v-else-if="query && !suggestedFilters.length && !filteredResults.length" role="status" class="px-3 py-3 text-gray-500 dark:text-neutral-400">Nema rezultata. Pokušajte s drugim pojmom ili filterom.</div>
				<ComboboxItem v-for="(result, index) in filteredResults" :key="result.id || index" :value="result" class="cursor-pointer py-2 pl-10">
					<BaseIcon v-if="result.ime && result.prezime" :path="mdiAccount" w="w-5" h="h-5" :size="24" class="absolute left-3 h-5 w-5" aria-hidden="true" />
					<BaseIcon v-else-if="routes.includes(result)" :path="mdiPagePreviousOutline" w="w-5" h="h-5" :size="24" class="absolute left-3 h-5 w-5" aria-hidden="true" />
					<BaseIcon v-else-if="result.id_zadatak" :path="mdiClipboardText" w="w-5" h="h-5" :size="24" class="absolute left-3 h-5 w-5" aria-hidden="true" />
					<BaseIcon v-else :path="mdiDomain" w="w-5" h="h-5" :size="24" class="absolute left-3 h-5 w-5" aria-hidden="true" />
					<span v-if="typeof result === 'string'" class="block truncate capitalize">{{ result }}</span>
					<span v-else-if="result.ime && result.prezime" class="block truncate">{{ result.ime }} {{ result.prezime }} ({{ result.JMBAG }}) - {{ result.email }}</span>
					<span v-else-if="result.id_zadatak" class="block truncate">Zadatak ID: {{ result.id_zadatak }}</span>
					<span v-else class="block truncate">{{ result.naziv }}</span>
				</ComboboxItem>
			</ComboboxViewport>
			<div id="search-keyboard-help" class="flex shrink-0 flex-wrap gap-x-4 gap-y-1 border-t border-gray-200 px-4 py-2.5 text-xs text-gray-500 dark:border-neutral-700 dark:text-neutral-400">
				<span><kbd>↑ ↓</kbd> odabir</span>
				<span><kbd>Enter</kbd> potvrda</span>
				<span><kbd>Esc</kbd> zatvori</span>
			</div>
		</ComboboxList>
	</Combobox>
</template>

<style scoped>
.search-input:focus {
	outline: none;
}
</style>
