<template>
  <Combobox v-model="selectedValue">
    <div class="relative">
      <div
        class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm"
      >
        <ComboboxInput
          v-model="displayValue"
          placeholder="CTRL + k ili [ / ] za pretraživanje"
          class="inputClass w-64 md:w-96 border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
          autocomplete="off"
          @change="query = $event.target.value"
        />
        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <MdiMagnify
            class="h-5 w-5 text-gray-700 hover:text-fipu_blue"
            aria-hidden="true"
          />
        </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <!-- Display help when query doesn't match any specific command -->
          <div
            v-if="query === ''"
            class="relative cursor-default select-none py-2 px-4 text-gray-700"
          >
            <b>Kratke upute kako koristiti tražilicu</b>
            <hr />
            <br />
            <div
              v-for="helpItem in helpItems"
              :key="helpItem.prefix"
              class="cursor-pointer hover:bg-fipu_blue hover:text-white py-1 px-2 rounded"
              @click="insertPrefix(helpItem.prefix)"
            >
              <b class="bg-fipu_blue px-0.5">{{ helpItem.prefix }}</b>
              {{ helpItem.description }}
            </div>
          </div>

          <!-- Display "No results found" when there's no matching data -->
          <div
            v-else-if="filteredResults.length === 0"
            class="relative cursor-default select-none py-2 px-4 text-gray-700"
          >
            Nema rezultata.
          </div>

          <ComboboxOption
            v-for="result in filteredResults"
            :key="result.id"
            v-slot="{ selected, active }"
            as="template"
            :value="result"
          >
            <li
              tabindex="0"
              class="relative cursor-pointer select-none py-2 pl-10 pr-4"
              :class="{
                'bg-fipu_blue text-white': active,
                'text-gray-900': !active,
              }"
            >
              <MdiAccount
                class="absolute left-3 h-5 w-5"
                :class="{ 'text-white': active, 'text-gray-900': !active }"
                aria-hidden="true"
              />
              <span
                class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
              >
                {{ result.ime }} {{ result.prezime }} ({{ result.JMBAG }}) -
                {{ result.email }}
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { adminStore } from "@/main";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import { router } from "@/router";

import MdiMagnify from "vue-material-design-icons/Magnify.vue";
import MdiAccount from "vue-material-design-icons/Account.vue";

const events = [{ id: 1, name: "Some event" }];
const searchInput = ref(null);

let selectedValue = ref("");

function insertPrefix(prefix) {
  query.value = prefix; // Set the input's value to the clicked prefix
  // Optionally, if you want the focus to go back to the input after clicking
  const searchInputElement = document.querySelector(".inputClass");
  searchInputElement && searchInputElement.focus();
}

let displayValue = computed(() => {
  if (!selectedValue.value) return query.value;
  return selectedValue.value.name;
});

onMounted(() => {
  function onKeydown(event) {
    if (event.key === "/") {
      event.preventDefault();
      searchInput.value = document.querySelector(".inputClass");
      searchInput.value && searchInput.value.focus();
    }

    // Check for the 'CTRL + K' combination
    if (event.key.toLowerCase() === "k" && event.ctrlKey) {
      event.preventDefault(); // Prevent default behavior
      searchInput.value = document.querySelector(".inputClass");
      searchInput.value && searchInput.value.focus();
    }
  }
  document.addEventListener("keydown", (e) => {
    console.log("Key pressed:", e.key);
  });

  document.addEventListener("keydown", onKeydown);

  onUnmounted(() => {
    document.removeEventListener("keydown", onKeydown);
  });
});

let query = ref("");

//Currently not in use
let studentData = computed(() => {
  return adminStore.students.map(
    (student) => student.process_instance_data.variables
  );
});

let filteredResults = computed(() => {
  const searchTerm = query.value.slice(2).toLowerCase().replace(/\s+/g, "");
  console.log("query", query.value);
  console.log("adminStore.students", adminStore.students);

  if (query.value.toLowerCase().startsWith("s:")) {
    return adminStore.students.filter(
      (student) =>
        student.ime.toLowerCase().replace(/\s+/g, "").includes(searchTerm) ||
        student.prezime.toLowerCase().replace(/\s+/g, "").includes(searchTerm)
    );
  } else if (query.value.startsWith("se:")) {
    return adminStore.students.filter((student) =>
      student.email.toLowerCase().replace(/\s+/g, "").includes(searchTerm)
    );
  } else if (query.value.startsWith("sj:")) {
    return adminStore.students.filter((student) =>
      student.JMBAG.toLowerCase().replace(/\s+/g, "").includes(searchTerm)
    );
  } else {
    return [];
  }
});

watch(selectedValue, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    navigateToStudent(newValue);
  }
});

function navigateToStudent(student) {
  const instanceId = student.process_instance_data.id;
  console.log("Navigating to student with instanceId:", instanceId);
  router.push(`/studenti/${instanceId}`);
}

const helpItems = [
  { prefix: "s:", description: "pretraži studenta po imenu i prezimenu" },
  { prefix: "sj:", description: "pretraži studenta po JMBAGu" },
  { prefix: "se:", description: "pretraži studenta po emailu" },
  { prefix: "t:", description: "za pretraživanje po trenutnom tasku" },
  { prefix: "p:", description: "za pretraživanje po poduzeću" },
  { prefix: "e:", description: "za pretraživanje eventa" },
];
</script>
