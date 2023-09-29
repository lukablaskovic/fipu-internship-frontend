<script setup>
defineProps({
    zIndex: {
        type: String,
        default: "z-50",
    },
    type: {
        type: String,
        default: "flex",
    },
});
const emit = defineEmits(["overlay-click"]);

const overlayClick = (event) => {
    emit("overlay-click", event);
};
</script>

<template>
<div :class="[type, zIndex, type == 'pointer-events-none'  ? 'opacity-0' : 'opacity-100']" 
    class="items-center flex justify-center overflow-hidden fixed inset-0 transition-opacity duration-300 ease-in-out">
    <transition
        enter-active-class="transition duration-150 ease-in"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div class="absolute inset-0 bg-gradient-to-tr opacity-90 from-gray-700 via-gray-800 to-gray-900 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900" @click="overlayClick" />
    </transition>
    <transition
        class="relative"
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="animate-fade-out">
        <slot :assignment="modelValue"></slot>
    </transition>
</div>
</template>
