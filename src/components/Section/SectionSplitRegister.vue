<script setup>
import { computed } from "vue";
import { styleStore } from "@/main.js";
import { gradientBgBlue, gradientBgDark } from "@/colors";

const props = defineProps({
	bg: {
		type: String,
		required: true,
		validator: (value) => ["blue", "pinkRed"].includes(value),
	},
});

const colorClass = computed(() => {
	if (styleStore.darkMode) {
		return gradientBgDark;
	}

	switch (props.bg) {
		case "blue":
			return gradientBgBlue;
	}

	return "";
});
</script>

<template>
	<div class="md:px-12 transition-all duration-300 flex justify-center" :class="colorClass">
		<slot card-class="shadow-2xl" />
	</div>
</template>
