<template>
	<Combobox v-model="selectedValue">
		<div class="relative">
			<div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 dark:bg-gray-900 sm:text-sm">
				<div v-if="hasValidPrefix" class="absolute inset-y-0 left-0 flex items-center pl-3">
					<span class="rounded bg-fipu_blue px-2 py-1 text-sm text-white">{{ prefixLabel }}</span>
				</div>

				<ComboboxInput v-model="displayValue" :placeholder="`${osKey} + k za pretraživanje`" class="inputClass w-full border-none bg-gray-50 py-2 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 dark:bg-gray-900 dark:text-gray-300 md:w-96" :class="{ 'pl-12': hasValidPrefix, 'pl-3': !hasValidPrefix }" autocomplete="off" @change="query = $event.target.value" style="overflow-x: auto" />
				<ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2" @click="showHelp">
					<MdiMagnify class="h-5 w-5 text-gray-700 hover:text-fipu_blue" aria-hidden="true" />
				</ComboboxButton>
			</div>
			<TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0" @after-leave="query = ''">
				<ComboboxOptions class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-50 py-1 text-base text-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 dark:text-gray-300 sm:text-sm">
					<div v-if="query === ''" class="relative cursor-default select-none px-4 py-2 text-sm text-gray-700 dark:text-gray-200 md:text-base">
						<b>Kratke upute kako koristiti tražilicu</b>
						<hr />
						<br />
						<p>ℹ️ Za brzo kretanje upišite naziv rute direktno.</p>
						<p>ℹ️ Za pregled stavaka, prvo upišite odgovarajući prefix (boldano) te nakon toga pojam.</p>
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
						<li
							tabindex="0"
							class="relative cursor-pointer select-none py-2 pl-10 pr-4"
							:class="{
								'bg-fipu_blue text-white': active,
								'text-gray-900 dark:text-gray-300': !active,
							}">
							<!-- Icons -->
							<MdiAccount
								v-if="result.ime && result.prezime"
								class="absolute left-3 h-5 w-5"
								:class="{
									'text-white': active,
									'text-gray-900 dark:text-gray-300': !active,
								}"
								aria-hidden="true" />
							<MdiPagePreviousOutline
								v-else-if="routes.includes(result)"
								class="absolute left-3 h-5 w-5"
								:class="{
									'text-white': active,
									'text-gray-900 dark:text-gray-300': !active,
								}"
								aria-hidden="true" />
							<MdiClipboardText
								v-if="result.id_zadatak"
								class="absolute left-3 h-5 w-5"
								:class="{
									'text-white': active,
									'text-gray-900 dark:text-gray-300': !active,
								}"
								aria-hidden="true" />
							<MdiDomain
								v-if="result.naziv && !result.ime && !result.prezime"
								class="absolute left-3 h-5 w-5"
								:class="{
									'text-white': active,
									'text-gray-900 dark:text-gray-300': !active,
								}"
								aria-hidden="true" />
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

const prefixLabels = {
	"s:": "Ime",
	"sj:": "JMBAG",
	"se:": "Email",
	"p:": "Poduzeće",
	"z:": "Zadatak",
};

const hasValidPrefix = computed(() => {
	const prefix = query.value.split(":")[0] + ":";
	return helpItems.some((item) => item.prefix === prefix) && query.value.includes(":");
});
const currentPrefix = computed(() => (hasValidPrefix.value ? query.value.split(":")[0] + ":" : ""));
const prefixLabel = computed(() => (hasValidPrefix.value ? prefixLabels[currentPrefix.value] : ""));
const displayValue = computed(() => {
	if (!selectedValue.value) {
		return hasValidPrefix.value ? query.value.slice(currentPrefix.value.length) : query.value;
	}
	return selectedValue.value.name;
});
const filteredResults = computed(() => {
	const searchTerm = query.value
		.slice(query.value.indexOf(":") + 1)
		.toLowerCase()
		.replace(/\s+/g, " ")
		.trim();
	if (!query.value) return [];
	if (!query.value.includes(":")) return routes.filter((route) => route.includes(searchTerm));

	const terms = searchTerm.split(" ");
	if (query.value.startsWith("s:")) {
		return adminStore.students.filter((student) => {
			const ime = student.ime.toLowerCase();
			const prezime = student.prezime.toLowerCase();
			return terms.length > 1 ? ime.includes(terms[0]) && prezime.includes(terms[1]) : ime.includes(terms[0]) || prezime.includes(terms[0]);
		});
	} else if (query.value.startsWith("se:")) {
		return adminStore.students.filter((student) => student.email.toLowerCase().replace(/\s+/g, "").includes(searchTerm));
	} else if (query.value.startsWith("sj:")) {
		return adminStore.students.filter((student) => student.JMBAG.toLowerCase().replace(/\s+/g, "").includes(searchTerm));
	} else if (query.value.startsWith("p:")) {
		return allCompanies.value.filter((company) => company.naziv.toLowerCase().includes(searchTerm));
	} else if (query.value.startsWith("z:")) {
		return allAssignments.value.filter((assignment) => assignment.id_zadatak.split(" - ").some((part) => part.toLowerCase().includes(searchTerm)));
	}
	return [];
});

function insertPrefix(prefix) {
	if (!query.value.startsWith(prefix)) {
		query.value = prefix + query.value;
	}
	const searchInputElement = document.querySelector(".inputClass");
	searchInputElement?.focus();
}

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
