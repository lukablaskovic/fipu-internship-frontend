<script setup>
import { ref, computed } from "vue";

const props = defineProps({
	src: {
		type: String,
		required: true,
	},
	alt: {
		type: String,
		default: "",
	},
	w: {
		type: String,
		default: "w-6",
	},
	h: {
		type: String,
		default: "h-6",
	},
	size: {
		type: [String, Number],
		default: null,
	},
});

const isLoaded = ref(false);

const spanClass = computed(() => `inline-flex justify-center items-center ${props.w} ${props.h}`);

const imgSize = computed(() => props.size ?? 16);

const handleImageLoad = () => {
	isLoaded.value = true;
};
</script>

<template>
	<span :class="spanClass">
		<img :src="src" :alt="alt" :width="imgSize" :height="imgSize" class="inline-block rounded-full transition-opacity duration-500 ease-in-out" :class="{ 'opacity-0': !isLoaded, 'opacity-100': isLoaded }" @load="handleImageLoad" />
		<slot />
	</span>
</template>
