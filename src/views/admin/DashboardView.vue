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
import CardBoxTransaction from "@/components/Cardbox/CardBoxTransaction.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
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
  events.value = adminStore.events;
  console.log(events.value);
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
            color="text-emerald-500"
            :icon="mdiAccountSchoolOutline"
            :number="512"
            label="Uspješno odrađenih praksi"
          />
          <SkeletonLoader v-else></SkeletonLoader>

          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            color="text-blue-500"
            :icon="mdiAccountMultiple"
            :number="ongoing_internships"
            label="Studenti u procesu prakse"
          />
          <SkeletonLoader v-else></SkeletonLoader>
          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            color="text-red-500"
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
          <div class="flex flex-col justify-between">
            <CardBoxTransaction
              v-for="(event, index) in events"
              :key="index"
              :student="event.student_name + ' ' + event.student_surname"
              :date="event.timestamp"
              :type="event.activity_id"
              :jmbag="event.student_jmbag"
              :account="event.account"
            />
          </div>
        </div>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
