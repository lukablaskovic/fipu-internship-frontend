<template>
	<Combobox v-model="selectedValue">
		<div class="relative">
			<div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm">
				<ComboboxInput v-model="displayValue" placeholder="CTRL + k ili [ / ] za pretraživanje" class="inputClass w-64 md:w-96 border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 focus:ring-0" autocomplete="off" @change="query = $event.target.value" />
				<ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2" @click="showHelp">
					<MdiMagnify class="h-5 w-5 text-gray-700 hover:text-fipu_blue" aria-hidden="true" />
				</ComboboxButton>
			</div>
			<TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0" @after-leave="query = ''">
				<ComboboxOptions class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md text-gray-900 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
					<!-- Display help when query doesn't match any specific command -->
					<div v-if="query === ''" class="relative cursor-default select-none py-2 px-4 text-sm md:text-base text-gray-700 dark:text-gray-200">
						<b>Kratke upute kako koristiti tražilicu</b>
						<hr />
						<br />
						<p>ℹ️ Za brzo kretanje upišite naziv rute direktno.</p>
						<p>ℹ️ Za pregled stavaka, prvo upišite odgovarajući prefix (boldano) te nakon toga pojam.</p>
						<br />

						<div v-for="helpItem in helpItems" :key="helpItem.prefix" class="cursor-pointer hover:bg-fipu_blue hover:text-white hover:font-medium dark:hover:text-gray-900 py-1 px-2 rounded flex gap-1 group" @click="insertPrefix(helpItem.prefix)">
							<div class="bg-fipu_blue text-gray-900 px-0.5 rounded w-6 flex justify-center items-center font-bold group-hover:bg-gray-50 group-hover:text-gray-700 dark:group-hover:bg-gray-900 dark:group-hover:text-gray-300">
								{{ helpItem.prefix }}
							</div>

							{{ helpItem.description }}
						</div>
					</div>

					<!-- Display "No results found" when there's no matching data -->
					<div v-else-if="filteredResults.length === 0" class="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-200">Nema rezultata.</div>

					<ComboboxOption v-for="result in filteredResults" :key="result.id || result" v-slot="{ selected, active }" as="template" :value="result">
						<li
							tabindex="0"
							class="relative cursor-pointer select-none py-2 pl-10 pr-4"
							:class="{
								'bg-fipu_blue text-white': active,
								'text-gray-900 dark:text-gray-300': !active,
							}">
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

							<template v-if="typeof result === 'string' && routes.includes(result)">
								<span class="block truncate capitalize" :class="{ 'font-medium': selected, 'font-normal': !selected }">
									{{ result }}
								</span>
							</template>
							<!-- Check if the result is a student or company -->
							<template v-if="result.ime && result.prezime">
								<span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
									{{ result.ime }} {{ result.prezime }} ({{ result.JMBAG }}) -
									{{ result.email }}
								</span>
							</template>
							<template v-else-if="result.id_zadatak">
								<span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }"> Zadatak ID: {{ result.id_zadatak }} </span>
							</template>
							<template v-else>
								<span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
									{{ result.naziv }}
									<!-- Company name -->
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
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { adminStore } from "@/main";
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, TransitionRoot } from "@headlessui/vue";
import { router } from "@/router";
import { mainStore, guestStore } from "@/main";
import MdiMagnify from "vue-material-design-icons/Magnify.vue";
import MdiAccount from "vue-material-design-icons/Account.vue";
import MdiPagePreviousOutline from "vue-material-design-icons/PagePreviousOutline.vue";
import MdiClipboardText from "vue-material-design-icons/ClipboardText.vue";
import MdiDomain from "vue-material-design-icons/Domain.vue";

const searchInput = ref(null);

let selectedValue = ref("");

function insertPrefix(prefix) {
	query.value = prefix + query.value;
	const searchInputElement = document.querySelector(".inputClass");
	searchInputElement && searchInputElement.focus();
}

let displayValue = computed(() => {
	if (!selectedValue.value) return query.value;
	return selectedValue.value.name;
});
const allCompanies = ref([]);
const allAssignments = ref([]);

