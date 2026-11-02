<template>
	<div class="process-page">
		<main class="process-panel" aria-labelledby="process-title">
			<header class="process-header">
				<a href="https://fipu.unipu.hr/" target="_blank" rel="noopener noreferrer" aria-label="Fakultet informatike u Puli (otvara se u novoj kartici)">
					<img :src="fipu_unipu" alt="Fakultet informatike u Puli - logotip" class="faculty-logo" />
				</a>
				<div class="header-actions">
					<RouterLink to="/upute" class="help-link"><BaseIcon :path="mdiBookOpenPageVariantOutline" size="20" aria-hidden="true" />Upute za praksu</RouterLink>
					<button type="button" class="login-return" @click="logout"><BaseIcon :path="mdiLogin" size="20" aria-hidden="true" />Povratak na prijavu</button>
				</div>
			</header>

			<CardBox is-form has-component-layout class="process-form" novalidate @submit.prevent="onSubmit">
				<div class="process-intro">
					<img src="/fipu-praksa-logo.png" alt="FIPU Praksa" class="praksa-logo" width="512" height="512" />
					<h1 id="process-title">Molimo odaberite vašu izvedbu stručne prakse</h1>
				</div>

				<fieldset class="process-options">
					<legend class="sr-only">Izvedba stručne prakse</legend>
					<SelectProcessButton button="A" :selected-process="selectedProcess" :steps="processSteps.A" @click="selectedProcess = 'A'" />
					<SelectProcessButton button="B" :selected-process="selectedProcess" :steps="processSteps.B" @click="selectedProcess = 'B'" />
					<p class="process-help">Niste sigurni što odabrati? Prije odabira <RouterLink to="/upute">proučite kako izvodimo praksu na FIPU.</RouterLink></p>
				</fieldset>

				<section class="student-details" aria-labelledby="student-title">
					<h2 id="student-title">Podaci o studentu</h2>
					<FormField label="Ime i prezime">
						<FormControl v-model="fixedUserData.ime_prezime" :icon-left="mdiAccount" type="text" readonly disabled />
					</FormField>
					<FormField label="E-mail">
						<FormControl v-model="fixedUserData.email" :icon-left="mdiEmail" type="email" readonly disabled />
					</FormField>
					<FormField :error="getFirstErrorForField(v$, 'jmbag')" label="JMBAG">
						<FormControl v-model="form.jmbag" :icon-left="mdiCardAccountDetails" type="text" placeholder="Unesite JMBAG (10 znamenki)" />
					</FormField>
					<FormField :error="getFirstErrorForField(v$, 'godina_studija')" label="Godina studija">
						<FormControl v-model="selectedStudyYear" name="godina_studija_selection" :options="studyYears" />
					</FormField>
					<BaseButton label="Započni proces prakse" icon="M8,19V5l11,7L8,19Zm2-7Zm0,3.35L15.25,12L10,8.65v6.7Z" icon-size="24" type="submit" :disabled="isLoading" :loading="isLoading" color="fipu_blue" class="start-button" />
				</section>
			</CardBox>
		</main>
		<SnackBar />
	</div>
</template>

<script setup>
import { mdiEmail, mdiAccount, mdiCardAccountDetails, mdiLogin, mdiBookOpenPageVariantOutline } from "@mdi/js";
import { required, helpers } from "@vuelidate/validators";
import SnackBar from "@/components/Premium/SnackBar.vue";

import { getFirstErrorForField, exactLength } from "@/helpers/validators";
import FormControl from "@/components/Form/FormControl.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";

import SelectProcessButton from "@/components/SelectProcessButton.vue";

import { useVuelidate } from "@vuelidate/core";


import CardBox from "@/components/Cardbox/CardBox.vue";
import { computed, ref, reactive, onMounted } from "vue";

// Public images
import { useMainStore } from "@/stores/main_store";
import { useSnackBarStore } from "@/stores/snackbar_store";

import fipu_unipu from "/fipu_unipu.png";
import { useRouter } from "vue-router";
const router = useRouter();
import { googleLogout } from "vue3-google-login";

const mainStore = useMainStore();
const snackBarStore = useSnackBarStore();

const studyYears = [
	{ id: "1_prijediplomski", label: "1. prijediplomski" },
	{ id: "2_prijediplomski", label: "2. prijediplomski" },
	{ id: "3_prijediplomski", label: "3. prijediplomski" },
	{ id: "1_diplomski", label: "1. diplomski" },
	{ id: "2_diplomski", label: "2. diplomski" },
];

const fixedUserData = reactive({
	ime_prezime: "",
	email: "",
});

onMounted(() => {
	let currentUser = mainStore.currentUser;
	fixedUserData.ime_prezime = currentUser.ime + " " + currentUser.prezime;
	fixedUserData.email = currentUser.email;
	if (currentUser.internship_process.id) {
		form.jmbag = currentUser.JMBAG;
		form.godina_studija = currentUser.godina_studija || form.godina_studija;
	}
});

const logout = () => {
	googleLogout();
	mainStore.logout();
};

const DEFAULT_FORM_VALUES = {
	jmbag: "",
	godina_studija: "3_prijediplomski",
};

const form = reactive({ ...DEFAULT_FORM_VALUES });
const selectedStudyYear = computed({
	get: () => studyYears.find((year) => year.id === form.godina_studija),
	set: (year) => {
		form.godina_studija = year.id;
	},
});
const rules = reactive({
	godina_studija: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	jmbag: {
		required: helpers.withMessage("Polje je obavezno", required),
		numeric: helpers.withMessage("JMBAG smije sadržavati samo brojeve", helpers.regex(/^[0-9]+$/)),
		exactLength: helpers.withMessage("JMBAG mora sadržavati točno 10 brojeva", exactLength(10)),
	},
});

