<script setup>
import { computed, ref, onBeforeMount } from "vue";

import { mdiEye } from "@mdi/js";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { adminStore } from "@/main.js";
import { StudentMappings, UserTaskMappings } from "@/helpers/maps";
import { useRoute } from "vue-router";
import UserAvatar from "@/components/User/UserAvatar.vue";
const route = useRoute();

defineProps({
  checkable: Boolean,
});

const students = computed(() => adminStore.students);
const selectedStudentInstanceID = ref(null);

const studentsFetched = computed(() => adminStore.studentsFetched);
const emit = defineEmits(["show-student-diagram"]);

function showDiagram(student) {
  console.log("student", student);
  selectedStudentInstanceID.value = student["process_instance_id"];

  adminStore.setSelectedStudent(student);
  emit("show-student-diagram", student);
}

onBeforeMount(async () => {
  if (route.params.process_instance_id) {
    selectedStudentInstanceID.value = route.params.process_instance_id;
    adminStore.setSelectedStudent(
      students.value.find(
        (student) =>
          student["process_instance_id"] === route.params.process_instance_id
      )
    );
  }
  console.log("adminStore.selectedStudent", adminStore.selectedStudent);
  await adminStore.getStudents();
});

const perPage = ref(5);
const currentPage = ref(0);
const studentsPaginated = computed(() =>
  students.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() =>
  Math.ceil(students.value.length / perPage.value)
);
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

function getProgressValue(student) {
  return UserTaskMappings.getTaskProperty(
    student["process_instance_data"]["pending"][0],
    "order",
    student["process_instance_data"]["state"]
  );
}
</script>

<template>
  <LoadingOverlay
    :is-active="!studentsFetched"
    title="Učitavanje..."
    description="Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu."
  >
  </LoadingOverlay>
  <table>
    <thead>
      <tr>
        <th>JMBAG</th>
        <th>Ime</th>
        <th>Prezime</th>
        <th>Email</th>
        <th>Godina studija</th>
        <th>Napredak</th>
        <th>Trenutno stanje</th>
        <th />
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="student in studentsPaginated"
        :key="student['JMBAG']"
        :class="{
          'selected-row':
            selectedStudentInstanceID === student['process_instance_id'],
        }"
      >
        <!--
        <td v-if="student['avatar'][0]" class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar
            :avatar="student['avatar'][0]['url']"
            class="w-8 h-8 mx-auto"
          />
        </td>
        -->
        <td data-label="JMBAG">
          {{ student["JMBAG"] }}
        </td>
        <td data-label="Ime">
          {{ student["ime"] }}
        </td>
        <td data-label="Prezime">
          {{ student["prezime"] }}
        </td>
        <td data-label="Email">
          {{ student["email"] }}
        </td>
        <td data-label="Godina studija">
          {{
            StudentMappings.getGodinaStudija(student["godina_studija"]["value"])
          }}
        </td>

        <td data-label="Progress" class="lg:w-32">
          <progress
            class="flex w-2/5 self-center lg:w-full"
            :class="{
              'progress-red': getProgressValue(student) <= 2,
              'progress-yellow': getProgressValue(student) == 3,
              'progress-green': getProgressValue(student) >= 4,
            }"
            max="5"
            :value="getProgressValue(student)"
          >
            {{ getProgressValue(student) }}
          </progress>
        </td>
        <td data-label="Stanje">
          {{
            UserTaskMappings.getTaskProperty(
              student["process_instance_data"]["pending"][0],
              "name",
              student["process_instance_data"]["state"]
            )
          }}
        </td>

        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="fipu_blue"
              :icon="mdiEye"
              small
              @click="showDiagram(student)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>

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
</template>
