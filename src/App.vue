<script setup>
import { RouterView } from "vue-router";
import Tooltip from '@/components/Base/Tooltip.vue';
</script>

<template>
    <Tooltip/>
    <router-view></router-view>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s;
}
.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(-100%);
}

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
