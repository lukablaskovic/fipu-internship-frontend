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
            <div>
              <b class="bg-fipu_blue px-0.5">s:</b> pretraži studenta po imenu i
              prezimenu
            </div>
            <div>
              <b class="bg-fipu_blue px-0.5">sj:</b> pretraži studenta po JMBAGu
            </div>
            <div>
              <b class="bg-fipu_blue px-0.5">se:</b> pretraži studenta po emailu
            </div>
            <div>
              <b class="bg-fipu_blue px-0.5">t:</b> za pretraživanje po
              trenutnom tasku
            </div>
            <div>
              <b class="bg-fipu_blue px-0.5">p:</b> za pretraživanje po poduzeću
            </div>
            <div>
              <b class="bg-fipu_blue px-0.5">e:</b> za pretraživanje eventa
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
            @select="selectedValue = $event"
          >
            <li
              class="relative cursor-default select-none py-2 pl-10 pr-4"
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
                {{ result.name }}
              </span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
                :class="{ 'text-white': active, 'text-fipu_blue': !active }"
              >
                <MdiCheck class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import MdiCheck from "vue-material-design-icons/Check.vue";
import MdiMagnify from "vue-material-design-icons/Magnify.vue";
import MdiAccount from "vue-material-design-icons/Account.vue";

const people = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];
const events = [{ id: 1, name: "Some event" }];
const searchInput = ref(null);

let selectedValue = ref("");

let displayValue = computed(() => {
  if (!selectedValue.value) return "";
  return selectedValue.value.name;
});

onMounted(() => {
  function onKeydown(event) {
    // Check for the '/' key
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

  document.addEventListener("keydown", onKeydown);

  onUnmounted(() => {
    document.removeEventListener("keydown", onKeydown);
  });
});

let selected = ref();
let query = ref("");

let filteredResults = computed(() => {
  // Handle search for students
  if (query.value.toLowerCase().startsWith("s:")) {
    const searchTerm = query.value.slice(2).toLowerCase().replace(/\s+/g, "");
    console.log(searchTerm);
    return people.filter((person) =>
      person.name.toLowerCase().replace(/\s+/g, "").includes(searchTerm)
    );
  }
  // Handle search for events (you'll need to have a list of events defined somewhere)
  else if (query.value.startsWith("e:")) {
    const searchTerm = query.value.slice(2).toLowerCase().replace(/\s+/g, "");
    // Assuming you have an "events" array defined similarly to the "people" array
    return events.filter((event) =>
      event.name.toLowerCase().replace(/\s+/g, "").includes(searchTerm)
    );
  }
  // If the query doesn't start with "s:" or "e:", return an empty array
  else {
    return [];
  }
});
</script>
