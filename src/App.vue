<script setup>
import MaintenanceNotice from "@/components/Notification/MaintenanceNotice.vue";
import { Tooltip } from "reka-ui/namespaced";
import { DEV_MODE } from "@/config";
</script>

<template>
	<!--<GlobalStoreDebug />-->

	<Tooltip.Provider :delay-duration="1000">
		<router-view v-slot="{ Component, route }">
			<Transition name="page-fade" mode="out-in">
				<!-- A DOM root also supports pages with fragments or Suspense. -->
				<div v-if="Component" :key="route.fullPath" class="min-h-screen">
					<component :is="Component" />
				</div>
			</Transition>
		</router-view>
		<MaintenanceNotice v-if="!DEV_MODE && $route.name && $route.name !== 'maintenance'" />
	</Tooltip.Provider>
</template>

<style scoped>
.page-fade-enter-active {
	transition: opacity 160ms ease-out;
}
.page-fade-leave-active {
	transition: opacity 90ms ease-in;
	pointer-events: none;
}
.page-fade-enter-from,
.page-fade-leave-to {
	opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
	.page-fade-enter-active,
	.page-fade-leave-active {
		transition: none;
	}
}
</style>
