<script setup>
import MaintenanceNotice from "@/components/Notification/MaintenanceNotice.vue";
import { TooltipProvider } from "reka-ui";
import { DEV_MODE } from "@/config";
</script>

<template>
	<!--<GlobalStoreDebug />-->

	<TooltipProvider :delay-duration="1000">
		<router-view :key="$route.fullPath"></router-view>
		<MaintenanceNotice v-if="!DEV_MODE && $route.name && $route.name !== 'maintenance'" />
	</TooltipProvider>
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
