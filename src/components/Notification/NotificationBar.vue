<script setup>
import { ref, computed, useSlots } from "vue";
import { mdiClose } from "@mdi/js";
import { colorsBgLight, colorsOutline } from "@/colors.js";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import Utils from "@/helpers/utils.js";

const color = ref("");
const icon = ref(null);
const isDismissed = ref(true);

const props = defineProps({
  outline: Boolean,
});

const componentClass = computed(() => {
  return props.outline
    ? colorsOutline[color.value]
    : colorsBgLight[color.value];
});

const dismiss = () => {
  isDismissed.value = true;
};

async function show() {
  isDismissed.value = false;
  await Utils.wait(3);
  dismiss();
}

defineExpose({
  color,
  icon,
  show,
  dismiss,
});

const slots = useSlots();

const hasRightSlot = computed(() => slots.right);
</script>

<template>
  <div
    v-if="!isDismissed"
    :class="componentClass"
    class="px-3 py-6 md:py-3 mb-6 last:mb-0 border rounded-lg transition-colors duration-150"
  >
    <BaseLevel>
      <div class="flex flex-col md:flex-row items-center">
        <BaseIcon
          v-if="icon"
          :path="icon"
          w="w-10 md:w-5"
          h="h-10 md:h-5"
          size="24"
          class="md:mr-2"
        />
        <span class="text-center md:text-left md:py-2"><slot /></span>
      </div>
      <slot v-if="hasRightSlot" name="right" />
      <BaseButton
        v-else
        :icon="mdiClose"
        small
        rounded-full
        color="white"
        @click="dismiss"
      />
    </BaseLevel>
  </div>
</template>
