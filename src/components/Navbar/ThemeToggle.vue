<script setup>
import { computed } from "vue";
import { mdiWeatherNight, mdiWhiteBalanceSunny } from "@mdi/js";
import Tooltip from "@/components/Base/Tooltip.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { useUiStore } from "@/stores/ui_store";

defineOptions({ inheritAttrs: false });
defineProps({ iconOnly: Boolean });
const uiStore = useUiStore();
const label = computed(() => uiStore.darkMode ? "Svijetli način rada" : "Tamni način rada");

</script>

<template>
	<Tooltip :content="label">
		<button
			v-bind="$attrs"
			type="button"
			class="navbar-control inline-flex h-11 shrink-0 items-center text-fipu_gray focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-fipu_blue focus-visible:ring-offset-2 dark:text-white dark:focus-visible:ring-offset-slate-800"
			:class="iconOnly ? 'w-11 justify-center' : 'w-full gap-2 px-3 lg:w-11 lg:justify-center lg:px-0'"
			:aria-label="label"
			@click="uiStore.setDarkMode()">
			<BaseIcon :path="uiStore.darkMode ? mdiWhiteBalanceSunny : mdiWeatherNight" size="22" />
			<span v-if="!iconOnly" class="lg:hidden">{{ label }}</span>
		</button>
	</Tooltip>
</template>
