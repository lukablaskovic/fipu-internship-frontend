<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import BaseIcon from "@/components/BaseIcon.vue";

const props = defineProps({
  to: {
    type: String,
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  small: Boolean,
});

const is = computed(() => (props.to ? RouterLink : "a"));
</script>

<template>
  <component
    :is="is"
    :to="to"
    :href="href"
    class="inline-flex items-center cursor-pointer"
    :class="{ 'text-sm': small }"
  >
    <BaseIcon
      v-if="icon"
      :path="icon"
      w="w-4"
      h="h-4"
      :class="[small ? 'mr-1' : 'mr-2']"
    />
    <span>{{ label }}</span>
  </component>
</template>
