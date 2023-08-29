<script setup>
import { computed } from "vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";
import CardBoxComponentTitle from "@/components/Cardbox/CardBoxComponentTitle.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  button: {
    type: String,
    default: "fipu_blue",
  },
  buttonLabel: {
    type: String,
    default: "Done",
  },
  hasCancel: Boolean,
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null,
  },
  disabledCondition: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "cancel", "confirm"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const confirmCancel = (mode) => {
  value.value = false;
  emit(mode);
};

const confirm = () => confirmCancel("confirm");

const cancel = () => confirmCancel("cancel");

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && value.value) {
    cancel();
  }
});
</script>

<template>
  <OverlayLayer v-show="value" @overlay-click="cancel">
    <CardBox
      v-show="value"
      class="shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50 modal-scrollable"
      is-modal
    >
      <CardBoxComponentTitle :title="title"> </CardBoxComponentTitle>
      <slot :assignment="modelValue"></slot>
      <BaseButtons class="justify-center">
        <BaseButton
          :label="buttonLabel"
          :color="button"
          :disabled="disabledCondition"
          @click="confirm"
        />
        <BaseButton
          v-if="hasCancel"
          label="Natrag"
          :color="button"
          outline
          @click="cancel"
        />
      </BaseButtons>
    </CardBox>
  </OverlayLayer>
</template>

<style scoped>
.modal-scrollable {
  max-height: 90vh;
  overflow-y: auto;
}
</style>