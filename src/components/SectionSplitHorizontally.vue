<script setup>
import { computed } from "vue";
import { useStyleStore } from "@/stores/style_store.js";
import { gradientBgBlue, gradientBgDark, gradientBgPinkRed } from "@/colors";

const props = defineProps({
  bg: {
    type: String,
    required: true,
    validator: (value) => ["blue", "pinkRed"].includes(value),
  },
});

const colorClass = computed(() => {
  if (useStyleStore().darkMode) {
    return gradientBgDark;
  }

  switch (props.bg) {
    case "blue":
      return gradientBgBlue;
    case "pinkRed":
      return gradientBgPinkRed;
  }

  return "";
});
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center"
    :class="colorClass"
  >
    <slot card-class="shadow-2xl" />
  </div>
</template>
