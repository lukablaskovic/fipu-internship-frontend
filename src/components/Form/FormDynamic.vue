<template>
  <CardBox is-form @submit.prevent="submitForm">
    <div class="mb-2">{{ documentation }}</div>

    <div v-for="(field, key) in formFields" :key="key">
      <FormField v-if="field.type === 'yes-no-boolean'">
        <FormCheckRadio
          v-model="formValues[key]"
          :name="key"
          :label="field.label"
          :input-value="true"
        />

        <!-- Handle var-string and not rendering any form field -->
        <template v-if="field.type === 'var-string'"> </template>

        <!-- Add more conditions here for other field types -->
      </FormField>
      <!-- Handle selectFromTable field type -->
      <component
        :is="tableComponent"
        v-if="field.type.startsWith('selectFromTable')"
        :data="getTableType(field.type)"
        @row-selected="handleRowSelected"
      />
    </div>
  </CardBox>
</template>

<script setup>
import { onMounted, computed, reactive, watch } from "vue";
import CardBox from "../Cardbox/CardBox.vue";
import FormField from "./FormField.vue";
import FormCheckRadio from "./FormCheckRadio.vue";
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
  console.log(formValues);
};

const allFieldsFilled = computed(() => {
  return Object.values(formValues).every((value) => value);
});

const getTableType = (type) => {
  const matches = type.match(/selectFromTable-["']?([^"']+)["']?/);
  if (matches) {
    return matches[1];
  }
};

watch(allFieldsFilled, (newValue) => {
  emit("allFieldsFilled", newValue);
});

watch(
  formValues,
  (newValues) => {
    emit("update:modelValue", newValues);
  },
  { deep: true },
  console.log(formValues)
);

const submitForm = () => {
  emit("update:modelValue", formValues);
};
</script>
