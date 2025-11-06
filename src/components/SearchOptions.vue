<template>
	<Combobox v-model="selectedValue">
		<div class="relative">
			<div class="relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-transparent text-left dark:border-gray-600 sm:text-sm">
				<!-- Prefix label -->
				<div v-if="hasValidPrefix" class="absolute inset-y-0 left-0 flex items-center" ref="prefixContainer">
					<span class="ml-2 rounded bg-fipu_blue px-2 py-1 text-sm text-white">{{ prefixLabel }}</span>
				</div>

				<!-- Combobox input -->
				<ComboboxInput
					v-model="displayValue"
					aria-label="Pretraživanje"
					:placeholder="`${osKey} + k za pretraživanje`"
					class="inputClass ml-2 w-full pr-10 text-sm leading-5 text-gray-900 focus:ring-0 dark:text-gray-300 md:w-96"
					:style="[inputStyle]"
					autocomplete="off"
					@change="handleInputChange"
					@keydown="handleKeyDown"
					style="overflow-x: auto; outline: none; border: none; background: transparent" />

				<!-- Search icon -->
				<ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2" @click="showHelp">
					<MdiMagnify class="h-5 w-5 text-gray-700 hover:text-fipu_blue" aria-hidden="true" />
				</ComboboxButton>
			</div>

			<TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0" @after-leave="query = ''">
				<ComboboxOptions
					class="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-gray-50 py-1 text-base text-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 empty:invisible focus:outline-none dark:bg-gray-900 dark:text-gray-300 sm:text-sm">
					<div v-if="query === ''" class="relative cursor-default select-none px-4 py-2 text-sm text-gray-700 dark:text-gray-200 md:text-base">
						<b>Kratke upute kako koristiti tražilicu</b>
						<hr />
						<br />
						<p>ℹ️ Za brzo kretanje upišite naziv rute direktno.</p>
						<p>ℹ️ Za pregled stavaka, prvo upišite odgovarajući prefix, nakon toga pojam.</p>
						<br />
						<div v-for="helpItem in helpItems" :key="helpItem.prefix" class="group flex cursor-pointer gap-1 rounded px-2 py-1 hover:bg-fipu_blue hover:font-medium hover:text-white dark:hover:text-gray-900" @click="insertPrefix(helpItem.prefix)">
							<div class="flex w-6 items-center justify-center rounded bg-fipu_blue px-0.5 font-bold text-gray-900 group-hover:bg-gray-50 group-hover:text-gray-700 dark:group-hover:bg-gray-900 dark:group-hover:text-gray-300">
								{{ helpItem.prefix }}
							</div>
							{{ helpItem.description }}
						</div>
					</div>
					<!-- No Results -->
					<div v-else-if="filteredResults.length === 0" class="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-200">Nema rezultata.</div>
					<!-- Results List -->
					<ComboboxOption v-for="result in filteredResults" :key="result.id || result" v-slot="{ selected, active }" as="template" :value="result">
						<li tabindex="0" class="relative cursor-pointer select-none py-2 pl-10 pr-4" :class="{ 'bg-fipu_blue text-white': active, 'text-gray-900 dark:text-gray-300': !active }">
							<!-- Icons -->
							<MdiAccount v-if="result.ime && result.prezime" class="absolute left-3 h-5 w-5" :class="{ 'text-white': active, 'text-gray-900 dark:text-gray-300': !active }" aria-hidden="true" />
							<MdiPagePreviousOutline v-else-if="routes.includes(result)" class="absolute left-3 h-5 w-5" :class="{ 'text-white': active, 'text-gray-900 dark:text-gray-300': !active }" aria-hidden="true" />
							<MdiClipboardText v-if="result.id_zadatak" class="absolute left-3 h-5 w-5" :class="{ 'text-white': active, 'text-gray-900 dark:text-gray-300': !active }" aria-hidden="true" />
							<MdiDomain v-if="result.naziv && !result.ime && !result.prezime" class="absolute left-3 h-5 w-5" :class="{ 'text-white': active, 'text-gray-900 dark:text-gray-300': !active }" aria-hidden="true" />
							<!-- Result Content -->
							<template v-if="typeof result === 'string' && routes.includes(result)">
								<span class="block truncate capitalize" :class="{ 'font-medium': selected, 'font-normal': !selected }">
									{{ result }}
								</span>
							</template>
							<template v-else-if="result.ime && result.prezime">
								<span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }"> {{ result.ime }} {{ result.prezime }} ({{ result.JMBAG }}) - {{ result.email }} </span>
							</template>
							<template v-else-if="result.id_zadatak">
								<span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }"> Zadatak ID: {{ result.id_zadatak }} </span>
							</template>
							<template v-else>
								<span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
									{{ result.naziv }}
								</span>
							</template>
						</li>
					</ComboboxOption>
				</ComboboxOptions>
			</TransitionRoot>
		</div>
	</Combobox>
</template>

<script setup>
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, TransitionRoot } from "@headlessui/vue";
import MdiPagePreviousOutline from "vue-material-design-icons/PagePreviousOutline.vue";
import MdiClipboardText from "vue-material-design-icons/ClipboardText.vue";
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
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

const lastPrefix = ref("");

const displayValue = computed({
	get: () => {
		if (!selectedValue.value) {
			if (hasValidPrefix.value) {
				return query.value.slice(currentPrefix.value.length);
			}
			return query.value;
		}
		return selectedValue.value.name;
	},
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

function handleInputChange(event) {
	const newValue = event.target.value;

	const potentialPrefix = newValue.split(":")[0] + ":";
	const hasNewPrefix = helpItems.some((item) => item.prefix === potentialPrefix) && newValue.includes(":");

	if (hasNewPrefix) {
		lastPrefix.value = potentialPrefix;
		query.value = potentialPrefix;
		event.target.value = "";
	} else if (hasValidPrefix.value) {
		query.value = currentPrefix.value + newValue;
	} else {
		query.value = newValue;
	}
}

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
			searchInput.value = document.querySelector(".inputClass");
			searchInput.value?.focus();
		}
	};
	document.addEventListener("keydown", onKeydown);
	onUnmounted(() => document.removeEventListener("keydown", onKeydown));

	allCompanies.value = await mainStore.fetchCompanies();
	allAssignments.value = await mainStore.fetchAvailableAssignments();
});
</script>
