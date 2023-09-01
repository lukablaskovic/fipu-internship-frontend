<script setup>
import { computed } from "vue";
import { styleStore } from "@/main.js";
import { gradientBgBlue, gradientBgDark } from "@/colors";

const props = defineProps({
  bg: {
    type: String,
    required: true,
    validator: (value) => ["blue", "pinkRed"].includes(value),
  },
});

const colorClass = computed(() => {
  if (styleStore.darkMode) {
    return gradientBgDark;
  }

  switch (props.bg) {
    case "blue":
      return gradientBgBlue;
  }

  return "";
});
</script>

<template>
  <div class="md:pl-24 md:pr-24" :class="colorClass">
    <slot card-class="shadow-2xl" />
  </div>
</template>
