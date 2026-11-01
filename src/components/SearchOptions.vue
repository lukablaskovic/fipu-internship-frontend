<script setup>
import { Combobox } from "reka-ui/namespaced";
import MdiPagePreviousOutline from "vue-material-design-icons/PagePreviousOutline.vue";
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import MdiClipboardText from "vue-material-design-icons/ClipboardText.vue";
import MdiMagnify from "vue-material-design-icons/Magnify.vue";
import MdiAccount from "vue-material-design-icons/Account.vue";
import MdiDomain from "vue-material-design-icons/Domain.vue";
import { adminStore, mainStore } from "@/main";
import { router } from "@/router";

const osKey = computed(() => {
	const userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.includes("mac")) {
		return "CMD";
	} else {
		return "CTRL";
	}
});

const searchInput = ref(null);
const selectedValue = ref("");
const open = ref(false);
const query = ref("");
const allCompanies = ref([]);
const allAssignments = ref([]);

const routes = ["dashboard", "studenti", "alokacije", "dostupni-zadaci", "poslodavci", "profil", "poruke", "poslodavci/novi-zadatak"];
const helpItems = [
	{ prefix: "", description: "usmjeravanje po aplikaciji" },
	{ prefix: "s:", description: "pretraži studenta po imenu i prezimenu" },
	{ prefix: "sj:", description: "pretraži studenta po JMBAGu" },
	{ prefix: "se:", description: "pretraži studenta po emailu" },
	{ prefix: "p:", description: "pretraži poduzeće po nazivu" },
	{ prefix: "z:", description: "pretraži zadatak po nazivu" },
];

const prefixLabels = { "s:": "Ime", "sj:": "JMBAG", "se:": "Email", "p:": "Poduzeće", "z:": "Zadatak" };

const hasValidPrefix = computed(() => {
	const input = query.value;
	const prefix = input.split(":")[0] + ":";
	return helpItems.some((item) => item.prefix === prefix) && input.includes(":");
});

const currentPrefix = computed(() => {
	const input = query.value;
	const prefix = input.split(":")[0] + ":";
	return helpItems.some((item) => item.prefix === prefix) ? prefix : "";
});

const prefixLabel = computed(() => {
	const prefix = currentPrefix.value;
	return prefix ? prefixLabels[prefix] : "";
});

const displayValue = computed({
	get: () => (hasValidPrefix.value ? query.value.slice(currentPrefix.value.length) : query.value),
	set: (value) => {
		if (hasValidPrefix.value) {
			query.value = currentPrefix.value + value;
		} else {
			query.value = value;
		}
	},
});

import { normalizeString, filterByEmail, filterStudentsByName, filterByJMBAG, filterByAssignmentId, filterByCompany } from "@/helpers/search-utils.js";

const filteredResults = computed(() => {
	const searchTerm = query.value ? normalizeString(query.value.slice(query.value.indexOf(":") + 1)) : "";
	if (!query.value || !searchTerm) return [];

	if (!query.value.includes(":")) {
		return routes.filter((route) => route.includes(searchTerm));
	}

	const terms = searchTerm.split(" ");
	const prefix = query.value.split(":")[0];

	switch (prefix) {
		case "s":
			return filterStudentsByName(adminStore.students, terms);
		case "se":
			return filterByEmail(adminStore.students, searchTerm);
		case "sj":
			return filterByJMBAG(adminStore.students, searchTerm);
		case "p":
			return filterByCompany(allCompanies.value, searchTerm);
		case "z":
			return filterByAssignmentId(allAssignments.value, searchTerm);
		default:
			return [];
	}
});

function showHelp() {
	query.value = "";
	open.value = true;
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
			router.push(`/dostupni-zadaci/${newValue.id_zadatak}`);
		}
		query.value = "";
		selectedValue.value = "";
	}
});

const prefixContainer = ref(null);
const inputStyle = computed(() => {
	let paddingLeft = "pl-3";
	if (hasValidPrefix.value && prefixContainer.value) {
		const prefixWidth = prefixContainer.value.offsetWidth;
		paddingLeft = `${prefixWidth + 8}px`;
	} else {
		paddingLeft = "0";
	}
	return { paddingLeft };
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
	allAssignments.value = await mainStore.fetchAvailableAssignments();
});
</script>

