<script setup>
import { mdiAlphaACircle, mdiNoteAlert, mdiClipboardCheck, mdiAccountTie, mdiAlphaBCircleOutline, mdiAccountMultiple, mdiAccountSchoolOutline, mdiProgressClock, mdiViewDashboard, mdiCommentProcessing, mdiMonitorAccount, mdiAccountCancel, mdiAlphaSBox, mdiClockTimeEight, mdiCalendarClock, mdiAccountGroup, mdiOfficeBuilding } from "@mdi/js";
import { adminStore, mainStore, snackBarStore } from "@/main.js";
import { layoutStore } from "@/main";

import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import moment from "@/moment-setup";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import SkeletonLoaderEvent from "@/components/SkeletonLoaderEvent.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import CardBoxEvents from "@/components/Cardbox/CardBoxEvents.vue";
import PillTagFilter from "@/components/PillTag/PillTagFilter.vue";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/Section/SectionMain.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
//import LineChart from "@/components/Charts/LineChart.vue";

import BaseLevel from "@/components/Base/BaseLevel.vue";
import PillTag from "@/components/PillTag/PillTag.vue";

import { ActivityEventMappings } from "@/helpers/maps.js";
import { latestEvents } from "@/filterOptions.js";
import Utils from "@/helpers/utils";

const router = useRouter();

const ongoing_internships = ref(0);
const waiting_for_mark = ref(0);
const finished_internships = ref(0);

//A
const waiting_for_allocation = ref(0);
const waiting_for_evaluation = ref(0);
const a_finished_internships = ref(0);

//B
const b_waiting_for_assignment_approval = ref(0);
const b_waiting_for_direct_assignment = ref(0);
const b_finished_internships = ref(0);

let events = ref([]);
let eventsFetchError = ref(false);

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

		//B
		b_waiting_for_assignment_approval.value = adminStore.dashboard_data.b_waiting_for_assignment_approval;
		b_waiting_for_direct_assignment.value = adminStore.dashboard_data.b_waiting_for_direct_assignment;
		b_finished_internships.value = adminStore.dashboard_data.b_finished_internships;

		let fetchedEvents = await adminStore.getEvents();

		if (fetchedEvents === null) {
			eventsFetchError.value = true;
			snackBarStore.pushMessage("Nakon više ponovljenih pokušaja, nije moguće dohvatiti evente.", "danger");
		} else {
			events.value = fetchedEvents.filter((event) => !ActivityEventMappings.shouldSkipEvent(event.activity_id)).reverse();
		}
	} catch (error) {
		console.error("Dashboard rendering error:", error);
	}
});

const toggleActiveEventsFilter = () => {
	adminStore.filterActiveInstances = !adminStore.filterActiveInstances;
};

const toggleModelEventsFilter = () => {
	// Cycle through the states A -> B -> AB -> A...
	if (adminStore.filterModelState === "A") {
		adminStore.filterModelState = "B";
	} else if (adminStore.filterModelState === "B") {
		adminStore.filterModelState = "AB";
	} else {
		adminStore.filterModelState = "A";
	}
};

const filteredEvents = computed(() => {
	let filtered = events.value;

	// Filter active instances if needed
	if (!adminStore.filterActiveInstances) {
		const endedInstances = events.value.filter((event) => event.activity_id === "end_event_student").map((event) => event.instance_id);
		filtered = filtered.filter((event) => !endedInstances.includes(event.instance_id));
	}

	// Model filtering based on the current state
	if (adminStore.filterModelState === "A") {
		filtered = filtered.filter((event) => event.model_name === mainStore.bpmn_process_name_A + ".bpmn");
	} else if (adminStore.filterModelState === "B") {
		filtered = filtered.filter((event) => event.model_name === mainStore.bpmn_process_name_B + ".bpmn");
	} else if (adminStore.filterModelState === "AB") {
		// Do nothing, include both models
	}

	return filtered;
});

watch(filteredEvents, () => {
	currentPage.value = 0;
});

const eventsOptionsActive = ref(false);
const formattedDate = (timestamp) => {
	if (adminStore.relativeToNowTimestmap == true) {
		return moment(timestamp).fromNow();
	} else {
		return moment(timestamp).format("DD/MM/YYYY u HH:mm");
	}
};

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() => filteredEvents.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1)));
const leftItems = computed(() => {
	return itemsPaginated.value.slice(0, 5);
});
const rightItems = computed(() => {
	return itemsPaginated.value.slice(5, 10);
});
const numPages = computed(() => Math.ceil(filteredEvents.value.length / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
	const pagesList = [];

	for (let i = 0; i < numPages.value; i++) {
		pagesList.push(i);
	}

	return pagesList;
});

