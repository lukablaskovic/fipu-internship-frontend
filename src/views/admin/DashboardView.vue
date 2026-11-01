<script setup>
import { appConfig } from "@/config";

import { Tabs } from "reka-ui/namespaced";
import FormControlListbox from "@/components/Premium/FormControlListbox.vue";
import { searchAndSortEvents } from "@/helpers/log-events.js";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import BasePagination from "@/components/Base/BasePagination.vue";
import { usePagination } from "@/composables/usePagination.js";
import {
	mdiNoteAlert,
	mdiAccountTie,
	mdiAccountMultiple,
	mdiAccountSchoolOutline,
	mdiProgressClock,
	mdiViewDashboard,
	mdiCardSearch,
	mdiAccountCancel,
	mdiAlphaSBox,
	mdiSort,
	mdiSortAscending,
	mdiSortDescending,
} from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { useAdminStore } from "@/stores/admin_store";
import { useMainStore } from "@/stores/main_store";
import { useSnackBarStore } from "@/stores/snackbar_store";


import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import moment from "@/moment-setup";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import PillTagFilter from "@/components/PillTag/PillTagFilter.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import CardBoxEvents from "@/components/Cardbox/CardBoxEvents.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";

import BaseLevel from "@/components/Base/BaseLevel.vue";
import PillTag from "@/components/PillTag/PillTag.vue";

import { ActivityEventMappings } from "@/helpers/maps.js";
import { latestEvents } from "@/filterOptions.js";

const adminStore = useAdminStore();
const mainStore = useMainStore();
const snackBarStore = useSnackBarStore();

const router = useRouter();

const ongoing_internships = ref(0);
const waiting_for_mark = ref(0);
const finished_internships = ref(0);

//A
const waiting_for_allocation = ref(0);
const waiting_for_evaluation = ref(0);
const a_finished_internships = ref(0);
const a_ongoing_internships = ref(0);

//B
const b_waiting_for_assignment_approval = ref(0);
const b_waiting_for_direct_assignment = ref(0);
const b_finished_internships = ref(0);
const b_ongoing_internships = ref(0);

let events = ref([]);
let eventsFetchError = ref(false);
const eventsLoading = ref(true);

onMounted(async () => {
	try {
		await adminStore.getStudents();
		await adminStore.searchModels();

		ongoing_internships.value = adminStore.dashboard_data.ongoing_internships;
		waiting_for_mark.value = adminStore.dashboard_data.waiting_for_mark;
		finished_internships.value = adminStore.dashboard_data.finished_internships;

		//A
		waiting_for_allocation.value = adminStore.dashboard_data.waiting_for_allocation;
		waiting_for_evaluation.value = adminStore.dashboard_data.waiting_for_evaluation;
		a_finished_internships.value = adminStore.dashboard_data.a_finished_internships;
		a_ongoing_internships.value = adminStore.dashboard_data.a_ongoing_internships;

		//B
		b_waiting_for_assignment_approval.value = adminStore.dashboard_data.b_waiting_for_assignment_approval;
		b_waiting_for_direct_assignment.value = adminStore.dashboard_data.b_waiting_for_direct_assignment;
		b_finished_internships.value = adminStore.dashboard_data.b_finished_internships;
		b_ongoing_internships.value = adminStore.dashboard_data.b_ongoing_internships;

		let fetchedEvents = await adminStore.getEvents();

		if (fetchedEvents === null) {
			eventsFetchError.value = true;
			snackBarStore.pushMessage("Nakon više ponovljenih pokušaja, nije moguće dohvatiti evente.", "danger");
		} else {
			events.value = fetchedEvents;
		}
	} catch (error) {
		console.error("Dashboard rendering error:", error);
		eventsFetchError.value = true;
	} finally {
		eventsLoading.value = false;
	}
});

