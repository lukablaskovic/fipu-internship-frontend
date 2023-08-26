<template>
  <CardBox>
    <div v-for="n in count" :key="n" :class="skeletonClass"></div>
  </CardBox>
</template>

<script setup>
import { ref, computed } from "vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
const props = defineProps({
  count: {
    type: Number,
    default: 4,
  },

  width: {
    type: String,
    default: "w-full",
  },
  height: {
    type: String,
    default: "h-4",
  },
  rounded: {
    type: Boolean,
    default: false,
  },
});

const baseSkeletonClass = ref("bg-gray-200 animate-pulse my-2");

const skeletonClass = computed(() => {
  return `${baseSkeletonClass.value} ${props.width} ${props.height} ${
    props.rounded ? "rounded" : ""
  }`;
});
</script>

<style>
/* Add the pulse animation */
@keyframes pulse {
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #f0f0f0;
  }
}
</style>
