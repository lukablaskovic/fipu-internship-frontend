<template>
  <CardBox is-form @submit.prevent="submitForm">
    <div class="mb-2">{{ documentation }}</div>

    <div v-for="(field, key) in formFields" :key="key">
      <FormField v-if="field.type === 'yes-no-boolean'" :label="field.label">
        <FormCheckRadioGroup
          v-model="formValues[key]"
          :name="key"
          type="radio"
          :options="{ true: 'Da', false: 'Ne' }"
        />
      </FormField>

      <template v-if="field.type === 'var-string'"> </template>

      <component
        :is="tableComponent"
        v-if="field.type.startsWith('selectFromTable')"
        :data="getTableType(field.type)"
        @row-selected="handleRowSelected"
      />
      <p v-if="field.type.startsWith('selectFromTable')" class="mt-2">
        Odabrali ste: <b> {{ formValues["Alocirani_zadatak"] }} </b>
      </p>
    </div>
  </CardBox>
</template>

<script setup>
import { onMounted, computed, reactive, watch } from "vue";

import CardBox from "../Cardbox/CardBox.vue";
import FormField from "./FormField.vue";
import FormCheckRadioGroup from "./FormCheckRadioGroup.vue";
import TaskTable from "../BPMN/TaskTable.vue";

const emit = defineEmits(["update:modelValue", "allFieldsFilled"]);

const props = defineProps({
  formFields: {
    type: Object,
    default: () => {},
  },
  variables: {
    type: Object,
    default: () => {},
  },
  documentation: {
    type: String,
    default: null,
  },
});

const tableComponent = TaskTable;

const formValues = reactive(
  Object.fromEntries(Object.keys(props.formFields).map((key) => [key, null]))
);

onMounted(() => {
  for (const key in props.formFields) {
    if (
      props.formFields[key].type === "var-string" &&
      props.variables[key] !== undefined
    ) {
      formValues[key] = props.variables[key];
    }
  }
});

const handleRowSelected = (assignmentId) => {
  formValues["Alocirani_zadatak"] = assignmentId;
};

const getTableType = (type) => {
  const matches = type.match(/selectFromTable-["']?([^"']+)["']?/);
  if (matches) {
    return matches[1];
  }
};

const allFieldsFilled = computed(() => {
  return Object.values(formValues).every((value) => value);
});
watch(allFieldsFilled, (newValue) => {
  emit("allFieldsFilled", newValue);
});

watch(
  formValues,
  (newValues, oldValues) => {
    emit("update:modelValue", newValues);
    console.log(formValues);
  },
  { deep: true }
);

const submitForm = () => {
  emit("update:modelValue", formValues);
};
</script>
