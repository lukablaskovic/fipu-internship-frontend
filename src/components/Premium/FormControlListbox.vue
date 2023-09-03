<script setup>
import { computed } from "vue";
import { mdiCheck } from "@mdi/js";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import BaseIcon from "@/components/BaseIcon.vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Object,
    default: null,
  },
  buttonClass: {
    type: [String, Array],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <Listbox v-slot="{ open }" v-model="computedValue">
    <div class="relative">
      <ListboxButton
        :class="[buttonClass, open ? 'ring' : '']"
        class="text-left ring-blue-700"
      >
        <span class="truncate">{{
          computedValue ? computedValue.label : "Select"
        }}</span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-50 w-full mt-2 overflow-auto text-base bg-white rounded shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 focus:outline-none sm:text-sm dark:bg-slate-800"
        >
          <ListboxOption
            v-for="option in options"
            v-slot="{ active, selected }"
            :key="option.label"
            :value="option"
            :disabled="option.unavailable"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-gray-100 dark:bg-slate-700' : '',
                option.unavailable ? 'text-gray-500 dark:text-gray-400' : '',
                'cursor-default select-none flex items-center justify-start py-2 px-3',
              ]"
            >
              <BaseIcon v-if="selected" :path="mdiCheck" class="mr-3" />
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal ml-9',
                  'block truncate',
                ]"
                >{{ option.label }}</span
              >
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