function showHelp() {
	query.value = "";
}

onMounted(async () => {
	function onKeydown(event) {
		if (event.key === "/") {
			event.preventDefault();
			searchInput.value = document.querySelector(".inputClass");
			searchInput.value && searchInput.value.focus();
		}

		// Check for the 'CTRL + K' combination
		if (event.key.toLowerCase() === "k" && event.ctrlKey) {
			event.preventDefault(); // Prevent default behavior
			searchInput.value = document.querySelector(".inputClass");
			searchInput.value && searchInput.value.focus();
		}
	}

	document.addEventListener("keydown", onKeydown);

	onUnmounted(() => {
		document.removeEventListener("keydown", onKeydown);
	});

	let result = await mainStore.fetchCompanies();
	allCompanies.value = result.data.results;
	result = await guestStore.fetchAvailableAssignments();
	allAssignments.value = result;
});

let query = ref("");

let filteredResults = computed(() => {
	const searchTerm = query.value
		.slice(query.value.indexOf(":") + 1)
		.toLowerCase()
		.replace(/\s+/g, " ")
		.trim();

	if (query.value === "") {
		return [];
	}

	if (!query.value.includes(":")) {
		return routes.filter((route) => route.includes(searchTerm));
	}

	const terms = searchTerm.split(" ");
	if (query.value.toLowerCase().startsWith("s:")) {
		return adminStore.students.filter((student) => {
			const ime = student.ime.toLowerCase();
			const prezime = student.prezime.toLowerCase();

			// If the user has typed both first and last names
			if (terms.length > 1) {
				return ime.includes(terms[0]) && prezime.includes(terms[1]);
			}

			// If the user has typed only one name (either first or last)
			return ime.includes(searchTerm) || prezime.includes(searchTerm);
		});
	} else if (query.value.startsWith("se:")) {
		return adminStore.students.filter((student) => student.email.toLowerCase().replace(/\s+/g, "").includes(searchTerm));
	} else if (query.value.startsWith("sj:")) {
		return adminStore.students.filter((student) => student.JMBAG.toLowerCase().replace(/\s+/g, "").includes(searchTerm));
	} else if (query.value.startsWith("p:")) {
		return allCompanies.value.filter((company) => company.naziv.toLowerCase().includes(searchTerm));
	} else if (query.value.startsWith("z:")) {
		return allAssignments.value.filter((assignment) => {
			const parts = assignment.id_zadatak.split(" - ");
			return parts.some((part) => part.toLowerCase().includes(searchTerm));
		});
	} else {
		return [];
	}
});

watch(selectedValue, (newValue, oldValue) => {
	if (newValue && newValue !== oldValue) {
		if (typeof newValue === "string" && routes.includes(newValue)) {
			router.push(`/${newValue}`);
		} else if (newValue.ime && newValue.prezime) {
			// Navigate to student
			navigateToStudent(newValue);
		} else if (newValue.naziv && !newValue.ime && !newValue.prezime) {
			// Navigate to company
			router.push(`/poslodavci/${newValue.naziv}`);
		} else if (newValue.id_zadatak) {
			// Navigate to assignment
			router.push(`/dostupni-zadaci/${newValue.id_zadatak}`);
		}
	}
});

function navigateToStudent(student) {
	const instanceId = student.process_instance_data.id;
	router.push(`/studenti/${instanceId}`);
}

const routes = ["dashboard", "studenti", "alokacije", "dostupni-zadaci", "poslodavci", "bpmn/microservices", "profil", "poruke", "poslodavci/novi-zadatak"];

const helpItems = [
	{ prefix: "", description: "usmjeravanje po aplikaciji" },
	{ prefix: "s:", description: "pretraži studenta po imenu i prezimenu" },
	{ prefix: "sj:", description: "pretraži studenta po JMBAGu" },
	{ prefix: "se:", description: "pretraži studenta po emailu" },
	{ prefix: "p:", description: "pretraži poduzeće po nazivu" },
	{ prefix: "z:", description: "pretraži zadatak po nazivu" },
];
</script>
