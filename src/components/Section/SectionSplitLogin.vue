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
      return "bg-gradient-to-tr from-blue-500 via-blue-300 to-fipu_blue";
  }

  return "";
});
</script>

<template>
  <div class="md:px-16 lg:px-20 xl:px-28 2xl:px-36 transition-all duration-300" :class="colorClass">
    <slot card-class="shadow-2xl" />
  </div>
</template>
