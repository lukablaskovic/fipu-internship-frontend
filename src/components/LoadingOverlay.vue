<script setup>
import LoadingAnimatedIcon from "@/components/LoadingAnimatedIcon.vue";
defineProps({
	title: {
		type: String,
		default: "Učitavanje...",
	},
	description: {
		type: String,
		default: "Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu.",
	},
	isActive: {
		type: Boolean,
		default: true,
	},
});
</script>

<template>
	<div v-if="isActive" wire:loading class="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-700 opacity-75">
		<LoadingAnimatedIcon />
		<h2 class="text-center text-xl font-semibold text-white">{{ title }}</h2>
		<p class="w-1/3 text-center text-white">
			{{ description }}
		</p>
	</div>
</template>
