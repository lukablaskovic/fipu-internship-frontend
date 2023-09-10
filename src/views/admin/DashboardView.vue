<script setup>
import { ref, computed, onMounted } from "vue";
import { adminStore, mainStore } from "@/main.js";
import {
  mdiAccountMultiple,
  mdiAccountSchoolOutline,
  mdiProgressClock,
  mdiViewDashboard,
  mdiCommentProcessing,
  mdiMonitorAccount,
  mdiAccountCancel,
  mdiAlertBox,
  mdiCog,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import CardBoxEvents from "@/components/Cardbox/CardBoxEvents.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import SkeletonLoaderEvent from "@/components/SkeletonLoaderEvent.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { ActivityEventMappings } from "@/helpers/maps.js";
import { snackBarStore } from "@/main.js";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";
import { useRouter } from "vue-router";

import PillTagFilter from "@/components/PillTag/PillTagFilter.vue";
import { buttonMenuOptions } from "@/sampleButtonMenuOptions.js";
import { latestEvents } from "@/filterOptions.js";

import moment from "@/moment-setup";

const router = useRouter();

const userAuthenticated = computed(() => mainStore.userAuthenticated);

const ongoing_internships = ref(0);
const waiting_for_allocation = ref(0);
const waiting_for_evaluation = ref(0);
const events = ref([]);

snackBarStore.pushMessage(
  `Dobrodošli natrag! ${mainStore.currentUser.username} `,
  "contrast"
);

onMounted(async () => {
  await adminStore.getStudents();
  await adminStore.searchModels();
  ongoing_internships.value = adminStore.dashboard_data.ongoing_internships;
  waiting_for_allocation.value =
    adminStore.dashboard_data.waiting_for_allocation;
  waiting_for_evaluation.value =
    adminStore.dashboard_data.waiting_for_evaluation;
  await adminStore.getEvents();
  events.value = adminStore.events
    .filter(
      (event) => !ActivityEventMappings.shouldSkipEvent(event.activity_id)
    )
    .reverse();

  console.log("Dashboard - events", events.value);
});

const eventsOptionsActive = ref(false);

const formattedDate = (timestamp) => {
  if (adminStore.dashboard_data.relativeToNowTimestmap == true) {
    return moment(timestamp).fromNow();
  } else {
    return moment(timestamp).format("DD/MM/YYYY u HH:mm");
  }
};

const perPage = ref(10);
const currentPage = ref(0);
const itemsPaginated = computed(() =>
  events.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);
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
</script>

<template>
  <div>
    <LayoutAuthenticated v-if="userAuthenticated">
      <SectionMain>
        <SectionTitleLineWithButton
          :icon="mdiViewDashboard"
          title="Nadzorna ploča"
          main
        >
        </SectionTitleLineWithButton>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="10%"
            trend-type="up"
            color="text-emerald-500"
            class="rounded-lg"
            :icon="mdiAccountSchoolOutline"
            :number="512"
            label="Uspješno odrađenih praksi"
          />
          <SkeletonLoader v-else></SkeletonLoader>

          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="10%"
            trend-type="up"
            color="text-fipu_blue"
            class="rounded-lg"
            :icon="mdiAccountMultiple"
            :number="ongoing_internships"
            label="Trenutno aktivnih praksi"
          />
          <SkeletonLoader v-else></SkeletonLoader>
          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="10%"
            trend-type="up"
            color="text-red-500"
            class="rounded-lg"
            :icon="mdiProgressClock"
            :number="waiting_for_allocation"
            label="Studenti koji čekaju na alokaciju"
          />

          <SkeletonLoader v-else></SkeletonLoader>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="10%"
            trend-type="up"
            color="text-yellow-500"
            class="rounded-lg"
            :icon="mdiMonitorAccount"
            :number="waiting_for_evaluation"
            label="Studenti u procesu evaluacije"
          />
          <SkeletonLoader v-else></SkeletonLoader>

          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="10%"
            trend-type="up"
            color="text-red-500"
            class="rounded-lg"
            :icon="mdiAccountCancel"
            :number="0"
            label="Odustali od prakse"
          />
          <SkeletonLoader v-else></SkeletonLoader>

          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="10%"
            trend-type="up"
            color="text-yellow-500"
            class="rounded-lg"
            :icon="mdiAlertBox"
            :number="0"
            label="Čeka na upis ocjene"
          />
          <SkeletonLoader v-else></SkeletonLoader>
        </div>

        <CardBoxModal
          v-if="eventsOptionsActive"
          v-model="eventsOptionsActive"
          title="⚙️Postavke"
          button-label="Povratak"
        >
          <CardBox class="mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-start">
                <p class="mr-3 leading-none">Vremenski prikaz</p>
                <PillTag
                  :color="
                    adminStore.dashboard_data.relativeToNowTimestmap
                      ? 'info'
                      : 'success'
                  "
                  :label="
                    adminStore.dashboard_data.relativeToNowTimestmap
                      ? 'Relativno'
                      : 'Datum'
                  "
                  small
                />
              </div>

              <FormCheckRadio
                v-model="adminStore.dashboard_data.relativeToNowTimestmap"
                type="switch"
                name="two-factor"
                :input-value="true"
              />
            </div>
          </CardBox>
        </CardBoxModal>

        <SectionTitleLineWithButton
          :icon="mdiCommentProcessing"
          title="Najnoviji događaji"
          main
          button-enabled
          :button-icon="mdiCog"
          @click="eventsOptionsActive = true"
        >
        </SectionTitleLineWithButton>
        <div class="flex flex-row">
          <div class="mb-4">
            <PillTagFilter
              class="cursor-pointer"
              trend-type="filter"
              :trend="'Događaji'"
              :options="latestEvents"
              left="false"
            />
          </div>
          <!--
          <div class="mb-4">
            <PillTagFilter
              class="cursor-pointer"
              trend-type="filter"
              :trend="'Datum'"
              :options="buttonMenuOptions"
            />
          </div>
          -->
        </div>
        <div
          v-if="events.length > 0"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          <div class="flex flex-col">
            <CardBoxEvents
              v-for="(event, index) in leftItems"
              :key="'left-' + index"
              :student="event.student_ime + ' ' + event.student_prezime"
              :date="formattedDate(event.timestamp)"
              :type="event.activity_id"
              :jmbag="event.student_JMBAG"
              :email="event.student_email"
              class="rounded-lg cursor-pointer"
              @click="router.push(`/studenti/${event.instance_id}`)"
            />
          </div>
          <div class="flex flex-col">
            <CardBoxEvents
              v-for="(event, index) in rightItems"
              :key="'right-' + index"
              :student="event.student_ime + ' ' + event.student_prezime"
              :date="formattedDate(event.timestamp)"
              :type="event.activity_id"
              :jmbag="event.student_JMBAG"
              :email="event.student_email"
              class="rounded-lg cursor-pointer"
              @click="router.push(`/studenti/${event.instance_id}`)"
            />
          </div>
        </div>
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton
                v-for="page in pagesList"
                :key="page"
                :active="page === currentPage"
                :label="page + 1"
                :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                small
                @click="currentPage = page"
              />
            </BaseButtons>
            <small>Stranica {{ currentPageHuman }} od {{ numPages }}</small>
          </BaseLevel>
        </div>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
