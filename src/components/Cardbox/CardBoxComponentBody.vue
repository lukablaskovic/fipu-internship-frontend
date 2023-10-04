<script setup>
import { styleStore } from "@/main.js";
defineProps({
	noPadding: Boolean,
	centeredContent: Boolean,
	verticalCentered: Boolean,
});
</script>

<template>
	<div
		class="flex-1 fipu_vertical_scrollbar"
		:class="[
			{
				'p-6 ': !noPadding,
				'flex flex-col justify-center items-center w-full h-full': centeredContent,
				'flex flex-col justify-center w-full h-full': verticalCentered,
			},
		]">
		<slot></slot>
	</div>
</template>
