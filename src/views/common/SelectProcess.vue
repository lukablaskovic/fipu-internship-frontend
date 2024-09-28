<template>
	<div class="flex h-full min-h-screen w-full items-center justify-center bg-white bg-cover bg-center transition-all duration-300 sm:bg-[url('/background-blue.jpg')]">
		<div class="flex flex-col items-center justify-center overflow-hidden transition-all duration-300">
			<CardBox vertical-centered class="p-6 transition-all duration-300 sm:mx-10 sm:rounded-2xl sm:p-12 md:mx-32 lg:mx-96" is-form>
				<a href="https://fipu.unipu.hr/" target="_blank" class="mx-auto flex w-max">
					<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="mb-3 h-16 object-contain transition-all duration-300 sm:h-32 2xl:mb-6" />
				</a>

				<h2 class="mb-4 mt-4 text-center text-xl font-bold text-fipu_gray sm:text-2xl lg:text-3xl xl:mb-6 2xl:text-4xl">Molimo odaberite vašu izvedbu stručne prakse</h2>

				<div class="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
					<!-- Button 1: Nemam poduzeće -->
					<button :class="['relative flex w-full items-center justify-center border border-gray-300 px-8 py-12 text-sm font-semibold text-gray-700 transition-transform duration-300 hover:scale-105 hover:bg-gray-200 sm:w-auto sm:px-24 sm:py-24 sm:text-xl', selectedProcess === 'A' ? 'bg-fipu_blue text-white' : '']" @click.prevent="selectProcess('A')" @mouseover="hoveredButton = 'A'" @mouseleave="hoveredButton = ''">
						<!-- Button Text -->
						<span :class="{ 'opacity-0': hoveredButton === 'A', 'transition-opacity': true }">Nemam poduzeće (Model A)</span>
						<!-- Bullet points on hover for Button A -->
						<div v-if="hoveredButton === 'A'" class="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 text-white transition-opacity duration-300">
							<ul class="space-y-2 text-left">
								<li v-for="(text, index) in hoverTexts.A" :key="index">{{ text }}</li>
							</ul>
						</div>
					</button>

					<!-- Button 2: Imam već dogovoreno -->
					<button :class="['relative flex w-full items-center justify-center border border-gray-300 px-8 py-12 text-sm font-semibold text-gray-800 transition-transform duration-300 hover:scale-105 hover:bg-gray-200 sm:w-auto sm:px-24 sm:py-24 sm:text-xl', selectedProcess === 'B' ? 'bg-fipu_blue text-white' : '']" @click.prevent="selectProcess('B')" @mouseover="hoveredButton = 'B'" @mouseleave="hoveredButton = ''">
						<!-- Button Text -->
						<span :class="{ 'opacity-0': hoveredButton === 'B', 'transition-opacity': true }">Imam već dogovoreno (Model B)</span>
						<!-- Bullet points on hover for Button B -->
						<div v-if="hoveredButton === 'B'" class="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 text-white transition-opacity duration-300">
							<ul class="list-disc space-y-2 text-left">
								<li v-for="(text, index) in hoverTexts.B" :key="index">{{ text }}</li>
							</ul>
						</div>
					</button>
				</div>

				<div class="mb-6 grid grid-cols-1 gap-6">
					<CardBox :icon="mdiBallot" class="mb-6 lg:col-span-2 lg:mb-0 xl:col-span-3" is-form @submit.prevent="onSubmit">
						<FormField label="Ime i prezime" horizontal>
							<FormControl v-model="fixedUserData.ime_prezime" :icon-left="mdiEmail" type="email" readonly />
						</FormField>

						<FormField label="E-mail" horizontal>
							<FormControl v-model="fixedUserData.email" :icon-left="mdiAccount" type="email" readonly />
						</FormField>

						<FormField label="JMBAG" horizontal>
							<FormControl v-model="form.jmbag" :icon-left="mdiCardAccountDetails" type="text" :error="getFirstErrorForField(v$, 'jmbag')" />
						</FormField>

						<FormField label="Godina studija" horizontal>
							<FormCheckRadioGroup v-model="form.godina_studija" name="godina_studija_selection" :error="getFirstErrorForField(v$, 'godina_studija')" type="radio" :options="selectionSelect" component-class="check-radio-warning" />
						</FormField>

						<FormField horizontal>
							<BaseButton label="Započni proces prakse" type="submit" :disabled="isLoading" :loading="isLoading" color="fipu_blue" />
						</FormField>
					</CardBox>
				</div>
				<h2 class="mt-4 text-center text-xs sm:text-sm">
					Povratak na
					<a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click="logout">prijavu</a>.
				</h2>
			</CardBox>
		</div>
		<SnackBar />
	</div>