const statisticsModel = ref("AB");
const logView = ref("list");
const logSearch = ref("");
const studentName = (event) => [event.student_ime, event.student_prezime].filter(Boolean).join(" ") || "Nepoznat student";
const logColumns = [
	{ id: "student", label: "Student", value: studentName },
	{ id: "jmbag", label: "JMBAG", value: (event) => event.student_JMBAG || "—" },
	{ id: "email", label: "Email", value: (event) => event.student_email || "—" },
	{ id: "model", label: "Model", value: (event) => event.model_name === appConfig.bpmn_process_name_A + ".bpmn" ? "A" : "B" },
	{ id: "event", label: "Događaj", value: (event) => ActivityEventMappings.getEvent(event.activity_id)?.message || event.activity_id },
	{ id: "time", label: "Vrijeme", value: (event) => new Date(event.timestamp).getTime() },
];
const sortOptions = logColumns.flatMap((column) => ["asc", "desc"].map((direction) => ({
	id: `${column.id}-${direction}`,
	column: column.id,
	direction,
	label: column.id === "time" ? (direction === "asc" ? "Najstariji prvo" : "Najnoviji prvo") : `${column.label} ${direction === "asc" ? "↑" : "↓"}`,
	compare: (a, b) => {
		const valueA = column.value(a);
		const valueB = column.value(b);
		const result = typeof valueA === "number" ? valueA - valueB : valueA.localeCompare(valueB, "hr");
		return direction === "asc" ? result : -result;
	},
})));
const logSort = ref(sortOptions.find((option) => option.id === "time-desc"));
const sortByColumn = (column) => {
	const direction = logSort.value.column === column && logSort.value.direction === "asc" ? "desc" : "asc";
	logSort.value = sortOptions.find((option) => option.id === `${column}-${direction}`);
};
const modelOptions = [{ id: "AB", label: "Svi modeli" }, { id: "A", label: "Model A" }, { id: "B", label: "Model B" }];
const modelFilter = computed({ get: () => modelOptions.find((option) => option.id === adminStore.filterModelState), set: (option) => { adminStore.filterModelState = option.id; } });
const processOptions = [{ id: true, label: "Sve instance" }, { id: false, label: "Aktivne instance" }];
const processFilter = computed({ get: () => processOptions.find((option) => option.id === adminStore.filterActiveInstances), set: (option) => { adminStore.filterActiveInstances = option.id; } });
const dateOptions = [{ id: true, label: "Relativno vrijeme" }, { id: false, label: "Datum i vrijeme" }];
const dateFormat = computed({ get: () => dateOptions.find((option) => option.id === adminStore.relativeToNowTimestmap), set: (option) => { adminStore.relativeToNowTimestmap = option.id; } });

const filteredEvents = computed(() => {
	let filtered = events.value.filter((event) => !ActivityEventMappings.shouldSkipEvent(event.activity_id));

	if (!adminStore.filterActiveInstances) {
		const endedInstances = events.value.filter((event) => event.activity_id === "end_event_student").map((event) => event.instance_id);
		filtered = filtered.filter((event) => !endedInstances.includes(event.instance_id));
	}

	if (adminStore.filterModelState === "A") {
		filtered = filtered.filter((event) => event.model_name === appConfig.bpmn_process_name_A + ".bpmn");
	} else if (adminStore.filterModelState === "B") {
		filtered = filtered.filter((event) => event.model_name === appConfig.bpmn_process_name_B + ".bpmn");
	}

	return searchAndSortEvents(filtered, logSearch.value, logSort.value.compare);
});

watch(filteredEvents, () => {
	currentPage.value = 0;
});

const formattedDate = (timestamp) => {
	if (adminStore.relativeToNowTimestmap == true) {
		return moment(timestamp).fromNow();
	} else {
		return moment(timestamp).format("DD/MM/YYYY u HH:mm");
	}
};

const { perPage, currentPage, itemsPaginated, numPages, currentPageHuman } = usePagination(filteredEvents);

</script>

