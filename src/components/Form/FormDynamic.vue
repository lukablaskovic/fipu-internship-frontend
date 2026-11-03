<script setup>
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { fetchAvailableAssignments } from "@/services/baserow_client_api";
import { approvalAssignmentOptions, preferenceTable, visibleTaskFields, taskFormAnswers } from "@/helpers/task-form.mjs";
import CardBox from "@/components/Cardbox/CardBox.vue";
import TableStudentPreferences from "@/components/Tables/TableStudentPreferences.vue";
import FormCheckRadioGroup from "./FormCheckRadioGroup.vue";
import FormControl from "./FormControl.vue";
import FormControlListbox from "./FormControlListbox.vue";
import FormField from "./FormField.vue";

const props = defineProps({
	task: { type: Object, required: true },
	preferencesId: { type: [String, Number], default: null },
	checkAssignment: Boolean,
});
const emit = defineEmits(["answers"]);
const values = reactive({});
const fields = computed(() => visibleTaskFields(props.task.form_fields, values));
const assignments = ref();

onMounted(async () => {
	if (props.checkAssignment) assignments.value = (await fetchAvailableAssignments()) ?? null;
});

const approvalDeclined = computed(() => props.checkAssignment && values.zadatak_odobren === "false");
const assignmentOptions = computed(() => approvalAssignmentOptions(assignments.value ?? []));
const selectedAssignment = computed({
	get: () => assignmentOptions.value.find(option => option.id === values.id_zadatak),
	set: option => { values.id_zadatak = option?.id; },
});
const assignmentPlaceholder = computed(() => {
	if (assignments.value === undefined) return "Učitavanje zadataka…";
	if (assignments.value === null) return "Popis zadataka nije učitan. Ponovno otvorite obrazac.";
	if (!assignmentOptions.value.length) return "Nema odobrenih zadataka sa slobodnim mjestima.";
	return "Odaberite zadatak";
});

watchEffect(() => {
	const blocked = props.checkAssignment && (approvalDeclined.value || !selectedAssignment.value);
	emit("answers", blocked ? null : taskFormAnswers(fields.value, values));
});
</script>

<template>
	<CardBox vertical-centered>
		<p v-if="task.documentation" class="mb-2">{{ task.documentation }}</p>
		<template v-for="[key, field] in fields" :key="key">
			<p v-if="key === 'ocjena_unesena_studomat' && field.type === 'yes-no-boolean'">Potvrdite da je ocjena unesena u ISVU.</p>
			<FormField v-else-if="field.type === 'yes-no-boolean'" :name="key" :label="field.label">
				<FormCheckRadioGroup v-model="values[key]" :name="key" type="radio" :options="{ true: 'Da', false: 'Ne' }" />
			</FormField>
			<p v-else-if="approvalDeclined && key === 'id_zadatak'" role="status">Zadatak ostaje na čekanju dok ga ne odobrite.</p>
			<FormField v-else-if="checkAssignment && key === 'id_zadatak' && field.type === 'input'" :name="key" label="Zadatak za ovog studenta">
				<FormControlListbox v-model="selectedAssignment" button-class="form-control-surface w-full rounded border px-3 py-2 text-left" :name="key" :options="assignmentOptions" :placeholder="assignmentPlaceholder" :disabled="!assignmentOptions.length" required aria-label="Zadatak za ovog studenta" />
			</FormField>
			<FormField v-else-if="field.type === 'input'" :name="key" :label="field.label">
				<FormControl v-model="values[key]" class="my-2" type="text" />
			</FormField>
			<template v-else-if="field.type === preferenceTable">
				<TableStudentPreferences v-model="values[key]" :preferences-id="preferencesId" />
				<p class="mb-4 mt-2">Odabrali ste: <b>{{ values[key] }}</b></p>
			</template>
			<p v-else role="alert">Polje „{{ field.label || key }}” nije podržano. Obrazac nije moguće predati.</p>
		</template>
	</CardBox>
</template>