const toggleDateType = () => {
	adminStore.relativeToNowTimestmap = !adminStore.relativeToNowTimestmap;
};
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="mainStore.userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiViewDashboard" title="Nadzorna ploča" main> </SectionTitleLineWithButton>
				<p class="mb-4"><b>Statistika | općenito</b></p>

				<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-emerald-500" class="rounded-lg" :icon="mdiAccountSchoolOutline" :number="finished_internships" label="Uspješno odrađenih praksi (A + B)" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-amber-500" class="rounded-lg" :icon="mdiAccountMultiple" :number="ongoing_internships" label="Ukupno aktivnih procesa (A + B)" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-rose-600" class="rounded-lg" :icon="mdiAccountCancel" :number="0" label="Odustali od prakse" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiAlphaSBox" :number="waiting_for_mark" label="Čeka na upis ocjene" />
					<SkeletonLoader v-else></SkeletonLoader>
				</div>

				<p class="mb-4">
					<b>Statistika | Model prakse <PillTag color="danger" label="A" /></b>
				</p>

				<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-emerald-500" class="rounded-lg" :icon="mdiAccountSchoolOutline" :number="a_finished_internships" label="Uspješno odrađenih praksi (A)" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-amber-500" class="rounded-lg" :icon="mdiProgressClock" :number="waiting_for_allocation" label="Čeka na alokaciju" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-amber-500" class="rounded-lg" :icon="mdiAccountTie" :number="waiting_for_evaluation" label="Evaluacija poslodavca u tijeku" />
					<SkeletonLoader v-else></SkeletonLoader>
				</div>

				<p class="mb-4">
					<b>Statistika | Model prakse <PillTag color="success" label="B" /></b>
				</p>

				<div class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-emerald-500" class="rounded-lg" :icon="mdiAccountSchoolOutline" :number="b_finished_internships" label="Uspješno odrađenih praksi (B)" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-amber-500" class="rounded-lg" :icon="mdiProgressClock" :number="b_waiting_for_assignment_approval" label="Čeka na odobrenje zadatka" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-rose-600" class="rounded-lg" :icon="mdiNoteAlert" :number="b_waiting_for_direct_assignment" label="Nije se još prijavilo" />
					<SkeletonLoader v-else></SkeletonLoader>
				</div>

				<SectionTitleLineWithButton :icon="mdiCommentProcessing" title="Najnoviji događaji" main @click="eventsOptionsActive = true"> </SectionTitleLineWithButton>

				<div v-if="!eventsFetchError" class="flex flex-wrap md:flex-row">
					<div class="mb-4">
						<PillTagFilter class="cursor-pointer" trend-type="filter" :trend="'Događaji'" :options="latestEvents" :left="true" />
					</div>

					<div class="flex flex-row">
						<div class="mb-4"><PillTag class="cursor-pointer" :left="false" :icon="adminStore.filterActiveInstances ? mdiAccountGroup : mdiAccountMultiple" :color="adminStore.filterActiveInstances ? 'info' : 'success'" :label="adminStore.filterActiveInstances ? 'Sve instance' : 'Samo aktivne'" @click="toggleActiveEventsFilter" /></div>
					</div>
					<div class="flex flex-row">
						<div class="mb-4"><PillTag class="cursor-pointer" :icon="adminStore.filterModelState === 'A' ? mdiAlphaACircle : adminStore.filterModelState === 'B' ? mdiAlphaBCircle : mdiAlphaABCircleOutline" :color="adminStore.filterModelState === 'A' ? 'danger' : adminStore.filterModelState === 'B' ? 'success' : 'info'" :label="adminStore.filterModelState === 'A' ? 'Model A' : adminStore.filterModelState === 'B' ? 'Model B' : 'Modeli AB'" @click="toggleModelEventsFilter" /></div>
					</div>
					<div class="flex flex-row">
						<div class="mb-4">
							<PillTag class="cursor-pointer" :left="false" :icon="adminStore.relativeToNowTimestmap ? mdiClockTimeEight : mdiCalendarClock" :color="adminStore.relativeToNowTimestmap ? 'info' : 'success'" :label="adminStore.relativeToNowTimestmap ? 'Relativno vrijeme' : 'Datum'" @click="toggleDateType" />
						</div>
					</div>
				</div>
				<div v-if="!eventsFetchError && !Utils.isArrayEmpty(events)" class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div class="flex flex-col">
						<CardBoxEvents
							v-for="(event, index) in leftItems"
							:key="'left-' + index"
							:student="event.student_ime + ' ' + event.student_prezime"
							:date="formattedDate(event.timestamp)"
							:type="event.activity_id"
							:jmbag="event.student_JMBAG == undefined ? 'Greška u dohvatu podataka - JMBAG' : event.student_JMBAG"
							:email="event.student_email == undefined ? 'Greška u dohvatu podataka - email' : event.student_email"
							class="cursor-pointer rounded-lg"
							:model="event.model_name"
							@click="router.push(`/studenti/${event.instance_id}`)" />
					</div>
					<div class="flex flex-col">
						<CardBoxEvents
							v-for="(event, index) in rightItems"
							:key="'right-' + index"
							:student="event.student_ime + ' ' + event.student_prezime"
							:date="formattedDate(event.timestamp)"
							:type="event.activity_id"
							:jmbag="event.student_JMBAG == undefined ? 'Greška u dohvatu podataka - JMBAG' : event.student_JMBAG"
							:email="event.student_email == undefined ? 'Greška u dohvatu podataka - email' : event.student_email"
							:model="event.model_name"
							class="cursor-pointer rounded-lg"
							@click="router.push(`/studenti/${event.instance_id}`)" />
					</div>
				</div>
				<div v-else-if="!eventsFetchError && Utils.isArrayEmpty(events)" class="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
					<div class="flex flex-col">
						<SkeletonLoaderEvent />
						<SkeletonLoaderEvent />
						<SkeletonLoaderEvent />
					</div>
					<div class="flex flex-col">
						<SkeletonLoaderEvent />
						<SkeletonLoaderEvent />
						<SkeletonLoaderEvent />
					</div>
				</div>
				<div v-else class="mb-6 text-red-500">Nakon više ponovljenih pokušaja, nije moguće dohvatiti evente.</div>
				<div v-if="!eventsFetchError" class="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
					<BaseLevel>
						<BaseButtons>
							<BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1" :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
						</BaseButtons>
						<small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
					</BaseLevel>
				</div>
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>
