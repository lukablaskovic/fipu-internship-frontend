<script setup>
defineProps({
	noPadding: Boolean,
	centeredContent: Boolean,
	verticalCentered: Boolean,
});
</script>

<template>
	<div
		class="fipu_vertical_scrollbar flex-1"
		:class="[
			{
				'p-6': !noPadding,
				'md:flex md:h-full md:w-full md:flex-col md:items-center md:justify-center': centeredContent,
				'md:flex md:h-full md:w-full md:flex-col md:justify-center': verticalCentered,
			},
		]">
		<slot></slot>
	</div>
</template>
