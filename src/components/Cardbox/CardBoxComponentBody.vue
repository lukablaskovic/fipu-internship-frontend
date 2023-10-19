<script setup>
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
				'md:flex md:flex-col md:justify-center md:items-center md:w-full md:h-full ': centeredContent,
				'md:flex md:flex-col md:justify-center md:w-full md:h-full ': verticalCentered,
			},
		]">
		<slot></slot>
	</div>
</template>
