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
    class="bg-white flex overflow-hidden"
    @submit="submit"
  >
    <slot v-if="hasComponentLayout" />
    <template v-else>
      <CardBoxComponentBody :no-padding="hasTable">
        <slot />
      </CardBoxComponentBody>
      <CardBoxComponentFooter v-if="hasFooterSlot">
        <slot name="footer" />
      </CardBoxComponentFooter>
    </template>
  </component>
</template>
