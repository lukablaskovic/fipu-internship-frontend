<script setup>
import TableSearch from "@/components/Tables/TableSearch.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import SortableTableHeader from "@/components/Tables/SortableTableHeader.vue";
import TableCellText from "@/components/Tables/TableCellText.vue";
import { countInternshipStages } from "@/helpers/internship-stages";
import { appConfig } from "@/config";

import { Tabs } from "reka-ui/namespaced";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import FormControlListbox from "@/components/Form/FormControlListbox.vue";
import { groupEventsByStudent, searchAndSortEvents } from "@/helpers/log-events.js";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import TablePagination from "@/components/Tables/TablePagination.vue";
import { usePagination } from "@/composables/usePagination.js";
import { mdiNoteAlert, mdiAccountTie, mdiAccountMultiple, mdiAccountSchoolOutline, mdiProgressClock, mdiViewDashboard, mdiCardSearch, mdiAccountCancel, mdiAlphaSBox, mdiSourceBranch, mdiPlayCircleOutline, mdiClockOutline, mdiChevronDown } from "@mdi/js";
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
import SectionMain from "@/components/Section/SectionMain.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";

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

const statisticGroups = computed(() => [
	{ id: "AB", color: "text-fipu_blue", pill: "info", metrics: [
		{ number: finished_internships.value, icon: mdiAccountSchoolOutline, label: "Uspješno odrađenih praksi (A + B)" },
		{ number: ongoing_internships.value, icon: mdiAccountMultiple, label: "Ukupno aktivnih procesa (A + B)", to: "/studenti?model=AB" },
		{ number: adminStore.dashboard_data.cancelled_internships, icon: mdiAccountCancel, label: "Odustalo od prakse" },
		{ number: waiting_for_mark.value, icon: mdiAlphaSBox, label: "Čeka na upis ocjene" },
	] },
	{ id: "A", color: "text-rose-600", pill: "danger", metrics: [
		{ number: a_finished_internships.value, icon: mdiAccountSchoolOutline, label: "Uspješno odrađenih praksi (A)" },
		{ number: a_ongoing_internships.value, icon: mdiAccountMultiple, label: "Ukupno aktivnih procesa (A)", to: "/studenti?model=A" },
		{ number: waiting_for_allocation.value, icon: mdiProgressClock, label: "Čeka na alokaciju", to: "/studenti?stage=ceka_alokaciju" },
		{ number: waiting_for_evaluation.value, icon: mdiAccountTie, label: "Evaluacija poslodavca u tijeku" },
	] },
	{ id: "B", color: "text-emerald-500", pill: "success", metrics: [
		{ number: b_finished_internships.value, icon: mdiAccountSchoolOutline, label: "Uspješno odrađenih praksi (B)" },
		{ number: b_ongoing_internships.value, icon: mdiAccountMultiple, label: "Ukupno aktivnih procesa (B)", to: "/studenti?model=B" },
		{ number: b_waiting_for_assignment_approval.value, icon: mdiProgressClock, label: "Čeka na odobrenje zadatka", to: "/studenti?stage=ceka_odobrenje" },
		{ number: b_waiting_for_direct_assignment.value, icon: mdiNoteAlert, label: "Nije se još prijavilo" },
	] },
]);

