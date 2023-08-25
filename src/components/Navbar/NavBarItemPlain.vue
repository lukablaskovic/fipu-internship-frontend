<script setup>
import { styleStore } from "@/main";

defineProps({
  display: {
    type: String,
    default: "flex",
  },
  useMargin: Boolean,
});
</script>

<template>
  <div
    :class="[
      display,
      styleStore.navBarItemLabelStyle,
      styleStore.navBarItemLabelHoverStyle,
      useMargin ? 'my-2 mx-3' : 'py-2 px-3',
    ]"
    class="items-center cursor-pointer dark:text-white dark:hover:text-slate-400"
  >
    <slot />
  </div>
</template>
