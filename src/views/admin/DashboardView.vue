<script setup>
import { ref, computed, onMounted } from "vue";
import { adminStore, mainStore } from "@/main.js";
import {
  mdiAccountMultiple,
  mdiAccountSchoolOutline,
  mdiPlayPause,
  mdiViewDashboard,
  mdiCommentProcessing,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/Cardbox/CardBoxWidget.vue";
import CardBoxEvents from "@/components/Cardbox/CardBoxEvents.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
const userAuthenticated = computed(() => mainStore.userAuthenticated);

const ongoing_internships = ref(0);
const waiting_for_allocation = ref(0);
const events = ref([]);

onMounted(async () => {
  await adminStore.getStudents();
  await adminStore.searchModels();
  ongoing_internships.value = adminStore.dashboard_data.ongoing_internships;
  waiting_for_allocation.value =
    adminStore.dashboard_data.waiting_for_allocation;
  await adminStore.getEvents();
  events.value = adminStore.events.reverse();
});

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
            trend="up"
            color="text-emerald-500"
            class="rounded-lg"
            :icon="mdiAccountSchoolOutline"
            :number="512"
            label="Uspješno odrađenih praksi"
          />
          <SkeletonLoader v-else></SkeletonLoader>

          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="up"
            color="text-blue-500"
            class="rounded-lg"
            :icon="mdiAccountMultiple"
            :number="ongoing_internships"
            label="Studenti u procesu prakse"
          />
          <SkeletonLoader v-else></SkeletonLoader>
          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="up"
            color="text-red-500"
            class="rounded-lg"
            :icon="mdiPlayPause"
            :number="waiting_for_allocation"
            label="Studenti koji čekaju alokaciju"
          />
          <SkeletonLoader v-else></SkeletonLoader>
        </div>
        <SectionTitleLineWithButton
          :icon="mdiCommentProcessing"
          title="Najnoviji događaji"
          main
        >
        </SectionTitleLineWithButton>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="flex flex-col">
            <CardBoxEvents
              v-for="(event, index) in leftItems"
              :key="'left-' + index"
              :student="event.student_name + ' ' + event.student_surname"
              :date="event.timestamp"
              :type="event.activity_id"
              :jmbag="event.student_jmbag"
              class="rounded-lg"
            />
          </div>
          <div class="flex flex-col">
            <CardBoxEvents
              v-for="(event, index) in rightItems"
              :key="'right-' + index"
              :student="event.student_name + ' ' + event.student_surname"
              :date="event.timestamp"
              :type="event.activity_id"
              :jmbag="event.student_jmbag"
              class="rounded-lg"
            />
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