const isLoading = ref(false);

const v$ = useVuelidate(rules, form);

async function onSubmit() {
	if (isLoading.value) return;
	isLoading.value = true;
	v$.value.$touch();
	if (v$.value.$invalid) {
		isLoading.value = false;
		snackBarStore.pushMessage("Molimo ispravite sva polja", "danger");
		return;
	}

	if (!fixedUserData.ime_prezime || fixedUserData.ime_prezime === "" || !fixedUserData.email || fixedUserData.email === "") {
		snackBarStore.pushMessage("Greška! Molimo pokušajte ponovo.", "danger");
		isLoading.value = false;
		return;
	}

	if (!selectedProcess.value || selectedProcess.value === "") {
		snackBarStore.pushMessage("Molimo odaberite izvedbu prakse!", "danger");
		isLoading.value = false;
		return;
	}

	try {
		const response = await mainStore.createInternshipInstance(selectedProcess.value, form.godina_studija, form.jmbag);
		if (!response) throw new Error("Process creation failed");
		snackBarStore.pushMessage("Uspješno ste započeli proces prakse!", "success");
		await router.push("/moja-praksa");
	} catch (error) {
		snackBarStore.pushMessage("Proces prakse nije pokrenut. Molimo pokušajte ponovno.", "danger");
	} finally {
		isLoading.value = false;
	}
}

const processSteps = {
	A: ["Pogledajte dostupne zadatke", "Prijavite se na 3 najdraža zadatka", "Pričekajte alokaciju"],
	B: ["Model B ide u dogovoru s nastavnikom", "Praksa već dogovorena ili odrađena", "Prijava zadatka unaprijed"],
};

const selectedProcess = ref("");
</script>

<style scoped>
.process-page {
	position: relative;
	isolation: isolate;
	min-height: 100vh;
	min-height: 100svh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 48px 24px;
	background: theme("colors.fipu_blue") url("/background-blue.jpg") center / cover;
	color: #212529;
}
.process-page::before {
	content: "";
	position: absolute;
	inset: 0;
	z-index: -1;
	backdrop-filter: blur(6px);
	pointer-events: none;
}
.process-panel {
	width: 100%;
	max-width: 1120px;
	overflow: hidden;
	border-radius: 16px;
	background: white;
	box-shadow: 0 20px 60px -24px rgb(23 34 52 / 22%);
}
.process-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 24px;
	padding: 16px 40px;
	border-bottom: 1px solid #e5e7eb;
}
.faculty-logo { width: 240px; max-width: 100%; height: auto; }
.process-page a, .login-return { color: theme("colors.fipu_blue"); text-underline-offset: 4px; }
.process-page a:hover, .login-return:hover { text-decoration: underline; }
.process-page :is(a, button:not([role="combobox"])):focus-visible { outline: 3px solid theme("colors.fipu_blue"); outline-offset: 5px; }
.process-page ::selection { background: theme("colors.fipu_light_blue"); color: #172234; }
.header-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 24px; }
.login-return { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; font-size: 14px; font-weight: 600; }
.help-link { display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0; padding: 12px 0; font-size: 14px; font-weight: 600; }
.process-intro { display: flex; align-items: center; gap: 20px; padding: 32px 40px; }
.praksa-logo { width: 80px; height: auto; flex-shrink: 0; }
h1 { max-width: 28ch; font-size: clamp(28px, 3vw, 36px); font-weight: 700; line-height: 1.2; letter-spacing: -0.03em; text-wrap: balance; }
.process-form { display: grid; grid-template-columns: 1.1fr 1fr; background: white; }
.process-options { min-width: 0; display: flex; flex-direction: column; gap: 16px; padding: 0 40px 32px; }
.process-help { margin-top: 4px; color: #4b5563; font-size: 14px; line-height: 1.7; }
.process-help a { text-decoration: underline; }
.student-details { grid-column: 2; grid-row: 1 / 3; min-width: 0; padding: 32px; background: #f9fafb; }
h2 { margin-bottom: 24px; font-size: 22px; font-weight: 600; letter-spacing: -0.02em; }
.student-details :deep(.form-field-label) { font-size: 14px; font-weight: 600; }
.start-button { width: 100%; min-height: 48px; color: #172234; font-weight: 600; }
@media (max-width: 1024px) {
	.process-page { align-items: flex-start; padding: 32px 24px; background: white; }
	.process-panel { max-width: 640px; border-radius: 0; box-shadow: none; }
	.process-header { padding: 0 0 16px; gap: 16px; }
	.faculty-logo { width: 220px; }
	.process-intro { padding: 32px 0; }
	.process-form { grid-template-columns: 1fr; }
	.process-options { padding: 0 0 28px; }
	.student-details { grid-column: auto; grid-row: auto; padding: 28px 0; border-top: 1px solid #e5e7eb; background: white; }
}
@media (max-width: 640px) {
	.process-page { padding: 24px 20px; }
	.process-header { padding-bottom: 16px; }
	.faculty-logo { width: 200px; }
	.help-link { display: none; }
	.process-intro { gap: 12px; padding: 28px 0; }
	.praksa-logo { width: 64px; }
	h1 { font-size: clamp(24px, 6vw, 32px); }
}
</style>
