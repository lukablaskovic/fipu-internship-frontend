<script setup>
const emit = defineEmits(["select"]);

defineProps({
	selected: Boolean,
	name: {
		type: String,
		default: "",
	},
});
</script>
<template>
	<div :class="selected ? 'text-fipu_blue underline' : 'hover:text-white cursor-pointer'" class="px-4 py-1 font-medium" @click="emit('select')">
		{{ name }}
	</div>
</template>
