<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";

defineProps({
	icon: {
		type: String,
		default: null,
	},
	h: {
		type: String,
		default: null,
	},
});
</script>

<template>
	<BaseIcon :path="icon" w="w-10" :h="h" class="pointer-events-none absolute left-0 top-0 z-10 text-gray-500 dark:text-slate-400" />
</template>
