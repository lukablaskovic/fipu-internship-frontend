<template>
  <tr>
    <td v-if="props.checkable" class="animate-pulse bg-pulse">
      <!-- Skeleton for Checkbox -->
      <div class="h-4 w-4 rounded bg-gray-300"></div>
    </td>
    <td class="animate-pulse bg-pulse">
      <!-- Skeleton for Name -->
      <div class="h-4 w-24 rounded bg-gray-300"></div>
    </td>
    <td class="animate-pulse bg-pulse flex items-center justify-center">
      <!-- Skeleton for Status -->
      <div class="h-8 w-8 rounded-full bg-gray-300"></div>
    </td>
    <td class="animate-pulse bg-pulse">
      <!-- Skeleton for Message -->
      <div class="h-4 w-36 rounded bg-gray-300"></div>
    </td>
    <td class="animate-pulse bg-pulse">
      <!-- Skeleton for URL -->
      <div class="h-4 w-40 rounded bg-gray-300"></div>
    </td>
    <td class="animate-pulse bg-pulse">
      <!-- Skeleton for URL -->
      <div class="h-4 w-40 rounded bg-gray-300"></div>
    </td>
    <td class="animate-pulse bg-pulse">
      <!-- Skeleton for Actions -->
      <div class="flex gap-2">
        <div class="h-8 w-8 rounded bg-gray-300"></div>
        <div class="h-8 w-8 rounded bg-gray-300"></div>
      </div>
    </td>
  </tr>
</template>

<script setup>
const props = defineProps({
  checkable: Boolean,
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
