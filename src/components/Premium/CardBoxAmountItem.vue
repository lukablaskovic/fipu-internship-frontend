<script setup>
import BaseDivider from "@/components/BaseDivider.vue";
import PillTagTrend from "@/components/PillTagTrend.vue";
import IconRounded from "@/components/IconRounded.vue";

defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  divider: Boolean,
  trend: {
    type: String,
    default: null,
  },
  trendType: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  iconType: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <div class="mb-3">
    <PillTagTrend v-if="trend" :trend="trend" :trend-type="trendType" small />
  </div>
  <div v-bind="$attrs" :class="{ 'flex justify-between items-center': icon }">
    <div class="space-y-3">
      <h4 class="text-gray-500 dark:text-gray-400">
        {{ title }}
      </h4>
      <h3 class="text-xl">
        {{ value }}
      </h3>
    </div>
    <IconRounded v-if="icon" :icon="icon" :color="iconType" bg />
  </div>
  <BaseDivider v-if="divider" />
</template>
