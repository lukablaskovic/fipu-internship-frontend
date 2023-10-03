<script setup>
import { computed, useSlots } from "vue";
import CardBoxComponentBody from "@/components/Cardbox/CardBoxComponentBody.vue";
import CardBoxComponentFooter from "@/components/Cardbox/CardBoxComponentFooter.vue";

const props = defineProps({
  hasComponentLayout: Boolean,
  hasTable: Boolean,
  isForm: Boolean,
  isHoverable: Boolean,
  isModal: Boolean,
  centeredContent: Boolean,
  verticalCentered: Boolean,
});

const emit = defineEmits(["submit"]);

const slots = useSlots();

const hasFooterSlot = computed(() => slots.footer && !!slots.footer());

const componentClass = computed(() => {
  const base = [props.isModal ? "dark:bg-slate-900" : "dark:bg-slate-900/70"];

  if (props.isHoverable) {
    base.push("hover:shadow-lg transition-shadow duration-500");
  }

  return base;
});

const submit = (event) => {
  emit("submit", event);
};
</script>

<template>
  <component
    :is="isForm ? 'form' : 'div'"
    :class="componentClass"
    class="bg-white flex"
    @submit="submit"
  >
    <slot v-if="hasComponentLayout" />
    <template v-else>
      <CardBoxComponentBody
        :no-padding="hasTable || centeredContent || verticalCentered"
        :centered-content="centeredContent"
        :vertical-centered="verticalCentered"
      >
        <slot />
      </CardBoxComponentBody>
      <CardBoxComponentFooter v-if="hasFooterSlot">
        <slot name="footer" />
      </CardBoxComponentFooter>
    </template>
  </component>
</template>
<style scoped>
::-webkit-scrollbar {
  width: 8px;
  border-radius: 100px;
}
::-webkit-scrollbar-track-piece {
  background: #f9fafb;
  border-radius: 100px;
}
::-webkit-scrollbar-thumb {
  background: #9ca3af;
  border-radius: 100px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
  border-radius: 32px;
}
</style>
