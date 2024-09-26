<script setup>
import { computed } from "vue";
import { styleStore } from "@/main.js";

import blueImage from "/background-blue.jpg";

const props = defineProps({
	bg: {
		type: String,
		required: true,
		validator: (value) => ["blue", "pinkRed"].includes(value),
	},
});

const backgroundStyle = computed(() => {
	if (styleStore.darkMode) {
		return {
			backgroundImage: `url(${blueImage})`,
		};
	}

	switch (props.bg) {
		case "blue":
			return {
				backgroundImage: `url(${blueImage})`,
			};

		default:
			return {};
	}
});
</script>

<template>
	<div class="transition-all duration-300 flex justify-center items-center w-full h-full bg-cover bg-center" :style="backgroundStyle">
		<slot card-class="shadow-2xl" />
	</div>
</template>
