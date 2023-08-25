<script setup>
import { containerMaxW } from "@/config.js";
</script>

<template>
  <section class="p-6 bg-gray-100 dark:bg-inherit" :class="containerMaxW">
    <slot />
  </section>
</template>
