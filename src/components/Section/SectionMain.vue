<script setup>
import { containerMaxW } from "@/config.js";
</script>

<template>
  <section class="p-6 bg-gray-100 dark:bg-slate-800" :class="containerMaxW">
    <slot />
  </section>
</template>
