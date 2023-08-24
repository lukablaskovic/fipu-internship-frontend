<script setup>
import { computed, ref, onBeforeMount } from "vue";

import { mdiEye } from "@mdi/js";
import TableCheckboxCell from "@/components/Tables/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import LoadingOverlay from "../LoadingOverlay.vue";
import { adminStore } from "@/main.js";
import { StudentMappings, UserTaskMappings } from "@/helpers/maps";

defineProps({
  checkable: Boolean,
});

const students = computed(() => adminStore.students);

const emit = defineEmits(["show-student-diagram"]);
function showDiagram(student) {
  console.log(student);
  adminStore.showSelectedStudent(student);
  emit("show-student-diagram", student);
}

onBeforeMount(async () => {
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
</script>

<template>
  <LoadingOverlay
    :is-active="!students.length"
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
        <th>Stanje</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="student in studentsPaginated" :key="student['JMBAG']">
        <TableCheckboxCell v-if="checkable" :assignment-data="student" />

        <td data-label="JMBAG">
          {{ student["JMBAG"] }}
        </td>
        <td data-label="Ime">
          {{ student["Ime"] }}
        </td>
        <td data-label="Prezime">
          {{ student["Prezime"] }}
        </td>
        <td data-label="Email">
          {{ student["Email"] }}
        </td>
        <td data-label="Godina studija">
          {{
            StudentMappings.getYearOfStudyLabel(
              student["Godina studija"]["value"]
            )
          }}
        </td>
        <td data-label="Stanje">
          {{
            UserTaskMappings.getTaskName(
              student["process_instance_data"]["pending"][0]
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