</template>

<script setup>
import { mdiBallot, mdiEmail, mdiAccount, mdiCardAccountDetails } from "@mdi/js";
import FormCheckRadioGroup from "@/components/Form/FormCheckRadioGroup.vue";
import { required, helpers, numeric } from "@vuelidate/validators";
import SnackBar from "@/components/Premium/SnackBar.vue";

import { getFirstErrorForField, exactLength } from "@/helpers/validators";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";

import { useVuelidate } from "@vuelidate/core";

import Utils from "@/helpers/utils";

import CardBox from "@/components/Cardbox/CardBox.vue";
import { ref, reactive, onMounted } from "vue";

// Public images
import { mainStore, snackBarStore } from "@/main.js";
import fipu_unipu from "/fipu_unipu.png";
import { useRouter } from "vue-router";
const router = useRouter();
import { googleLogout } from "vue3-google-login";

const selectionSelect = { "1_prijediplomski": "1. prijediplomski", "2_prijediplomski": "2. prijediplomski", "3_prijediplomski": "3. prijediplomski", "1_diplomski": "1. diplomski", "2_diplomski": "2. diplomski" };

const fixedUserData = reactive({
	ime_prezime: "",
	email: "",
});

onMounted(() => {
	let currentUser = mainStore.currentUser;
	fixedUserData.ime_prezime = currentUser.ime + " " + currentUser.prezime;
	fixedUserData.email = currentUser.email;
});

const logout = () => {
	googleLogout();
	mainStore.logout();
};

const selectProcess = async (process) => {
	selectedProcess.value = process;
};

const DEFAULT_FORM_VALUES = {
	jmbag: "",
	godina_studija: "3_prijediplomski",
};

const form = reactive({ ...DEFAULT_FORM_VALUES });
const rules = reactive({
	godina_studija: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	jmbag: {
		required: helpers.withMessage("Polje je obavezno", required),
		numeric: helpers.withMessage("JMBAG smije sadržavati samo brojeve", numeric),
		exactLength: helpers.withMessage("JMBAG mora sadržavati točno 10 brojeva", exactLength(10)),
	},
});

const isLoading = ref(false);

const v$ = useVuelidate(rules, form);

async function onSubmit() {
	isLoading.value = true;
	v$.value.$touch();
	if (v$.value.$invalid) {
		isLoading.value = false;
		console.log("Invalid form", v$.value);
		snackBarStore.pushMessage("Molimo ispravite sva polja", "danger");
		return;
	}

	if (!selectedProcess.value || selectedProcess.value === "") {
		snackBarStore.pushMessage("Molimo odaberite izvedbu prakse!", "danger");
		isLoading.value = false;
		return;
	}

	isLoading.value = false;
	const response = await mainStore.createInternshipInstance(selectedProcess.value);

	if (response) {
		snackBarStore.pushMessage("Uspješno ste započeli proces prakse!", "success");
		await Utils.wait(1);
		router.push("/moja-praksa");
	}
}

// Data for bullet points for each button
const hoverTexts = {
	A: ["1️⃣Pogledajte dostupne zadatke", "2️⃣Prijavite se na 3 najdraža zadatka", "3️⃣Pričekajte alokaciju"],
	B: ["Model B ide u dogovoru s nastavnikom", "Praksa već dogovorena ili odrađena", "Potrebno prijaviti zadatak"],
};

const hoveredButton = ref("");
const selectedProcess = ref("");
</script>

<style scoped>
html,
body {
	overflow-y: auto;
}

.fast-animation {
	animation-duration: 0.5s;
}

.hover-underline-animation {
	position: relative;
}

.hover-underline-animation:after {
	content: "";
	position: absolute;
	width: 100%;
	transform: scaleX(0);
	height: 2px;
	bottom: 0;
	left: 0;
	background-color: #9de0f7;
	transform-origin: bottom right;
	transition: transform 0.25s ease-out;
}

.hover-underline-animation:hover:after {
	transform: scaleX(1);
	transform-origin: bottom left;
}

button span.opacity-0 {
	opacity: 0;
}
button span.transition-opacity {
	transition: opacity 0.3s ease;
}
</style>
