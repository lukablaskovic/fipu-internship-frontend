<script setup>
import { colorsText, colorsBgLight } from "@/colors.js";
import BaseIcon from "@/components/Base/BaseIcon.vue";

defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: null,
  },
  w: {
    type: String,
    default: "w-12",
  },
  h: {
    type: String,
    default: "h-12",
  },
  bg: Boolean,
});
</script>

<template>
  <BaseIcon
    :path="icon"
    :w="w"
    :h="h"
    :size="color == 'fipu_blue' ? 24 : 48"
    class="rounded-full"
    :class="bg ? colorsBgLight[color] : [colorsText[color], 'bg-transparent', color == 'fipu_blue' ? '' : '']"
  />
</template>
