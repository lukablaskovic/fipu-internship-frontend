<script setup>
import { layoutStore } from "@/main";
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
	<div v-if="isActive" @mouseover="layoutStore.tooltip.content = ''" wire:loading class="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-700 opacity-75">
		<div class="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
		<h2 class="text-center text-xl font-semibold text-white">{{ title }}</h2>
		<p class="w-1/3 text-center text-white">
			{{ description }}
		</p>
	</div>
</template>

<style scoped>
.loader {
	border-top-color: #3498db;
	-webkit-animation: spinner 1.5s linear infinite;
	animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
	0% {
		-webkit-transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
	}
}

@keyframes spinner {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
