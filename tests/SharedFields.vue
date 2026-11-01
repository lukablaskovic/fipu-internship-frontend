<script setup>
import Group from "../src/components/Form/FormCheckRadioGroup.vue";
import FilePicker from "../src/components/Form/FormFilePicker.vue";
import PremiumField from "../src/components/Premium/FormField.vue";
import FormControl from "../src/components/Form/FormControl.vue";
import FormField from "../src/components/Form/FormField.vue";
import { ref } from "vue";
const error = ref(null),
	disabled = ref(false),
	text = ref(""),
	selected = ref(""),
	date = ref(""),
	checks = ref([]),
	switches = ref([]),
	file = ref(null);
</script>
<template>
	<form @submit.prevent>
		<PremiumField label="Tekst" :error="error" help="Opis teksta"
			><FormField addons><FormControl v-model="text" /></FormField
		></PremiumField>
		<FormField name="choice" label="Odabir" :error="error" :disabled="disabled" help="Opis odabira"><FormControl v-model="selected" :options="['', 'Prva', 'Druga']" /></FormField>
		<FormField label="Datum" :error="error" help="Opis datuma"><FormControl v-model="date" type="date" /></FormField>
		<FormField label="Potvrde" :error="error" help="Opis potvrda"><Group v-model="checks" name="checks" :options="{ a: 'A', b: 'B' }" /></FormField>
		<FormField label="Postavke" :error="error" :disabled="disabled" help="Opis postavki"><Group v-model="switches" name="switches" type="switch" :options="{ x: 'X', y: 'Y' }" /></FormField>
		<FormField label="PDF" :error="error" help="Opis datoteke"><FilePicker v-model="file" pdf label="Prenesi" /></FormField>
		<div class="flex gap-3">
			<button type="button" @click="error = error ? null : 'Neispravan unos'">Promijeni grešku</button><button type="button" @click="disabled = !disabled">Onemogući</button><button type="button" @click="file = null">Očisti datoteku</button>
		</div>
		<output data-testid="values">{{ JSON.stringify({ text, selected, checks, switches, file: file?.name }) }}</output>
	</form>
</template>
