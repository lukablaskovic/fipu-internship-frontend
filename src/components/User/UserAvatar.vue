<script setup>
import { computed } from "vue";

const props = defineProps({
	username: {
		type: String,
		default: null,
	},
	avatar: {
		type: String,
		default: null,
	},
});

const username = computed(() => props.username);
</script>

<template>
	<div>
		<img :src="avatar" :alt="username" class="rounded-full block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800 aspect-square" />
		<slot />
	</div>
</template>
