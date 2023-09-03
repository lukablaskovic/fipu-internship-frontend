<script setup>
import { ref } from "vue";
import { getButtonColor } from "@/colors.js";

const props = defineProps({
  lifetime: {
    type: Number,
    required: true,
    validator: (value) => value >= 0,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    validator: (value) =>
      ["contrast", "info", "success", "warning", "danger"].indexOf(value) > -1,
  },
});

const emit = defineEmits(["cancel"]);

const isActive = ref(false);

setTimeout(() => {
  isActive.value = true;
});

if (props.lifetime) {
  setTimeout(() => {
    isActive.value = false;

    cancelEmit();
  }, props.lifetime);
}

const cancelEmit = () => {
  setTimeout(() => {
    emit("cancel", props.timestamp);
  }, 250);
};

const cancelClick = () => {
  isActive.value = false;

  if (!props.lifetime) {
    cancelEmit();
  }
};
</script>

<template>
  <transition
    enter-active-class="animate-fade-in-up-fast"
    leave-active-class="animate-fade-out-down-fast"
  >
    <div
      v-show="isActive"
      :class="getButtonColor(color, false, true)"
      class="self-end my-3 px-6 py-4 shadow overflow-hidden w-full md:rounded-xl md:w-auto md:max-w-full cursor-pointer pointer-events-auto"
      @click="cancelClick"
    >
      {{ text }}
    </div>
  </transition>
</template>
