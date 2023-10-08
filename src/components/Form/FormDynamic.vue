<template>
	<CardBox is-form @submit.prevent="submitForm">
		<div class="mb-2">{{ documentation }}</div>

		<div v-for="(field, key) in formFields" :key="key">
			<FormField v-if="field.type === 'yes-no-boolean'" :label="field.label">
				<FormCheckRadioGroup v-model="formValues[key]" :name="key" type="radio" :options="{ true: 'Da', false: 'Ne' }" />
			</FormField>

			<template v-if="field.type === 'var-string'"> </template>

			<component :is="tableComponent" v-if="field.type.startsWith('selectFromTable') && isTableComponentVisible" :data="getTableType(field.type)" @row-selected="handleRowSelected" />

			<p v-if="field.type.startsWith('selectFromTable') && isTableComponentVisible" class="mt-2 mb-4">
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

const formValues = reactive(Object.fromEntries(Object.keys(props.formFields).map((key) => [key, null])));

onMounted(() => {
	for (const key in props.formFields) {
		if (props.formFields[key].type === "var-string" && props.variables[key] !== undefined) {
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
	return Object.keys(formValues).every((key) => {
		const field = props.formFields[key];
		const isRendered = field.type === "yes-no-boolean" || (field.type.startsWith("selectFromTable") && isTableComponentVisible.value) || field.type === "var-string";
		return !isRendered || (isRendered && formValues[key] !== null);
	});
});

watch(allFieldsFilled, (newValue) => {
	emit("allFieldsFilled", newValue);
});

const isTableComponentVisible = computed(() => {
	return formValues["odabir_prihvacen"] !== "false";
});

watch(
	formValues,
	(newValues, oldValues) => {
		console.log("Form values changed:", newValues);
		// If you want to see the previous state also
		// console.log('Old form values:', oldValues);
	},
	{ deep: true }
);

watch(
	formValues,
	(newValues, oldValues) => {
		emit("update:modelValue", newValues);
	},
	{ deep: true }
);

const submitForm = () => {
	emit("update:modelValue", formValues);
};
</script>