<template>
	<Combobox.Root v-model="selectedValue" v-model:open="open" ignore-filter open-on-focus open-on-click :reset-search-term-on-select="false" :reset-search-term-on-blur="false">
		<Combobox.Anchor class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-transparent text-left dark:border-gray-600 sm:text-sm">
			<div v-if="hasValidPrefix" ref="prefixContainer" class="absolute inset-y-0 left-0 flex items-center">
				<span class="ml-2 rounded bg-fipu_blue px-2 py-1 text-sm text-white">{{ prefixLabel }}</span>
			</div>
			<Combobox.Input
				ref="searchInput"
				v-model="displayValue"
				aria-label="Pretraživanje"
				:placeholder="`${osKey} + k za pretraživanje`"
				class="inputClass ml-2 w-full pr-10 text-sm leading-5 text-gray-900 focus:ring-0 dark:text-gray-300 md:w-96"
				:style="inputStyle"
				style="overflow-x: auto; outline: none; border: none; background: transparent"
				@keydown="handleKeyDown" />
			<Combobox.Trigger class="absolute inset-y-0 right-0 flex items-center pr-2 focus-visible:outline focus-visible:outline-fipu_blue" aria-label="Upute za pretraživanje" @click="showHelp">
				<MdiMagnify class="h-5 w-5 text-gray-700 hover:text-fipu_blue" aria-hidden="true" />
			</Combobox.Trigger>
		</Combobox.Anchor>
		<Combobox.Portal>
			<Combobox.Content
				position="popper"
				:side-offset="4"
				class="z-[10000] max-h-60 w-[var(--reka-combobox-trigger-width)] overflow-auto rounded-lg border bg-gray-50 py-1 text-base text-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 dark:text-gray-300 sm:text-sm">
				<Combobox.Viewport>
					<template v-if="query === ''">
						<div class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 md:text-base">
							<b>Kratke upute kako koristiti tražilicu</b>
							<hr />
							<br />
							<p>ℹ️ Za brzo kretanje upišite naziv rute direktno.</p>
							<p>ℹ️ Za pregled stavaka, prvo upišite odgovarajući prefix, nakon toga pojam.</p>
						</div>
						<Combobox.Item
							v-for="helpItem in helpItems"
							:key="helpItem.prefix"
							:value="helpItem"
							:text-value="helpItem.description"
							class="group flex cursor-pointer gap-1 rounded px-2 py-1 outline-none data-[highlighted]:bg-fipu_blue data-[highlighted]:font-medium data-[highlighted]:text-white"
							@select.prevent="insertPrefix(helpItem.prefix)">
							<span class="flex w-6 items-center justify-center rounded bg-fipu_blue px-0.5 font-bold text-gray-900">{{ helpItem.prefix }}</span>
							{{ helpItem.description }}
						</Combobox.Item>
					</template>
					<div v-else-if="filteredResults.length === 0" role="status" class="px-4 py-2 text-gray-700 dark:text-gray-200">Nema rezultata.</div>
					<Combobox.Item v-for="(result, index) in filteredResults" :key="result.id || index" :value="result" class="relative cursor-pointer select-none py-2 pl-10 pr-4 outline-none data-[highlighted]:bg-fipu_blue data-[highlighted]:text-white">
						<MdiAccount v-if="result.ime && result.prezime" class="absolute left-3 h-5 w-5" aria-hidden="true" />
						<MdiPagePreviousOutline v-else-if="routes.includes(result)" class="absolute left-3 h-5 w-5" aria-hidden="true" />
						<MdiClipboardText v-else-if="result.id_zadatak" class="absolute left-3 h-5 w-5" aria-hidden="true" />
						<MdiDomain v-else class="absolute left-3 h-5 w-5" aria-hidden="true" />
						<span v-if="typeof result === 'string'" class="block truncate capitalize">{{ result }}</span>
						<span v-else-if="result.ime && result.prezime" class="block truncate">{{ result.ime }} {{ result.prezime }} ({{ result.JMBAG }}) - {{ result.email }}</span>
						<span v-else-if="result.id_zadatak" class="block truncate">Zadatak ID: {{ result.id_zadatak }}</span>
						<span v-else class="block truncate">{{ result.naziv }}</span>
					</Combobox.Item>
				</Combobox.Viewport>
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
</template>
