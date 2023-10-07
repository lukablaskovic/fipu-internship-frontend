<script setup>
const props = defineProps({
	text: {
		type: String,
		default: "",
	},
});
</script>
<template>
	<div class="mt-3 lg:mt-5 -ml-2 lg:-ml-0">
		<div class="text-xs text-gray-400 font-semibold uppercase">{{ text }}</div>
	</div>
</template>
