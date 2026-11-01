<script setup>
import { useUiStore } from "@/stores/ui_store";

const uiStore = useUiStore();


defineProps({
	display: {
		type: String,
		default: "flex",
	},
	useMargin: Boolean,
});
</script>

<template>
	<div :class="[display, uiStore.navBarItemLabelStyle, uiStore.navBarItemLabelHoverStyle, useMargin ? 'my-2 mx-3' : 'py-2 px-3']" class="items-center cursor-pointer dark:text-white dark:hover:text-slate-400">
		<slot />
	</div>
</template>
