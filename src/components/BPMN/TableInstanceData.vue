<script setup>
import { ref, onMounted, computed } from "vue";
import { adminStore } from "@/main.js";
import { mainStore } from "@/main.js";

const variables = ref({});

const tableAttributes = ref([]);

onMounted(async () => {
	if (mainStore.userAdmin) {
		variables.value = adminStore.selectedStudent.process_instance_data.variables;
	} else {
		variables.value = mainStore.currentUserProcessInstanceData.variables;
	}

	//Znam ružno je ali bit ce bolje
	if (adminStore.bpmn_diagram.clicked_task_id == "odabiranje_zadatka_student") {
		tableAttributes.value = ["Prvi_odabir", "Drugi_odabir", "Treci_odabir", "napomena"];
	} else if (adminStore.bpmn_diagram.clicked_task_id == "alociranje_profesor") {
		tableAttributes.value = ["Alocirani_zadatak"];
	} else if (adminStore.bpmn_diagram.clicked_task_id == "model_b_odobrenje_zadatka") {
		tableAttributes.value = ["zadatak_odobren"];
	} else if (adminStore.bpmn_diagram.clicked_task_id == "ispunjavanje_prijavnice_student") {
		tableAttributes.value = ["mentor_ime", "mentor_prezime", "mentor_email", "student_broj_mobitela", "student_OIB", "dogovoreni_broj_sati", "pocetak_prakse", "kraj_prakse", "mjesto_izvrsavanja"];
	} else if (adminStore.bpmn_diagram.clicked_task_id == "predavanje_dnevnika_student") {
		tableAttributes.value = ["prijavljen_rok", "nastavak_radnog_odnosa"];
	} else if (adminStore.bpmn_diagram.clicked_task_id == "evaluacija_poslodavac") {
		tableAttributes.value = ["kandidat_odobren"];
	} else if (adminStore.bpmn_diagram.clicked_task_id == "upis_ocjene") {
		tableAttributes.value = ["ocjena_unesena_studomat"];
	}
});

const formattedVariables = computed(() => {
	return Object.keys(variables.value).reduce((acc, key) => {
		if (Array.isArray(variables.value[key])) {
			acc[key] = variables.value[key].join(", ");
		} else {
			acc[key] = variables.value[key];
		}
		return acc;
	}, {});
});
</script>

<template>
	<table class="mb-4">
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
			<tr v-else v-for="(attribute, index) in tableAttributes" :key="index">
				<th>{{ attribute }}</th>
				<td :data-label="attribute">
					{{ formattedVariables[attribute] }}
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style scoped></style>
