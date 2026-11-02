<script setup>
import TableCellText from "@/components/Tables/TableCellText.vue";
import { countInternshipStages } from "@/helpers/internship-stages";
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
	mdiSourceBranch,
	mdiPlayCircleOutline,
	mdiClockOutline,
} from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { useAdminStore } from "@/stores/admin_store";
import { useMainStore } from "@/stores/main_store";
import { useSnackBarStore } from "@/stores/snackbar_store";


import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import "moment/dist/locale/hr";

moment.locale("hr");

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import PillTagFilter from "@/components/PillTag/PillTagFilter.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import CardBoxEvents from "@/components/Cardbox/CardBoxEvents.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import SkeletonLoaderEvent from "@/components/SkeletonLoaderEvent.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";

import BaseLevel from "@/components/Base/BaseLevel.vue";
import PillTag from "@/components/PillTag/PillTag.vue";

import { ActivityEventMappings } from "@/helpers/maps.js";
const latestEvents = [ActivityEventMappings.events.map((event) => ({
	id: event.activity_id,
	label: event.message,
	icon: event.icon,
}))];

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
		studentsLoadError.value = !(await adminStore.getStudents());
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
const stageCounts = computed(() => countInternshipStages(adminStore.students, statisticsModel.value));
const maxStageCount = computed(() => Math.max(1, ...stageCounts.value.map(({ count }) => count)));
const studentsLoadError = ref(false);
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
				<SectionTitleLineWithButton :icon="mdiViewDashboard" title="Nadzorna ploča" main><span>BPMN engine</span></SectionTitleLineWithButton>
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

							<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiAccountCancel" :number="adminStore.dashboard_data.cancelled_internships" label="Odustalo od prakse" />
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

				<section aria-labelledby="internship-stages-title" class="mb-6 rounded-lg bg-white p-5 dark:bg-slate-900/70">
					<div class="mb-2 flex flex-wrap items-center gap-2">
						<h2 id="internship-stages-title" class="text-lg font-semibold">Prakse po fazi</h2>
						<PillTag :label="statisticsModel === 'AB' ? 'Svi modeli' : `Model ${statisticsModel}`" :color="statisticsModel === 'A' ? 'danger' : statisticsModel === 'B' ? 'success' : 'info'" small />
					</div>
					<p class="mb-4 text-sm text-gray-500 dark:text-slate-400">Broj procesa u trenutačnoj fazi</p>
					<div v-if="!adminStore.studentsFetched" role="status" aria-label="Učitavanje praksi…" class="space-y-3">
						<div v-for="width in ['80%', '55%', '65%', '35%']" :key="width" class="grid gap-2 p-1 motion-safe:animate-pulse sm:grid-cols-[16rem_1fr] sm:items-center" aria-hidden="true">
							<div class="h-5 w-4/5 rounded bg-gray-200 dark:bg-slate-700"></div>
							<div class="flex items-center gap-3">
								<div class="flex-1"><div class="h-6 rounded bg-gray-200 dark:bg-slate-700" :style="{ width }"></div></div>
								<div class="h-5 w-10 rounded bg-gray-200 dark:bg-slate-700"></div>
							</div>
						</div>
					</div>
					<p v-else-if="studentsLoadError" role="alert">Nije moguće dohvatiti podatke o praksama.</p>
					<p v-else-if="!stageCounts.length" role="status">Nema praksi za odabrani model.</p>
					<ul v-else class="space-y-3">
						<li v-for="{ stage, count } in stageCounts" :key="stage">
							<RouterLink :to="{ path: '/studenti', query: { model: statisticsModel, stage, instances: 'all' } }" :aria-label="`${stage}: ${count} — Prikaži studente`" class="grid gap-2 rounded p-1 hover:bg-fipu_blue/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fipu_blue sm:grid-cols-[16rem_1fr] sm:items-center">
								<span class="text-sm">{{ stage }}</span>
								<span class="flex items-center gap-3">
									<span class="h-6 flex-1 rounded bg-slate-100 dark:bg-slate-800" aria-hidden="true"><span class="block h-full rounded" :class="statisticsModel === 'A' ? 'bg-rose-600' : statisticsModel === 'B' ? 'bg-emerald-500' : 'bg-fipu_blue'" :style="{ width: `${count / maxStageCount * 100}%` }"></span></span>
									<span class="w-10 text-right text-sm font-semibold tabular-nums">{{ count }}</span>
								</span>
							</RouterLink>
						</li>
					</ul>
				</section>

				<SectionTitleLineWithButton :icon="mdiCardSearch" title="Događaji (logs)" main> </SectionTitleLineWithButton>

				<Tabs.Root v-if="!eventsFetchError" v-model="logView">
					<div class="table-filter-bar mb-3 flex flex-wrap items-center gap-2 text-sm">
						<Tabs.List aria-label="Prikaz događaja" class="flex rounded-lg bg-white p-1 dark:bg-slate-800">
							<Tabs.Trigger v-for="view in [{ id: 'list', label: 'Popis' }, { id: 'table', label: 'Tablica' }]" :key="view.id" :value="view.id" class="rounded px-3 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fipu_blue data-[state=active]:bg-fipu_blue data-[state=active]:text-white">{{ view.label }}</Tabs.Trigger>
						</Tabs.List>
						<input v-model="logSearch" type="search" aria-label="Pretraži događaje" placeholder="Ime, JMBAG ili email…" class="min-w-0 flex-1 rounded-lg border-gray-300 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800" />
						<FormControlListbox v-if="logView === 'list'" v-model="logSort" :icon="mdiSort" :options="sortOptions" aria-label="Sortiranje događaja" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
						<FormControlListbox v-model="modelFilter" :icon="mdiSourceBranch" :options="modelOptions" aria-label="Model prakse" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
						<FormControlListbox v-model="processFilter" :icon="mdiPlayCircleOutline" :options="processOptions" aria-label="Status instance" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
						<FormControlListbox v-model="dateFormat" :icon="mdiClockOutline" :options="dateOptions" aria-label="Format vremena" button-class="rounded-lg bg-white px-3 py-2 dark:bg-slate-800" />
						<PillTagFilter trend-type="filter" trend="Događaji" :options="latestEvents" :left="true" small />
					</div>
					<p v-if="!eventsLoading" class="mb-2 text-xs text-gray-500 dark:text-slate-400" role="status">{{ filteredEvents.length }} događaja</p>
					<Tabs.Content value="list">
						<div v-if="eventsLoading" aria-hidden="true"><SkeletonLoaderEvent v-for="row in 3" :key="row" /></div>
						<CardBoxEvents v-for="(event, index) in itemsPaginated" :key="index" :student="studentName(event)" :date="formattedDate(event.timestamp)" :type="event.activity_id" :jmbag="event.student_JMBAG || '—'" :email="event.student_email || '—'" :model="event.model_name" class="cursor-pointer rounded-lg hover:bg-fipu_blue/10 dark:hover:bg-fipu_blue/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fipu_blue" role="link" tabindex="0" @click="router.push(`/studenti/${event.instance_id}`)" @keydown.enter="router.push(`/studenti/${event.instance_id}`)" />
					</Tabs.Content>
					<Tabs.Content value="table" class="overflow-x-auto rounded-lg bg-white dark:bg-slate-900/70">
						<table v-if="eventsLoading || filteredEvents.length" :aria-busy="eventsLoading" class="w-full text-left text-xs">
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
							<tbody v-if="eventsLoading" aria-hidden="true">
								<tr v-for="row in 3" :key="row" class="motion-safe:animate-pulse">
									<td v-for="column in logColumns" :key="column.id" class="px-3 py-3"><div class="h-4 w-20 rounded bg-gray-200 dark:bg-slate-700"></div></td>
								</tr>
							</tbody>
							<tbody v-else><tr v-for="(event, index) in itemsPaginated" :key="index" class="border-b last:border-0 hover:bg-fipu_blue/10 dark:border-slate-700">
								<td class="px-3 py-2"><TableCellText :value="studentName(event)"><RouterLink :to="`/studenti/${event.instance_id}`" class="font-semibold text-fipu_blue underline">{{ studentName(event) }}</RouterLink></TableCellText></td>
								<td class="px-3 py-2"><TableCellText :value="event.student_JMBAG || '—'" /></td><td class="px-3 py-2"><TableCellText :value="event.student_email || '—'" /></td>
								<td class="px-3 py-2"><TableCellText :value="event.model_name === appConfig.bpmn_process_name_A + '.bpmn' ? 'A' : 'B'" /></td>
								<td class="px-3 py-2"><TableCellText :value="ActivityEventMappings.getEvent(event.activity_id)?.message || event.activity_id" /></td><td class="whitespace-nowrap px-3 py-2"><TableCellText :value="formattedDate(event.timestamp)" /></td>
							</tr></tbody>
						</table>
					</Tabs.Content>
					<p v-if="eventsLoading" class="sr-only" role="status">Učitavanje događaja…</p>
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
