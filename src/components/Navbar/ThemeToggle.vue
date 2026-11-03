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
			class="navbar-control inline-flex h-11 w-full shrink-0 items-center gap-2 px-3 lg:w-11 lg:justify-center lg:px-0 text-fipu_gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fipu_blue focus-visible:ring-offset-2 dark:text-white dark:focus-visible:ring-offset-slate-800"
			aria-label="Tamni način rada"
			:aria-pressed="uiStore.darkMode"
			@click="uiStore.setDarkMode()">
			<BaseIcon :path="uiStore.darkMode ? mdiWhiteBalanceSunny : mdiWeatherNight" size="22" />
			<span class="lg:hidden">Tamni način rada</span>
		</button>
	</Tooltip>
</template>
