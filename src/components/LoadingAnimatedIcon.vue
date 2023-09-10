<script setup>
defineProps({
  title: {
    type: String,
    default: "Učitavanje...",
  },
  description: {
    type: String,
    default: "Može potrajati nekoliko sekundi, molimo ne zatvarajte stranicu.",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <div v-if="isActive" wire:loading>
    <div
      class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
    ></div>
  </div>
</template>

<style scoped>
.loader {
  border-top-color: #3498db;
  -webkit-animation: spinner 1.5s linear infinite;
  animation: spinner 1.5s linear infinite;
}

@-webkit-keyframes spinner {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
