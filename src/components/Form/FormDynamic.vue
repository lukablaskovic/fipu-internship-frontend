<template>
	<CardBox is-form vertical-centered @submit.prevent="submitForm">
		<div class="mb-2">{{ documentation }}</div>

		<div v-for="(field, key) in formFields" :key="key">
			<FormField v-if="field.type === 'yes-no-boolean'" :label="field.label">
				<FormCheckRadioGroup v-model="formValues[key]" :name="key" type="radio" :options="{ true: 'Da', false: 'Ne' }" />
			</FormField>

			<FormField v-if="field.type === 'input'" :label="field.label">
				<FormControl class="my-2" v-model="formValues[key]" type="text" />
			</FormField>

			<template v-if="field.type === 'var-string'"> </template>

			<component :is="tableComponent" v-if="field.type.startsWith('selectFromTable') && isTableComponentVisible" :data="getTableType(field.type)" @row-selected="handleRowSelected" />

			<p v-if="field.type.startsWith('selectFromTable') && isTableComponentVisible" class="mb-4 mt-2">
				Odabrali ste: <b> {{ formValues["Alocirani_zadatak"] }} </b>
			</p>
		</div>
	</CardBox>
</template>

<script setup>
import { onMounted, computed, reactive, watch } from "vue";

import FormCheckRadioGroup from "./FormCheckRadioGroup.vue";
import TaskTable from "../BPMN/TaskTable.vue";
import CardBox from "../Cardbox/CardBox.vue";
import FormControl from "./FormControl.vue";
import FormField from "./FormField.vue";

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

const isTableComponentVisible = computed(() => {
	return formValues["odabir_prihvacen"] !== "false";
});

const allFieldsFilled = computed(() => {
	return Object.keys(formValues).every((key) => {
		const field = props.formFields[key];
		const value = formValues[key];

		// Yes-No boolean fields must be filled (not null)
		if (field.type === "yes-no-boolean") {
			return value !== null;
		}

		// var-string fields can remain null, so don't require them to be filled
		if (field.type === "var-string") {
			return true;
		}

		// selectFromTable fields must have a selection
		if (field.type.startsWith("selectFromTable") && isTableComponentVisible.value) {
			return value !== null;
		}

		// Input fields must not be empty
		if (field.type === "input") {
			return value !== null && value.trim() !== ""; // Ensure input field is not empty
		}

		// For any other field types, fallback to true if not rendered
		return true;
	});
});

watch(allFieldsFilled, (newValue) => {
	emit("allFieldsFilled", newValue);
});

watch(
	formValues,
	(newValues, oldValues) => {
		emit("update:modelValue", newValues);
	},
	{ deep: true },
);

const submitForm = () => {
	emit("update:modelValue", formValues);
};
</script>
