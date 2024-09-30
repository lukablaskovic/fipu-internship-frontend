<template>
	<button :class="['select-process-button relative flex h-32 grow flex-col items-center justify-center rounded border border-gray-300 px-8 text-sm font-semibold text-gray-700 hover:scale-105 sm:w-auto sm:text-xl md:h-40', selectedProcess === button ? 'bg-fipu_blue text-white' : 'bg-gray-50']">
		<!-- Button Text -->
		<span :class="{ 'mb-20 opacity-90 md:mb-28': hoveredButton === button, 'whitespace-nowrap text-base transition-all duration-300 md:text-lg lg:text-xl': true }">{{ button == "A" ? "Nemam poduzeće (Model A)" : "Imam već dogovoreno (Model B)" }}</span>

		<!-- Bullet points on hover for Button A -->
		<div :class="hoveredButton === button ? 'pt-8 opacity-80 delay-100' : 'opacity-0 delay-0'" class="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 text-white transition-opacity duration-300">
			<ul class="px-4 text-left text-sm md:text-base xl:text-lg">
				<li v-for="(text, index) in hoverTexts" :key="index">{{ text }}</li>
			</ul>
		</div>
	</button>
</template>
<script>
export default {
	props: {
		button: {
			typeof: String,
			default: "",
		},
		hoveredButton: {
			typeof: String,
			default: "",
		},
		selectedProcess: {
			typeof: String,
			default: "",
		},
		hoverTexts: {
			typeof: String,
			default: "",
		},
	},
};
</script>
<style scoped>
.select-process-button {
	transition:
		background-color 100ms ease-in-out,
		transform 150ms ease-in-out;
}
</style>
