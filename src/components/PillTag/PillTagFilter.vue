<script setup>
import { computed, ref, onMounted } from "vue";
import {
  mdiChevronUp,
  mdiChevronDown,
  mdiAlertCircleOutline,
  mdiFilter,
  mdiFilterCheck,
} from "@mdi/js";
import PillTag from "@/components/PillTag/PillTag.vue";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { adminStore, snackBarStore } from "@/main";

import router from "@/router";
import Utils from "@/helpers/utils.js";

import { ActivityEventMappings } from "@/helpers/maps";

const props = defineProps({
  trend: {
    type: String,
    required: true,
  },
  trendType: {
    type: String,
    default: null,
  },
  small: Boolean,

  icon: {
    type: String,
    default: null,
  },
  iconRight: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: null,
  },
  left: Boolean,
  iconW: {
    type: String,
    default: null,
  },
  iconH: {
    type: String,
    default: null,
  },
  iconSize: {
    type: [String, Number],
    default: null,
  },
  color: {
    type: String,
    default: "lightDark",
  },
  outline: Boolean,
  disabled: Boolean,
});

onMounted(() => {
  const preSelectedEvents = adminStore.dashboard_data.selectedEvents;
  selectedOptions.value = [...preSelectedEvents];

  if (preSelectedEvents.length === 0) {
    setDefaultFilters();
  }
});

const defualtEventsSet = computed(() => {
  const defaultEvents = ActivityEventMappings.events
    .filter(
      (event) =>
        !ActivityEventMappings.skipEvents.includes(event.activity_id) &&
        !ActivityEventMappings.isGatewayEvent(event.activity_id)
    )
    .map((event) => event.activity_id);
  console.log(
    "adminStore.dashboard_data.selectedEvents",
    adminStore.dashboard_data.selectedEvents
  );
  console.log("defaultEvents", defaultEvents);

  return Utils.arraysEqual(
    adminStore.dashboard_data.selectedEvents,
    defaultEvents
  );
});

const trendStyle = computed(() => {
  if (props.trendType === "up") {
    return {
      icon: mdiChevronUp,
      style: "success",
    };
  }

  if (props.trendType === "down") {
    return {
      icon: mdiChevronDown,
      style: "danger",
    };
  }

  if (props.trendType === "alert") {
    return {
      icon: mdiAlertCircleOutline,
      style: "warning",
    };
  }

  if (props.trendType === "filter") {
    return {
      icon: defualtEventsSet.value ? mdiFilter : mdiFilterCheck,
      style: defualtEventsSet.value ? "fipu_blue" : "success",
    };
  }

  const emit = defineEmits(["update:modelValue"]);

  computed({
    get: () => props.modelValue,
    set: (value) => {
      emit("update:modelValue", value);
    },
  });

  return {
    style: "info",
  };
});

const selectedOptions = ref([]);

const saveSelectedEvents = async () => {
  adminStore.setSelectedEvents(selectedOptions.value);
  console.log("Events saved:", selectedOptions.value);
  snackBarStore.pushMessage("Event-Filteri ažurirani!", "success");
  await Utils.wait(0.5);
  location.reload();
};

const setDefaultFilters = () => {
  const defaultEvents = ActivityEventMappings.events
    .filter(
      (event) =>
        !ActivityEventMappings.skipEvents.includes(event.activity_id) &&
        !ActivityEventMappings.isGatewayEvent(event.activity_id)
    )
    .map((event) => event.activity_id);
  selectedOptions.value = defaultEvents;
  adminStore.setSelectedEvents(defaultEvents);
  snackBarStore.pushMessage("Event-Filteri resetirani!", "success");
};

const toggleSelection = (option) => {
  const index = selectedOptions.value.indexOf(option.label);
  if (index === -1) {
    selectedOptions.value.push(option.label);
  } else {
    selectedOptions.value.splice(index, 1);
  }
};
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton v-slot="{ open }" :disabled="disabled">
        <PillTag
          :label="trend"
          :color="trendStyle.style"
          :icon="trendStyle.icon"
          :small="small"
          :active="open"
          :disabled="disabled"
        />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        :class="left ? 'left-0' : 'right-0'"
        class="absolute z-50 w-96 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-800 dark:divide-gray-700"
      >
        <div class="p-2">Odaberite događaje za koje želite da se prikazuju</div>
        <div
          v-for="(optionsGroup, index) in options"
          :key="index"
          class="px-1 py-1"
        >
          <MenuItem
            v-for="option in optionsGroup"
            :key="option.id"
            v-slot="{ active }"
          >
            <button
              :class="[
                option.label === 'Spremi'
                  ? 'hover:bg-emerald-500'
                  : active
                  ? 'bg-gray-100 dark:bg-slate-700'
                  : '',
                selectedOptions.includes(option.label)
                  ? 'bg-fipu_blue hover:bg-fipu_light_blue'
                  : '',
                option.label === 'Resetiraj' ? 'hover:bg-red-500' : '',
                'group flex rounded-md items-center w-full px-2 py-2 text-sm my-1',
              ]"
              :disabled="option.label === 'Spremi'"
              style="padding-left: 16px; padding-right: 16px"
              @click.prevent="
                option.label === 'Spremi'
                  ? saveSelectedEvents()
                  : option.label === 'Resetiraj'
                  ? setDefaultFilters()
                  : toggleSelection(option)
              "
            >
              <BaseIcon :path="option.icon" class="mr-3" />
              <span>{{ option.label }}</span>
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
