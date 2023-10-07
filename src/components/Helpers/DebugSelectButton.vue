<script setup>
import { mainStore } from "@/main.js";

defineProps({
	name: {
		type: String,
		default: "",
	},
});
</script>
<template>
	<div :class="mainStore.storeSelected == name ? 'text-fipu_blue underline' : 'hover:text-white cursor-pointer'" class="px-4 py-1 font-medium" @click="mainStore.storeSelected = name">
		{{ name }}
	</div>
</template>
