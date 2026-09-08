<script setup>
import Tooltip from "@/components/Base/Tooltip.vue";
import MaintenanceNotice from "@/components/Notification/MaintenanceNotice.vue";
</script>

<template>
	<!--<GlobalStoreDebug />-->

	<Tooltip />
	<router-view :key="$route.fullPath"></router-view>
	<MaintenanceNotice />
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
