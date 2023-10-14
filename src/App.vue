<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { useRouter, RouterView } from "vue-router";

import { Control } from "@/services/microservices_control";
import Tooltip from "@/components/Base/Tooltip.vue";
import { mainStore } from "./main";

//import GlobalStoreDebug from "@/components/Helpers/GlobalStoreDebug.vue";

const serviceStatuses = ref({});
const REFRESH_INTERVAL = 0.1;
let intervalId;
const router = useRouter();

onMounted(async () => {
	serviceStatuses.value = await Control.checkAllServiceStatuses();

	intervalId = setInterval(async () => {
		serviceStatuses.value = await Control.checkAllServiceStatuses();
	}, REFRESH_INTERVAL * 60 * 1000);
});

onUnmounted(() => {
	clearInterval(intervalId);
});

watchEffect(() => {
	const downServices = Object.entries(serviceStatuses.value).filter(([, status]) => status.status !== "OK");

	if (downServices.length > 0) {
		console.warn("Some services are down:", downServices);
		router.push({ name: "ErrorView" }).catch((err) => {});
		mainStore.servicesUp = false;
	} else {
		mainStore.servicesUp = true;
	}
});
</script>

<template>
	<!--<GlobalStoreDebug />-->
	<Tooltip />
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
