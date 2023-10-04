<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { adminStore, mainStore, snackBarStore } from "@/main.js";
import { mdiAccountMultiple, mdiAccountSchoolOutline, mdiProgressClock, mdiViewDashboard, mdiCommentProcessing, mdiMonitorAccount, mdiAccountCancel, mdiAlphaSBox, mdiClockTimeEight, mdiCalendarClock, mdiChartBar } from "@mdi/js";
import { useRouter } from "vue-router";
import moment from "@/moment-setup";
import { useLayoutStore } from "@/stores/layout.js";

import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import CardBoxEvents from "@/components/Cardbox/CardBoxEvents.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import SkeletonLoaderEvent from "@/components/SkeletonLoaderEvent.vue";
import LineChart from "@/components/Charts/LineChart.vue";

import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import PillTagFilter from "@/components/PillTag/PillTagFilter.vue";
import * as chartConfig from "@/components/Charts/chart.config.js";

import { ActivityEventMappings } from "@/helpers/maps.js";
import { latestEvents } from "@/filterOptions.js";
import Utils from "@/helpers/utils";

const router = useRouter();

snackBarStore.pushMessage(`Dobrodošli natrag! ${mainStore.currentUser.username} `, "contrast");

const ongoing_internships = ref(0);
const waiting_for_allocation = ref(0);
const waiting_for_evaluation = ref(0);
const waiting_for_mark = ref(0);
const finished_internships = ref(0);

let events = ref([]);
let eventsFetchError = ref(false);

onMounted(async () => {
	try {
		await adminStore.getStudents();
		await adminStore.searchModels();

		ongoing_internships.value = adminStore.dashboard_data.ongoing_internships;
		waiting_for_allocation.value = adminStore.dashboard_data.waiting_for_allocation;
		waiting_for_evaluation.value = adminStore.dashboard_data.waiting_for_evaluation;
		waiting_for_mark.value = adminStore.dashboard_data.waiting_for_mark;
		finished_internships.value = adminStore.dashboard_data.finished_internships;

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
const itemsPaginated = computed(() => events.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1)));
const leftItems = computed(() => {
	return itemsPaginated.value.slice(0, 5);
});
const rightItems = computed(() => {
	return itemsPaginated.value.slice(5, 10);
});
const numPages = computed(() => Math.ceil(events.value.length / perPage.value));
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

// CHART

const layoutStore = useLayoutStore();
const isLg = computed(() => layoutStore.isLg);
const isMd = computed(() => layoutStore.isMd);

watch([isLg, isMd], () => {
	fillChartData();
});

const chartData = ref(null);

const fillChartData = () => {
	let points = 4;

	if (isLg.value) {
		points = 9;
	} else if (isMd.value) {
		points = 6;
	}

	chartData.value = chartConfig.sampleChartData(12);
};

onMounted(() => {
	fillChartData();
});
</script>

<template>
	<div>
		<LayoutAuthenticated v-if="mainStore.userAuthenticated">
			<SectionMain>
				<SectionTitleLineWithButton :icon="mdiViewDashboard" title="Nadzorna Ploča" main> </SectionTitleLineWithButton>
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiAccountSchoolOutline" :number="finished_internships" label="Uspješno odrađenih praksi" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiAccountMultiple" :number="ongoing_internships" label="Trenutno aktivnih praksi" />
					<SkeletonLoader v-else></SkeletonLoader>
					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiProgressClock" :number="waiting_for_allocation" label="Čeka na alokaciju" />

					<SkeletonLoader v-else></SkeletonLoader>
				</div>

				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiMonitorAccount" :number="waiting_for_evaluation" label="U procesu evaluacije" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiAccountCancel" :number="0" label="Odustali od prakse" />
					<SkeletonLoader v-else></SkeletonLoader>

					<CardBoxWidget v-if="adminStore.studentsFetched" color="text-fipu_blue" class="rounded-lg" :icon="mdiAlphaSBox" :number="waiting_for_mark" label="Čeka na upis ocjene" />
					<SkeletonLoader v-else></SkeletonLoader>
				</div>

				<SectionTitleLineWithButton :icon="mdiCommentProcessing" title="Najnoviji Događaji" main @click="eventsOptionsActive = true"> </SectionTitleLineWithButton>

				<div v-if="!eventsFetchError" class="flex flex-row">
					<div class="mb-4">
						<PillTagFilter class="cursor-pointer" trend-type="filter" :trend="'Događaji'" :options="latestEvents" :left="true" />
					</div>
					<div class="flex flex-row">
						<div class="mb-4">
							<PillTag class="cursor-pointer" :left="false" :icon="adminStore.relativeToNowTimestmap ? mdiClockTimeEight : mdiCalendarClock" :color="adminStore.relativeToNowTimestmap ? 'info' : 'success'" :label="adminStore.relativeToNowTimestmap ? 'Relativno vrijeme' : 'Datum'" @click="toggleDateType" />
						</div>
					</div>
				</div>
				<div v-if="!eventsFetchError && !Utils.isArrayEmpty(events)" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					<div class="flex flex-col">
						<CardBoxEvents
							v-for="(event, index) in leftItems"
							:key="'left-' + index"
							:student="event.student_ime + ' ' + event.student_prezime"
							:date="formattedDate(event.timestamp)"
							:type="event.activity_id"
							:jmbag="event.student_JMBAG == undefined ? 'Greška u dohvatu podataka - JMBAG' : event.student_JMBAG"
							:email="event.student_email == undefined ? 'Greška u dohvatu podataka - email' : event.student_email"
							class="rounded-lg cursor-pointer"
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
							class="rounded-lg cursor-pointer"
							@click="router.push(`/studenti/${event.instance_id}`)" />
					</div>
				</div>
				<div v-else-if="!eventsFetchError && Utils.isArrayEmpty(events)" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
				<div v-else class="text-red-500 mb-6">Nakon više ponovljenih pokušaja, nije moguće dohvatiti evente.</div>
				<div v-if="!eventsFetchError" class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
					<BaseLevel>
						<BaseButtons>
							<BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1" :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
						</BaseButtons>
						<small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
					</BaseLevel>
				</div>

				<SectionTitleLineWithButton class="mt-4" :icon="mdiChartBar" title="Pregled Trendova" main @click="eventsOptionsActive = true"> </SectionTitleLineWithButton>
				<p>Trenutno je hardkodirano 🙂</p>
				<div v-if="chartData" class="md:col-span-3">
					<LineChart :data="chartData" />
				</div>
			</SectionMain>
		</LayoutAuthenticated>
	</div>
</template>
