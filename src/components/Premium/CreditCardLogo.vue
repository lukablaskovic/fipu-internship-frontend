<script setup>
defineProps({
  cardType: {
    type: String,
    required: true,
    validator: (value) => ["mc", "visa"].indexOf(value) > -1,
  },
});
</script>

<template>
  <div
    class="flex items-center justify-center h-12 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg"
  >
    <img
      v-if="cardType === 'mc'"
      src="@/assets/svg/mc-light-bg.svg"
      class="dark:grayscale h-8 md:h-10"
    />
    <img
      v-else-if="cardType === 'visa'"
      src="@/assets/svg/visa-blue.svg"
      class="dark:grayscale dark:invert"
    />
  </div>
</template>
