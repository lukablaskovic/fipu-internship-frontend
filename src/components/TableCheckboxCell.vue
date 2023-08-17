<script setup>
import { ref, watch } from "vue";

defineProps({
  type: {
    type: String,
    default: "td",
  },
  disabled: Boolean,
});

const emit = defineEmits(["checked"]);

const checked = ref(false);

watch(checked, (newVal) => {
  emit("checked", newVal);
});
</script>

<template>
  <component :is="type" class="lg:w-1">
    <label :class="{ 'opacity-50': disabled }" class="checkbox">
      <input v-model="checked" type="checkbox" :disabled="disabled" />
      <span class="check" />
    </label>
  </component>
</template>
