<template>
  <CardBox is-form @submit.prevent="submitForm">
    <div class="mb-6">
      {{ documentation }}
    </div>
    <FormField v-for="(field, key) in formFields" :key="key">
      <FormCheckRadio
        v-if="field.type === 'yes-no-boolean'"
        v-model="formValues[key]"
        :name="key"
        :label="field.label"
        :input-value="true"
      />
    </FormField>
  </CardBox>
</template>

<script setup>
import { computed, reactive, watch } from "vue";
import CardBox from "../Cardbox/CardBox.vue";
import FormField from "./FormField.vue";
import FormCheckRadio from "./FormCheckRadio.vue";
import BaseButton from "../Base/BaseButton.vue";

const emit = defineEmits(["update:modelValue", "allFieldsFilled"]);
const props = defineProps({
  formFields: {
    type: Object,
    default: () => {},
  },
  documentation: {
    type: String,
    default: null,
  },
});

const formValues = reactive(
  Object.fromEntries(Object.keys(props.formFields).map((key) => [key, null]))
);

const allFieldsFilled = computed(() => {
  return Object.values(formValues).every(
    (value) => value !== null && value !== undefined
  );
});

watch(allFieldsFilled, (newValue) => {
  emit("allFieldsFilled", newValue);
});

watch(
  formValues,
  (newValues) => {
    emit("update:modelValue", newValues);
  },
  { deep: true }
);

const submitForm = () => {
  emit("update:modelValue", formValues);
};
</script>
