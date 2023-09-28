<script setup>
defineProps({
  noPadding: Boolean,
  centeredContent: Boolean,
  verticalCentered: Boolean,
});
</script>

<template>
  <div
    class="flex-1"
    :class="{
      'p-6 ': !noPadding,
      'flex flex-col justify-end items-center w-full h-full': centeredContent,
      'flex flex-col justify-center w-full h-full': verticalCentered,
    }"
  >
    <slot />
  </div>
</template>