const statisticsModel = ref("AB");
const stageCounts = computed(() => countInternshipStages(adminStore.students, statisticsModel.value));
const maxStageCount = computed(() => Math.max(1, ...stageCounts.value.map(({ count }) => count)));
const studentsLoadError = ref(false);
const logSearch = ref("");
const studentName = (event) => [event.student_ime, event.student_prezime].filter(Boolean).join(" ") || "Nepoznat student";
const logColumns = [
	{ id: "instance_id", label: "ID instance", value: (event) => event.instance_id ?? "—" },
	{ id: "student", label: "Student", value: studentName },
	{ id: "jmbag", label: "JMBAG", value: (event) => event.student_JMBAG || "—" },
	{ id: "email", label: "Email", value: (event) => event.student_email || "—" },
	{ id: "model", label: "Model", value: (event) => event.model_name === appConfig.bpmn_process_name_A + ".bpmn" ? "A" : "B" },
	{ id: "version", label: "Verzija modela", value: (event) => event.model_version ?? 0 },
	{ id: "event", label: "Događaj", value: (event) => ActivityEventMappings.getEvent(event.activity_id)?.message || event.activity_id },
	{ id: "time", label: "Vrijeme", value: (event) => new Date(event.timestamp).getTime() },
];
const sortOptions = logColumns.flatMap((column) => ["asc", "desc"].map((direction) => ({
	id: `${column.id}-${direction}`,
	column: column.id,
	direction,
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

const groupByStudent = ref(true);
const expandedGroups = ref(new Set());
const logGroups = computed(() => groupByStudent.value
	? groupEventsByStudent(filteredEvents.value)
	: filteredEvents.value.map((event, index) => ({ key: index, events: [event] })));

function toggleGroup(key) {
	if (expandedGroups.value.has(key)) expandedGroups.value.delete(key);
	else expandedGroups.value.add(key);
}

watch(logGroups, () => {
	currentPage.value = 0;
});

const formattedDate = (timestamp) => {
	if (adminStore.relativeToNowTimestmap == true) {
		return moment(timestamp).fromNow();
	} else {
		return moment(timestamp).format("DD/MM/YYYY u HH:mm");
	}
};

const { perPage, currentPage, itemsPaginated } = usePagination(logGroups);

</script>

<template>
	<div>
		<LayoutAuthenticated v-if="mainStore.userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiViewDashboard" title="Nadzorna ploča" main />
				<p class="mb-4"><b>Akademska godina:</b> {{ appConfig.academicYear }}</p>
				<Tabs.Root v-model="statisticsModel">
					<Tabs.List aria-label="Statistika po modelu prakse" class="mb-4 inline-flex rounded-lg bg-white p-1 text-sm dark:bg-slate-800">
						<Tabs.Trigger v-for="model in [{ id: 'A', label: 'A' }, { id: 'B', label: 'B' }, { id: 'AB', label: 'Sve' }]" :key="model.id" :value="model.id" class="rounded-sm px-3 py-1.5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-fipu_blue data-[state=active]:bg-fipu_blue data-[state=active]:text-white">{{ model.label }}</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content v-for="group in statisticGroups" :key="group.id" :value="group.id">
						<p class="mb-4"><b>Statistika | <template v-if="group.id === 'AB'">Općenito</template><template v-else>Model prakse <PillTag :color="group.pill" :label="group.id" /></template></b></p>
						<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
							<template v-for="metric in group.metrics" :key="metric.label">
								<CardBoxWidget
									v-if="adminStore.studentsFetched"
									:color="group.color"
									class="rounded-lg bg-linear-to-t from-fipu_blue/5 to-transparent dark:from-fipu_blue/10"
									:class="{ 'cursor-pointer hover:bg-fipu_blue/10': metric.to }"
									:icon="metric.icon"
									:number="metric.number"
									:label="metric.label"
									v-on="metric.to ? { click: () => router.push(metric.to) } : {}" />
								<SkeletonLoader v-else />
							</template>
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
							<div class="h-5 w-4/5 rounded-sm bg-gray-200 dark:bg-slate-700"></div>
							<div class="flex items-center gap-3">
								<div class="flex-1"><div class="h-6 rounded-sm bg-gray-200 dark:bg-slate-700" :style="{ width }"></div></div>
								<div class="h-5 w-10 rounded-sm bg-gray-200 dark:bg-slate-700"></div>
							</div>
						</div>
					</div>
					<p v-else-if="studentsLoadError" role="alert">Nije moguće dohvatiti podatke o praksama.</p>
					<p v-else-if="!stageCounts.length" role="status">Nema praksi za odabrani model.</p>
					<ul v-else class="space-y-3">
						<li v-for="{ stage, count } in stageCounts" :key="stage">
							<RouterLink :to="{ path: '/studenti', query: { model: statisticsModel, stage, instances: 'all' } }" :aria-label="`${stage}: ${count} — Prikaži studente`" class="grid gap-2 rounded-sm p-1 hover:bg-fipu_blue/10 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-fipu_blue sm:grid-cols-[16rem_1fr] sm:items-center">
								<span class="text-sm">{{ stage }}</span>
								<span class="flex items-center gap-3">
									<span class="h-6 flex-1 rounded-sm bg-slate-100 dark:bg-slate-800" aria-hidden="true"><span class="block h-full rounded-sm" :class="statisticsModel === 'A' ? 'bg-rose-600' : statisticsModel === 'B' ? 'bg-emerald-500' : 'bg-fipu_blue'" :style="{ width: `${count / maxStageCount * 100}%` }"></span></span>
									<span class="w-10 text-right text-sm font-semibold tabular-nums">{{ count }}</span>
								</span>
							</RouterLink>
						</li>
					</ul>
				</section>

				<SectionTitleLineWithButton :icon="mdiCardSearch" title="Događaji (BPMN engine logs)" main> </SectionTitleLineWithButton>

				<template v-if="!eventsFetchError">
					<div class="table-filter-bar mb-3">
						<TableSearch v-model="logSearch" label="Pretraži događaje" placeholder="Ime, JMBAG ili email…" class="min-w-0 flex-1" />
						<FormControlListbox v-model="modelFilter" :icon="mdiSourceBranch" :options="modelOptions" aria-label="Model prakse" button-class="table-filter-select" />
						<FormControlListbox v-model="processFilter" :icon="mdiPlayCircleOutline" :options="processOptions" aria-label="Status instance" button-class="table-filter-select" />
						<FormControlListbox v-model="dateFormat" :icon="mdiClockOutline" :options="dateOptions" aria-label="Format vremena" button-class="table-filter-select" />
						<PillTagFilter trend-type="filter" trend="Događaji" :options="latestEvents" :left="true" small />
					</div>
					<FormCheckRadio v-model="groupByStudent" name="group-by-student" label="Grupiraj po studentu" class="mb-3 text-sm [&_.check]:border-fipu_blue [&_.check[data-state=checked]]:border" />
					<p v-if="!eventsLoading" class="mb-2 text-xs text-gray-500 dark:text-slate-400" role="status">{{ filteredEvents.length }} događaja</p>
					<div class="overflow-x-auto rounded-lg bg-white dark:bg-slate-900/70">
						<table v-if="eventsLoading || filteredEvents.length" :aria-busy="eventsLoading" class="dashboard-logs compact-table w-full text-left text-xs">
							<caption class="sr-only">Događaji (BPMN engine logs)</caption>
							<thead class="border-b dark:border-slate-700">
								<tr>
									<SortableTableHeader v-for="column in logColumns" :key="column.id" :label="column.label" :active="logSort.column === column.id" :direction="logSort.direction" class="px-3 py-2" @sort="sortByColumn(column.id)" />
									<th v-if="groupByStudent" scope="col" class="px-3 py-2 text-right">Događaji</th>
								</tr>
							</thead>
							<tbody v-if="eventsLoading" aria-hidden="true">
								<tr v-for="row in 3" :key="row" class="motion-safe:animate-pulse">
									<td v-for="column in logColumns" :key="column.id" class="px-3 py-3"><div class="h-4 w-20 rounded-sm bg-gray-200 dark:bg-slate-700"></div></td>
									<td v-if="groupByStudent"></td>
								</tr>
							</tbody>
							<tbody v-for="group in itemsPaginated" :key="group.key" class="border-b last:border-0 dark:border-slate-700">
								<tr v-for="(event, index) in expandedGroups.has(group.key) ? group.events : [group.events[0]]" :key="index" class="hover:bg-fipu_blue/10" :class="{ 'bg-slate-50 dark:bg-slate-800/50': index > 0 }">
									<td data-label="ID instance" class="px-3 py-2"><TableCellText :value="event.instance_id ?? '—'" /></td>
									<td data-label="Student" class="compact-title px-3 py-2"><TableCellText :value="studentName(event)"><RouterLink :to="`/studenti/${event.instance_id}`" class="font-semibold text-fipu_blue underline">{{ studentName(event) }}</RouterLink></TableCellText></td>
									<td data-label="JMBAG" class="px-3 py-2"><TableCellText :value="event.student_JMBAG || '—'" /></td><td data-label="Email" class="px-3 py-2"><TableCellText :value="event.student_email || '—'" /></td>
									<td data-label="Model" class="px-3 py-2"><TableCellText :value="event.model_name === appConfig.bpmn_process_name_A + '.bpmn' ? 'A' : 'B'" /></td>
									<td data-label="Verzija modela" class="px-3 py-2"><TableCellText :value="event.model_version == null ? '—' : 'v' + event.model_version" /></td>
									<td data-label="Događaj" class="px-3 py-2"><TableCellText :value="ActivityEventMappings.getEvent(event.activity_id)?.message || event.activity_id" /></td><td data-label="Vrijeme" class="whitespace-nowrap px-3 py-2"><TableCellText :value="formattedDate(event.timestamp)" /></td>
									<td v-if="groupByStudent" data-label="Događaji" class="compact-actions px-3 py-2 text-right">
										<button v-if="index === 0 && group.events.length > 1" type="button" class="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-fipu_blue hover:bg-fipu_blue/10" :aria-expanded="expandedGroups.has(group.key)" :aria-label="`Događaji za studenta: ${studentName(event)} (${group.events.length})`" @click="toggleGroup(group.key)">
											{{ group.events.length }}
											<BaseIcon :path="mdiChevronDown" :size="18" :class="{ 'rotate-180': expandedGroups.has(group.key) }" aria-hidden="true" />
										</button>
										<span v-else-if="index === 0" class="px-2">1</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<p v-if="eventsLoading" class="sr-only" role="status">Učitavanje događaja…</p>
					<CardBoxComponentEmpty v-else-if="!filteredEvents.length" />
				</template>
				<div v-else class="mb-6 text-red-500">Nakon više ponovljenih pokušaja, nije moguće dohvatiti evente.</div>
				<TablePagination v-if="!eventsFetchError && filteredEvents.length" v-model:page="currentPage" v-model:per-page="perPage" :total="logGroups.length" :show-per-page="false" />
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>

<style scoped>
@media (max-width: 1023px) {
	.dashboard-logs .compact-title {
		grid-column: 1 / -1;
	}
	.dashboard-logs td {
		white-space: normal;
	}
	.dashboard-logs td::before {
		white-space: normal;
	}
	.dashboard-logs td > * {
		min-width: 0;
	}
}
</style>
