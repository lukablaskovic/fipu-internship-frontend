<script setup>
defineProps({
  tip: {
    type: String,
    default: null,
  },
  left: Boolean,
  right: Boolean,
  top: Boolean,
});
</script>

<template>
  <div
    v-if="tip"
    class="absolute z-20 flex flex-col pt-1 animate-fade-in"
    :class="[
      top ? 'bottom-full flex-col-reverse' : 'top-full',
      { 'inset-x-auto': !left && !right, 'left-0': left, 'right-0': right },
    ]"
  >
    <div
      class="text-black text-opacity-80 h-3 dark:text-gray-800"
      :class="{
        'mx-auto': !left && !right,
        'ml-auto mr-1.5': right,
        'mr-auto ml-1.5': left,
      }"
    >
      <svg viewBox="0 0 100 50" width="100" height="50" class="w-auto h-3">
        <polygon
          fill="currentColor"
          :points="top ? '0,0 100,0 50,50' : '50,0 100,50 0,50'"
        />
      </svg>
    </div>
    <div
      class="bg-black bg-opacity-80 text-white text-sm rounded px-3 py-1 shadow-lg dark:bg-slate-800"
    >
      {{ tip }}
    </div>
  </div>
</template>