<template>
	<div>
		<LayoutAuthenticated v-if="mainStore.userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiViewDashboard" title="Nadzorna ploča" main> </SectionTitleLineWithButton>
				<p class="mb-4"><b>Akademska godina:</b> {{ appConfig.academicYear }}</p>
				<Tabs.Root v-model="statisticsModel">
					<Tabs.List aria-label="Statistika po modelu prakse" class="mb-4 inline-flex rounded-lg bg-white p-1 text-sm dark:bg-slate-800">
						<Tabs.Trigger v-for="model in [{ id: 'A', label: 'A' }, { id: 'B', label: 'B' }, { id: 'AB', label: 'Sve' }]" :key="model.id" :value="model.id" class="rounded px-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fipu_blue data-[state=active]:bg-fipu_blue data-[state=active]:text-white">{{ model.label }}</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="AB">
						<p class="mb-4"><b>Statistika | Općenito</b></p>

						<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
							<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiAccountSchoolOutline" :number="finished_internships" label="Uspješno odrađenih praksi (A + B)" />
							<SkeletonLoader v-else></SkeletonLoader>

							<CardBoxWidget
								v-if="adminStore.studentsFetched"
								color="text-fipu_blue"
								class="cursor-pointer rounded-lg hover:bg-fipu_blue/10"
								:icon="mdiAccountMultiple"
								:number="ongoing_internships"
								label="Ukupno aktivnih procesa (A + B)"
								@click="router.push('/studenti?model=AB')" />
							<SkeletonLoader v-else></SkeletonLoader>

							<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiAccountCancel" :number="0" label="Odustalo od prakse" />
							<SkeletonLoader v-else></SkeletonLoader>

							<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiAlphaSBox" :number="waiting_for_mark" label="Čeka na upis ocjene" />
							<SkeletonLoader v-else></SkeletonLoader>
						</div>
					</Tabs.Content>
					<Tabs.Content value="A">
						<p class="mb-4">
							<b>Statistika | Model prakse <PillTag color="danger" label="A" /></b>
						</p>

						<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
							<CardBoxWidget v-if="adminStore.studentsFetched" color="text-rose-600" class="rounded-lg" :icon="mdiAccountSchoolOutline" :number="a_finished_internships" label="Uspješno odrađenih praksi (A)" />
							<SkeletonLoader v-else></SkeletonLoader>

							<CardBoxWidget
								v-if="adminStore.studentsFetched"
								color="text-rose-600"
								class="cursor-pointer rounded-lg hover:bg-fipu_blue/10"
								:icon="mdiAccountMultiple"
								:number="a_ongoing_internships"
								label="Ukupno aktivnih procesa (A)"
								@click="router.push('/studenti?model=A')" />
							<SkeletonLoader v-else></SkeletonLoader>

							<CardBoxWidget
								v-if="adminStore.studentsFetched"
								color="text-rose-600"
								class="cursor-pointer rounded-lg hover:bg-fipu_blue/10"
								:icon="mdiProgressClock"
								:number="waiting_for_allocation"
								label="Čeka na alokaciju"
								@click="router.push('/studenti?stage=ceka_alokaciju')" />
							<SkeletonLoader v-else></SkeletonLoader>

							<CardBoxWidget v-if="adminStore.studentsFetched" color="text-rose-600" class="rounded-lg" :icon="mdiAccountTie" :number="waiting_for_evaluation" label="Evaluacija poslodavca u tijeku" />
							<SkeletonLoader v-else></SkeletonLoader>
						</div>
					</Tabs.Content>
					<Tabs.Content value="B">
						<p class="mb-4">
							<b>Statistika | Model prakse <PillTag color="success" label="B" /></b>
						</p>

						<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
							<CardBoxWidget v-if="adminStore.studentsFetched" color="text-emerald-500" class="rounded-lg" :icon="mdiAccountSchoolOutline" :number="b_finished_internships" label="Uspješno odrađenih praksi (B)" />
							<SkeletonLoader v-else></SkeletonLoader>

							<CardBoxWidget
								v-if="adminStore.studentsFetched"
								color="text-emerald-500"
								class="cursor-pointer rounded-lg hover:bg-fipu_blue/10"
								:icon="mdiAccountMultiple"
								:number="b_ongoing_internships"
								label="Ukupno aktivnih procesa (B)"
								@click="router.push('/studenti?model=B')" />
							<SkeletonLoader v-else></SkeletonLoader>

							<CardBoxWidget
								v-if="adminStore.studentsFetched"
								color="text-emerald-500"
								class="cursor-pointer rounded-lg hover:bg-fipu_blue/10"
								:icon="mdiProgressClock"
								:number="b_waiting_for_assignment_approval"
								label="Čeka na odobrenje zadatka"
								@click="router.push('/studenti?stage=ceka_odobrenje')" />
							<SkeletonLoader v-else></SkeletonLoader>

							<CardBoxWidget v-if="adminStore.studentsFetched" color="text-emerald-500" class="rounded-lg" :icon="mdiNoteAlert" :number="b_waiting_for_direct_assignment" label="Nije se još prijavilo" />
							<SkeletonLoader v-else></SkeletonLoader>
						</div>
					</Tabs.Content>
				</Tabs.Root>

				<SectionTitleLineWithButton :icon="mdiCardSearch" title="Događaji (logs)" main> </SectionTitleLineWithButton>

				<Tabs.Root v-if="!eventsFetchError" v-model="logView">
					<div class="mb-3 flex flex-wrap items-center gap-2 text-sm">
						<Tabs.List aria-label="Prikaz događaja" class="flex rounded-lg bg-white p-1 dark:bg-slate-800">
							<Tabs.Trigger v-for="view in [{ id: 'list', label: 'Popis' }, { id: 'table', label: 'Tablica' }]" :key="view.id" :value="view.id" class="rounded px-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fipu_blue data-[state=active]:bg-fipu_blue data-[state=active]:text-white">{{ view.label }}</Tabs.Trigger>
						</Tabs.List>
						<input v-model="logSearch" type="search" aria-label="Pretraži događaje" placeholder="Ime, JMBAG ili email…" class="min-w-0 flex-1 rounded-lg border-gray-300 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
						<FormControlListbox v-if="logView === 'list'" v-model="logSort" :options="sortOptions" aria-label="Sortiranje događaja" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
						<FormControlListbox v-model="modelFilter" :options="modelOptions" aria-label="Model prakse" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
						<FormControlListbox v-model="processFilter" :options="processOptions" aria-label="Status instance" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
						<FormControlListbox v-model="dateFormat" :options="dateOptions" aria-label="Format vremena" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
						<PillTagFilter trend-type="filter" trend="Događaji" :options="latestEvents" :left="true" small />
					</div>
					<p class="mb-2 text-xs text-gray-500 dark:text-slate-400" role="status">{{ filteredEvents.length }} događaja</p>
					<Tabs.Content value="list">
						<CardBoxEvents v-for="(event, index) in itemsPaginated" :key="index" :student="studentName(event)" :date="formattedDate(event.timestamp)" :type="event.activity_id" :jmbag="event.student_JMBAG || '—'" :email="event.student_email || '—'" :model="event.model_name" class="cursor-pointer rounded-lg hover:bg-fipu_blue/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fipu_blue" role="link" tabindex="0" @click="router.push(`/studenti/${event.instance_id}`)" @keydown.enter="router.push(`/studenti/${event.instance_id}`)" />
					</Tabs.Content>
					<Tabs.Content value="table" class="overflow-x-auto rounded-lg bg-white dark:bg-slate-900/70">
						<table v-if="filteredEvents.length" class="w-full text-left text-xs">
							<caption class="sr-only">Događaji stručne prakse</caption>
							<thead class="border-b dark:border-slate-700">
								<tr>
									<th v-for="column in logColumns" :key="column.id" scope="col" class="px-3 py-2" :aria-sort="logSort.column === column.id ? (logSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'">
										<button type="button" class="flex items-center gap-2 rounded hover:text-fipu_blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-fipu_blue" @click="sortByColumn(column.id)">
											{{ column.label }}
											<BaseIcon :path="logSort.column === column.id ? (logSort.direction === 'asc' ? mdiSortAscending : mdiSortDescending) : mdiSort" w="w-4" h="h-4" :size="16" aria-hidden="true" />
										</button>
									</th>
								</tr>
							</thead>
							<tbody><tr v-for="(event, index) in itemsPaginated" :key="index" class="border-b last:border-0 hover:bg-fipu_blue/10 dark:border-slate-700">
								<td class="px-3 py-2"><RouterLink :to="`/studenti/${event.instance_id}`" class="font-semibold text-fipu_blue underline">{{ studentName(event) }}</RouterLink></td>
								<td class="px-3 py-2">{{ event.student_JMBAG || '—' }}</td><td class="px-3 py-2">{{ event.student_email || '—' }}</td>
								<td class="px-3 py-2">{{ event.model_name === appConfig.bpmn_process_name_A + '.bpmn' ? 'A' : 'B' }}</td>
								<td class="px-3 py-2">{{ ActivityEventMappings.getEvent(event.activity_id)?.message || event.activity_id }}</td><td class="whitespace-nowrap px-3 py-2">{{ formattedDate(event.timestamp) }}</td>
							</tr></tbody>
						</table>
					</Tabs.Content>
					<p v-if="eventsLoading" class="py-6 text-center text-sm text-gray-500 dark:text-slate-400" role="status">Učitavanje događaja…</p>
					<CardBoxComponentEmpty v-else-if="!filteredEvents.length" />
				</Tabs.Root>
				<div v-else class="mb-6 text-red-500">Nakon više ponovljenih pokušaja, nije moguće dohvatiti evente.</div>
				<div v-if="!eventsFetchError && filteredEvents.length" class="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
					<BaseLevel>
						<div class="flex flex-wrap items-center justify-center gap-3">
							<BasePagination :page="currentPage + 1" :total="filteredEvents.length" :items-per-page="perPage" @update:page="currentPage = $event - 1" />
						</div>
						<small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
					</BaseLevel>
				</div>
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>
