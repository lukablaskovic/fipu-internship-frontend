<template>
	<div
		:style="{ left: leftPosition + 'px', top: topPosition + 'px' }"
		:class="[layoutStore.tooltip.content != '' ? 'opacity-100 delay-1000 duration-300' : 'opacity-0 delay-0 duration-0', layoutStore.tooltip.justify]"
		class="pointer-events-none fixed z-100 flex bg-red-500 transition-opacity">
		<div id="tooltip" class="tooltip justify-left items-left absolute flex w-fit">
			<span class="tooltip-text w-fit whitespace-nowrap">{{ layoutStore.tooltip.content }} </span>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { layoutStore } from "@/main";

const mouseX = ref(0);
const mouseY = ref(0);
let tooltipWidth = 100;
let tooltipHeight = 30;

const handleMouseMove = (event) => {
	mouseX.value = event.clientX;
	mouseY.value = event.clientY;

	const tooltipElement = document.getElementById("tooltip");
	if (tooltipElement) {
		tooltipWidth = tooltipElement.clientWidth;
		tooltipHeight = tooltipElement.clientHeight;

		leftPosition.value = Math.min(window.innerWidth - tooltipWidth / 2 - 8, Math.max(0, mouseX.value + layoutStore.tooltip.offsetx));
		topPosition.value = Math.min(window.innerHeight - 30 / 2 + layoutStore.tooltip.offsety * 2, Math.max(30 / 2, mouseY.value + layoutStore.tooltip.offsety));
	}
};

const leftPosition = ref(0);
const topPosition = ref(0);

onMounted(() => {
	window.addEventListener("mousemove", handleMouseMove);
});

onBeforeUnmount(() => {
	window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style scoped>
.tooltip {
	background-color: #333;
	color: #fff;
	padding: 5px;
	border-radius: 5px;
}

.tooltip-text {
	font-size: 14px;
}
</style>
