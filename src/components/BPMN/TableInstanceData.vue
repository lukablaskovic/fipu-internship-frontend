<script setup>
import TableCellText from "@/components/Tables/TableCellText.vue";
import CardBoxComponentEmpty from "@/components/Cardbox/CardBoxComponentEmpty.vue";
import { computed } from "vue";

const props = defineProps({
	taskId: { type: String, default: "" },
	variables: { type: Object, default: () => ({}) },
});
const attributeLabels = {
	Prvi_odabir: "Prvi odabir",
	Drugi_odabir: "Drugi odabir",
	Treci_odabir: "Treći odabir",
	napomena: "Napomena",
	Alocirani_zadatak: "Alocirani zadatak",
	zadatak_odobren: "Zadatak odobren",
	mentor_ime: "Ime mentora",
	mentor_prezime: "Prezime mentora",
	mentor_email: "E-mail mentora",
	student_broj_mobitela: "Mobitel studenta",
	student_OIB: "OIB studenta",
	dogovoreni_broj_sati: "Dogovoreni broj sati",
	pocetak_prakse: "Početak prakse",
	kraj_prakse: "Kraj prakse",
	mjesto_izvrsavanja: "Mjesto izvršavanja",
	prijavljen_rok: "Prijavljen rok",
	nastavak_radnog_odnosa: "Nastavak radnog odnosa",
	kandidat_odobren: "Kandidat odobren",
	ocjena_unesena_studomat: "Ocjena unesena u Studomat",
};
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
	<dl v-else class="divide-y divide-slate-200 text-sm dark:divide-slate-700">
		<div v-for="attribute in tableAttributes" :key="attribute" class="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
			<dt class="font-medium text-slate-600 dark:text-slate-300">{{ attributeLabels[attribute] }}</dt>
			<dd class="min-w-0 break-words text-slate-900 dark:text-slate-100">
				<TableCellText :value="formattedVariables[attribute]" />
			</dd>
		</div>
	</dl>
</template>
