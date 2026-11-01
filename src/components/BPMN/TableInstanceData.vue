<script setup>
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import { computed } from "vue";

const props = defineProps({
	taskId: { type: String, default: "" },
	variables: { type: Object, default: () => ({}) },
});
const tableAttributes = computed(() => {
	if (props.taskId == "odabiranje_zadatka_student") {
		return ["Prvi_odabir", "Drugi_odabir", "Treci_odabir", "napomena"];
	} else if (props.taskId == "alociranje_profesor") {
		return ["Alocirani_zadatak"];
	} else if (props.taskId == "model_b_odobrenje_zadatka") {
		return ["zadatak_odobren"];
	} else if (props.taskId == "ispunjavanje_prijavnice_student") {
		return ["mentor_ime", "mentor_prezime", "mentor_email", "student_broj_mobitela", "student_OIB", "dogovoreni_broj_sati", "pocetak_prakse", "kraj_prakse", "mjesto_izvrsavanja"];
	} else if (props.taskId == "predavanje_dnevnika_student") {
		return ["prijavljen_rok", "nastavak_radnog_odnosa"];
	} else if (props.taskId == "evaluacija_poslodavac") {
		return ["kandidat_odobren"];
	} else if (props.taskId == "upis_ocjene") {
		return ["ocjena_unesena_studomat"];
	}
	return [];
});

const formattedVariables = computed(() => {
	return Object.keys(props.variables).reduce((acc, key) => {
		if (Array.isArray(props.variables[key])) {
			acc[key] = props.variables[key].join(", ");
		} else {
			acc[key] = props.variables[key];
		}
		return acc;
	}, {});
});
</script>

<template>
	<CardBoxComponentEmpty v-if="!tableAttributes.length" />
	<table v-else class="mb-4">
		<tbody class="text-sm">
			<tr v-if="tableAttributes.length <= 5">
				<th v-for="(attribute, index) in tableAttributes" :key="index">
					{{ attribute }}
				</th>
			</tr>
			<tr v-if="tableAttributes.length <= 5">
				<td v-for="(attribute, index) in tableAttributes" :key="index" :data-label="attribute">
					{{ formattedVariables[attribute] }}
				</td>
			</tr>
			<tr v-for="(attribute, index) in tableAttributes" v-else :key="index">
				<th>{{ attribute }}</th>
				<td :data-label="attribute">
					{{ formattedVariables[attribute] }}
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style scoped></style>
