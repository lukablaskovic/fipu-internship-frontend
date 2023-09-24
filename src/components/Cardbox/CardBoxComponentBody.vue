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
      'flex flex-col justify-center items-center w-full h-screen':
        centeredContent,
      'flex flex-col justify-center w-full h-screen': verticalCentered,
    }"
  >
    <slot />
  </div>
</template>
