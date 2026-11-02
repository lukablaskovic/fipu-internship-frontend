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
	<div :class="[display, uiStore.navBarItemLabelStyle, useMargin ? 'my-2 mx-3' : 'py-2 px-3']" class="navbar-control h-11 self-center items-center cursor-pointer dark:text-white">
		<slot />
	</div>
</template>
