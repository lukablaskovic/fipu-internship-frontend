<template>
  <div :style="{ left: leftPosition + 'px', top: topPosition + 'px' }"
    :class="[layoutStore.tooltip.content != '' ? 'opacity-100  delay-1000 duration-300' : 'opacity-0 delay-0 duration-0', layoutStore.tooltip.justify]"
    class="z-100 fixed pointer-events-none flex transition-opacity bg-red-500">
    <div id="tooltip"  class="tooltip flex justify-left items-left absolute w-fit">
        <span class="tooltip-text w-fit whitespace-nowrap">{{ layoutStore.tooltip.content }} </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayoutStore } from "@/stores/layout.js";
const layoutStore = useLayoutStore();

const mouseX = ref(0);
const mouseY = ref(0);
let tooltipWidth = 100; // Adjust as needed
let tooltipHeight = 30; // Adjust as needed

const handleMouseMove = (event) => {
    mouseX.value = event.clientX;
    mouseY.value = event.clientY;

    const tooltipElement = document.getElementById('tooltip');
    if (tooltipElement) {
        tooltipWidth = tooltipElement.clientWidth;
        tooltipHeight = tooltipElement.clientHeight;

        // Ensure tooltip stays within screen bounds
        leftPosition.value = Math.min(window.innerWidth - tooltipWidth/2 - 8, Math.max(0, mouseX.value + layoutStore.tooltip.offsetx));
        topPosition.value = Math.min(window.innerHeight - 30/2 + layoutStore.tooltip.offsety*2, Math.max(30/2, mouseY.value + layoutStore.tooltip.offsety));
    }
}

const leftPosition = ref(0);
const topPosition = ref(0);

onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
});

onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove);
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
