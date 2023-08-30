<template>
  <div class="shadow rounded-md p-6 max-w-sm w-full mx-auto m-2">
    <div class="flex-1 space-y-6 py-1">
      <div class="animate-pulse h-2 rounded"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-4 gap-4">
          <div class="animate-pulse h-2 rounded col-span-3"></div>
        </div>
        <div class="animate-pulse h-2 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

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
