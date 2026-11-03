<script setup>
import { computed, onMounted, reactive, ref, watchEffect } from "vue";
import { fetchAvailableAssignments } from "@/services/baserow_client_api";
import { preferenceTable, visibleTaskFields, taskFormAnswers } from "@/helpers/task-form.mjs";
import CardBox from "@/components/Cardbox/CardBox.vue";
import TableStudentPreferences from "@/components/Tables/TableStudentPreferences.vue";
import FormCheckRadioGroup from "./FormCheckRadioGroup.vue";
import FormControl from "./FormControl.vue";
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

const assignmentError = computed(() => {
	if (!props.checkAssignment) return null;
	if (assignments.value === null) return "Popis zadataka nije učitan. Ponovno otvorite obrazac.";
	const id = values.id_zadatak;
	if (!assignments.value || !id?.trim()) return null;
	const assignment = assignments.value.find((row) => row.id_zadatak === id);
	if (!assignment) return `Zadatak "${id}" ne postoji. Provjerite točan ID zadatka u tabu Zadaci.`;
	switch (assignment.voditelj_odobrio?.value) {
		case "odobreno": return null;
		case "odbijeno": return `Zadatak "${id}" je odbijen i nije moguće odobriti ga za studenta.`;
		case "u razradi": return `Zadatak "${id}" je još u razradi. Najprije ga odobrite u tabu Zadaci.`;
		default: return `Zadatak "${id}" ima nepoznat status. Provjerite status zadatka u tabu Zadaci.`;
	}
});

watchEffect(() => {
	const blocked = props.checkAssignment && (!assignments.value || assignmentError.value);
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
			<FormField v-else-if="field.type === 'input'" :name="key" :label="field.label" :error="key === 'id_zadatak' ? assignmentError : null">
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
