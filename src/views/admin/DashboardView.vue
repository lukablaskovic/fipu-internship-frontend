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
import CardBoxClient from "@/components/Cardbox/CardBoxClient.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import SkeletonLoader from "@/components/SkeletonLoader.vue";
const clientBarItems = computed(() => mainStore.clients.slice(0, 4));
const userAuthenticated = computed(() => mainStore.userAuthenticated);
const transactionBarItems = computed(() => mainStore.history);

const ongoing_internships = ref(0);
const waiting_for_allocation = ref(0);

onMounted(async () => {
  await adminStore.getStudents();
  await adminStore.searchModels();
  ongoing_internships.value = adminStore.dashboard_data.ongoing_internships;
  waiting_for_allocation.value =
    adminStore.dashboard_data.waiting_for_allocation;
  console.log(ongoing_internships.value);
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
            trend="12%"
            trend-type="up"
            color="text-emerald-500"
            :icon="mdiAccountSchoolOutline"
            :number="512"
            label="Uspješno odrađenih praksi"
          />
          <SkeletonLoader v-else></SkeletonLoader>

          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="12%"
            trend-type="down"
            color="text-blue-500"
            :icon="mdiAccountMultiple"
            :number="ongoing_internships"
            label="Studenti u procesu prakse"
          />
          <SkeletonLoader v-else></SkeletonLoader>
          <CardBoxWidget
            v-if="adminStore.studentsFetched"
            trend="Upozorenje"
            trend-type="alert"
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
              v-for="(transaction, index) in transactionBarItems"
              :key="index"
              :amount="transaction.amount"
              :date="transaction.date"
              :business="transaction.business"
              :type="transaction.type"
              :name="transaction.name"
              :account="transaction.account"
            />
          </div>
          <div class="flex flex-col justify-between">
            <CardBoxClient
              v-for="client in clientBarItems"
              :key="client.id"
              :name="client.name"
              :login="client.login"
              :date="client.created"
              :progress="client.progress"
            />
          </div>
        </div>
      </SectionMain>
    </LayoutAuthenticated>
  </div>
</template>
