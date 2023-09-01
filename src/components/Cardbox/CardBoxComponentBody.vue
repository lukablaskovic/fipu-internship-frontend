<script setup>
defineProps({
  noPadding: Boolean,
  centeredContent: Boolean,
});
</script>

<template>
  <div
    class="flex-1"
    :class="{
      'p-6': !noPadding,
      'flex flex-col justify-center items-center w-full h-screen':
        centeredContent,
    }"
  >
    <slot />
  </div>
</template>
