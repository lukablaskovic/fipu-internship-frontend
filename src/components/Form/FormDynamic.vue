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
import { onMounted, computed, reactive, watch, ref } from "vue";

import FormCheckRadioGroup from "./FormCheckRadioGroup.vue";
import TaskTable from "../BPMN/TaskTable.vue";
import CardBox from "../Cardbox/CardBox.vue";
import FormControl from "./FormControl.vue";
import FormField from "./FormField.vue";

import { mainStore, snackBarStore } from "@/main.js";

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
	currentTaskId: {
		type: String,
		default: null,
	},
});

// Available assignments for validation (model_b_odobrenje_zadatka)
const availableAssignments = ref([]);

const tableComponent = TaskTable;

const formValues = reactive(Object.fromEntries(Object.keys(props.formFields).map((key) => [key, null])));

onMounted(async () => {
	for (const key in props.formFields) {
		if (props.formFields[key].type === "var-string" && props.variables[key] !== undefined) {
			formValues[key] = props.variables[key];
		}
	}

	// Fetch available assignments for validation if this is model_b_odobrenje_zadatka
	if (props.currentTaskId === "model_b_odobrenje_zadatka") {
		const assignments = await mainStore.fetchAvailableAssignments();
		if (assignments) {
			availableAssignments.value = assignments;
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

// Find assignment by id_zadatak
const findAssignment = (idZadatak) => {
	return availableAssignments.value.find((a) => a.id_zadatak === idZadatak);
};

// Get validation status for id_zadatak
const getIdZadatakValidationStatus = computed(() => {
	if (props.currentTaskId !== "model_b_odobrenje_zadatka") {
		return { valid: true, status: null };
	}

	const idZadatak = formValues["id_zadatak"];
	if (!idZadatak || idZadatak.trim() === "") {
		return { valid: true, status: null }; // Will be caught by required field validation
	}

	const assignment = findAssignment(idZadatak);
	if (!assignment) {
		return { valid: false, status: "not_found" };
	}

	const voditeljOdobrio = assignment.voditelj_odobrio?.value;
	if (voditeljOdobrio === "odobreno") {
		return { valid: true, status: "odobreno" };
	} else if (voditeljOdobrio === "odbijeno") {
		return { valid: false, status: "odbijeno" };
	} else if (voditeljOdobrio === "u razradi") {
		return { valid: false, status: "u_razradi" };
	}

	// Unknown status - treat as invalid
	return { valid: false, status: "unknown" };
});

// Validate id_zadatak exists and is approved for model_b_odobrenje_zadatka
const isIdZadatakValid = computed(() => {
	return getIdZadatakValidationStatus.value.valid;
});

const allFieldsFilled = computed(() => {
	const fieldsFilled = Object.keys(formValues).every((key) => {
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

	// For model_b_odobrenje_zadatka, also validate that id_zadatak exists
	if (props.currentTaskId === "model_b_odobrenje_zadatka" && fieldsFilled) {
		if (!isIdZadatakValid.value) {
			return false;
		}
	}

	return fieldsFilled;
});

watch(allFieldsFilled, (newValue) => {
	emit("allFieldsFilled", newValue);
});

// Debounce timer for id_zadatak validation snackbar
let idZadatakValidationTimeout = null;

// Get appropriate error message based on validation status
const getValidationErrorMessage = (idZadatak, status) => {
	switch (status) {
		case "not_found":
			return `Zadatak "${idZadatak}" ne postoji. Provjerite točan ID zadatka u tabu Zadaci.`;
		case "odbijeno":
			return `Zadatak "${idZadatak}" je odbijen i nije moguće odobriti ga za studenta.`;
		case "u_razradi":
			return `Zadatak "${idZadatak}" je još u razradi. Najprije ga odobrite u tabu Zadaci.`;
		case "unknown":
			return `Zadatak "${idZadatak}" ima nepoznat status. Provjerite status zadatka u tabu Zadaci.`;
		default:
			return null;
	}
};

// Show snackbar error when id_zadatak is invalid for model_b_odobrenje_zadatka (debounced)
watch(
	() => formValues["id_zadatak"],
	(newValue) => {
		// Clear any pending timeout
		if (idZadatakValidationTimeout) {
			clearTimeout(idZadatakValidationTimeout);
		}

		if (props.currentTaskId === "model_b_odobrenje_zadatka" && newValue && newValue.trim() !== "") {
			// Debounce the snackbar message to avoid firing on every keystroke
			idZadatakValidationTimeout = setTimeout(() => {
				const validationStatus = getIdZadatakValidationStatus.value;
				if (!validationStatus.valid) {
					const errorMessage = getValidationErrorMessage(newValue, validationStatus.status);
					if (errorMessage) {
						snackBarStore.pushMessage(errorMessage, "danger", 5000);
					}
				}
			}, 800);
		}
	},
);

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
