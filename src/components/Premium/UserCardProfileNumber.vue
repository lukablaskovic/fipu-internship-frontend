<script setup>
import NumberDynamic from "@/components/NumberDynamic.vue";

defineProps({
  number: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="text-center">
    <h2 class="text-xl font-medium">
      <NumberDynamic :value="number" />
    </h2>
    <p class="text-xs uppercase">{{ label }}</p>
  </div>
</template>
