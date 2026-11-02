<script setup>
import { mdiWeatherNight, mdiWhiteBalanceSunny } from "@mdi/js";
import Tooltip from "@/components/Base/Tooltip.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { useUiStore } from "@/stores/ui_store";

defineOptions({ inheritAttrs: false });
const uiStore = useUiStore();

</script>

<template>
	<Tooltip :content="uiStore.darkMode ? 'Uključi svijetli način rada' : 'Uključi tamni način rada'">
		<button
v-bind="$attrs"
			type="button"
			class="navbar-control inline-flex h-11 w-11 shrink-0 items-center justify-center text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fipu_blue focus-visible:ring-offset-2 dark:text-slate-100 dark:focus-visible:ring-offset-slate-800"
			aria-label="Tamni način rada"
			:aria-pressed="uiStore.darkMode"
			@click="uiStore.setDarkMode()">
			<BaseIcon :path="uiStore.darkMode ? mdiWhiteBalanceSunny : mdiWeatherNight" size="22" />
		</button>
	</Tooltip>
</template>
