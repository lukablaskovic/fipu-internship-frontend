<script setup>
import { ref } from "vue";
import CardBoxAllocation from "../src/components/Cardbox/CardBoxAllocation.vue";
import CardBoxModal from "../src/components/Cardbox/CardBoxModal.vue";
import "../src/css/main.css";

const open = ref(false);
const assignment = ref({
	id_zadatak: "Zadatak 100 - The Workshop Academy",
	Poslodavac: [{ value: "Sveučilište Jurja Dobrile u Puli" }],
	poslodavac_email: "campusconnect-unipu@events.wordpress.org",
	opis_zadatka: Array(8).fill("Student sudjeluje u izradi i objavi open-source dodatka za WordPress u sklopu programa WordPress Credits. Projekt uključuje razvoj Swim Club plugina za digitalno upravljanje članstvom i administracijom plivačkih klubova.").join("\n\n"),
	preferirane_tehnologije: "WordPress (PHP), Git i GitHub, WordPress REST API i moderni frontend stack. ".repeat(30),
	potrebno_imati: "Potrebno je poznavanje osnova programiranja, spremnost na timski rad i želja za učenjem kroz razvoj praktičnih rješenja. ".repeat(2) + "Osnovno iskustvo s Gitom i spremnost za dokumentiranje vlastitog rada.",
	preferencije_za_studenta: "Interes za timski rad i open-source zajednicu.",
	napomena: "",
	zeljeno_okvirno_vrijeme_pocetka: "Prema dogovoru",
	lokacija: "Pula",
	trajanje_sati: 150,
	selekcija: false,
	angazman_fipu: "Ne",
});

function nextAssignment() {
	assignment.value = { ...assignment.value, id_zadatak: "Zadatak 101", opis_zadatka: "Kratak opis.", preferirane_tehnologije: "WordPress" };
}
</script>

<template>
	<button type="button" @click="open = true">Otvori zadatak</button>
	<CardBoxModal v-model="open" large button-label="Zatvori">
		<CardBoxAllocation :data="assignment" />
		<button type="button" @click="nextAssignment">Sljedeći zadatak</button>
	</CardBoxModal>
</template>
