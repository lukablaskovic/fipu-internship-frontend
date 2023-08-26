<template>
  <CardBox is-form @submit.prevent="submitForm">
    <div>
      {{ documentation }}
    </div>
    <FormField
      v-for="(field, key) in formFields"
      :key="key"
      :label="field.label"
    >
      <!-- Boolean field type rendering as FormCheckRadio -->
      <FormCheckRadio
        v-if="field.type === 'yes-no-boolean'"
        v-model="formValues[key]"
        :name="key"
        :label="field.label"
        :input-value="true"
      />
      <!-- You can add more conditions here for other field types -->
    </FormField>
    <BaseButton type="submit">Submit</BaseButton>
  </CardBox>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import CardBox from "../Cardbox/CardBox.vue";
import FormField from "./FormField.vue";
import FormCheckRadio from "./FormCheckRadio.vue";
import BaseButton from "../Base/BaseButton.vue";

const emit = defineEmits(["update:modelValue"]);
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

// Ref to hold the form values
const formValues = reactive({});

// Watch for changes in formValues and emit the updated value
watch(
  formValues,
  (newValues) => {
    emit("update:modelValue", newValues);
  },
  { deep: true }
);

const submitForm = () => {
  // You can handle any additional logic here if needed
  // For now, we just emit the values to the parent
  emit("update:modelValue", formValues);
};
</script>
