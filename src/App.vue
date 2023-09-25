<script setup>
import { RouterView } from "vue-router";
import { mainStore } from "@/main.js";
</script>

<template>
  <router-view> </router-view>
</template>

<style scoped>
/* Slide-right Transition */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s;
}
.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(-100%);
}

/* Slide-left Transition */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.5s;
}
.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(100%);
}

.page {
  position: absolute;
  top: 30px;
}
</style>
