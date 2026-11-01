<script setup>
import { mdiWeatherNight, mdiWhiteBalanceSunny } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { useUiStore } from "@/stores/ui_store";

const uiStore = useUiStore();

</script>

<template>
	<button
		type="button"
		class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-gray-700 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fipu_blue focus-visible:ring-offset-2 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
		aria-label="Tamni način rada"
		:aria-pressed="uiStore.darkMode"
		:title="uiStore.darkMode ? 'Uključi svijetli način rada' : 'Uključi tamni način rada'"
		@click="uiStore.setDarkMode()">
		<BaseIcon :path="uiStore.darkMode ? mdiWhiteBalanceSunny : mdiWeatherNight" size="22" />
	</button>
</template>
