<script setup>
import { ref, reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, sameAs, helpers, numeric } from "@vuelidate/validators";

import { croatianAlpha, getFirstErrorForField, isUnipuEmail, exactLength, containsAlpha, containsNumeric } from "@/helpers/validators";

import { mdiAccount, mdiAsterisk, mdiLock, mdiCheckCircle, mdiAlert, mdiAlertCircle, mdiEmail, mdiCardAccountDetails, mdiSchool } from "@mdi/js";
import { useRouter } from "vue-router";

import SectionSplitRegister from "@/components/Section/SectionSplitRegister.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";

import { StudentMappings } from "@/helpers/maps";
import Utils from "@/helpers/utils";
import { guestStore } from "@/main";

//Public images
import registerArt from "/register_art.jpg";
import fipu_unipu from "/fipu_unipu.png";

let data_confirmed = ref(false);

const registerForm = reactive({
	ime: "",
	prezime: "",
	email: "",
	JMBAG: "",
	godina_studija: StudentMappings.GodinaStudijaMappings[0],
	password: "",
	passwordConfirm: "",
});
const password = computed(() => registerForm.password);
const rules = {
	ime: {
		required: helpers.withMessage("Polje je obavezno", required),
		croatianAlpha: helpers.withMessage("Polje smije sadržavati samo slova", croatianAlpha),
	},
	prezime: {
		required: helpers.withMessage("Polje je obavezno", required),
		croatianAlpha: helpers.withMessage("Polje smije sadržavati samo slova", croatianAlpha),
	},
	JMBAG: {
		required: helpers.withMessage("Polje je obavezno", required),
		numeric: helpers.withMessage("Polje smije sadržavati samo brojeve", numeric),
		exactLength: helpers.withMessage("JMBAG mora sadržavati točno 10 znamenki", exactLength(10)),
	},
	godina_studija: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	email: {
		required: helpers.withMessage("Polje je obavezno", required),
		email: helpers.withMessage("Molimo unesite ispravnu e-mail adresu", email),
		isUnipuEmail: helpers.withMessage("Molimo unesite vašu UNIPU e-mail adresu", isUnipuEmail),
	},
	password: {
		required: helpers.withMessage("Polje je obavezno", required),
		minLength: helpers.withMessage("Lozinka mora sadržavati minimalno 6 znakova", minLength(6)),

		containsAlpha: helpers.withMessage("Lozinka mora sadržavati barem jedno slovo", containsAlpha),
		containsNumeric: helpers.withMessage("Lozinka mora sadržavati barem jedan broj", containsNumeric),
	},
	passwordConfirm: {
		required: helpers.withMessage("Polje je obavezno", required),
		sameAs: helpers.withMessage("Lozinke se ne podudaraju", sameAs(password)),
	},
};
const v$ = useVuelidate(rules, registerForm);

const isLoading = ref(false);
const router = useRouter();

async function onSubmit() {
	isLoading.value = true;

	const validationResult = await v$.value.$validate();
	if (!validationResult) {
		isLoading.value = false;
		return;
	}

	let postData = {
		...registerForm,
		godina_studija: registerForm.godina_studija.dbLabel,
	};
	delete postData.passwordConfirm;

	let registrationResult = await guestStore.registerStudent(postData);
	isLoading.value = false;

	if (registrationResult.response && registrationResult.response.status === 400) {
		showNotificationBar("warning");
	} else if (registrationResult.response && registrationResult.response.status === 500) {
		showNotificationBar("danger");
	} else {
		let instanceCreationResult = await guestStore.createInternshipInstance();
		if (instanceCreationResult.status !== 500) {
			await guestStore.update_process_instance(registrationResult.data.id, instanceCreationResult.id);
			showNotificationBar("success");
			await Utils.wait(2);
			router.push("/login");
		} else {
			//Bpmn engine je pao
			//Treba izbrisati podatek o studentu ako se ovo dogodi, ili bolje provjeriti postoje li vec i samo dodati instancu
			showNotificationBar("danger");
			return;
		}
	}
}
const notificationBar = ref(null);
let notificationStatus = ref();
let notificationMessage = ref();

const notificationSettingsModel = ref([]);
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf("outline") > -1);
function showNotificationBar(type) {
	switch (type) {
		case "success":
			notificationBar.value.color = "success";
			notificationBar.value.icon = mdiCheckCircle;
			notificationBar.value.duration = 1;
			notificationStatus.value = "To je to!";
			notificationMessage.value = " Uspješna registracija!";
			break;
		case "warning":
			notificationBar.value.color = "warning";
			notificationBar.value.icon = mdiAlert;
			notificationStatus.value = "Upozorenje.";
			notificationMessage.value = " Račun s ovim podacima već postoji.";
			break;
		case "danger":
			notificationBar.value.color = "danger";
			notificationBar.value.icon = mdiAlertCircle;
			notificationStatus.value = "Greška!";
			notificationMessage.value = "Sustav ne radi. Nije do vas, molimo pokušajte opet ili kontaktirajte voditelja prakse.";
			break;
	}
	notificationBar.value.show();
}

const transitioning = ref(false);
function onPrijavaClick() {
	transitioning.value = true;
}
function navigateToLogin() {
	router.push("/login");
}
</script>

<template>
	<SectionSplitRegister bg="blue" class="flex items-start min-h-screen">
		<Transition appear enter-active-class="animate__animated animate__slideInLeft fast-animation" leave-active-class="animate__animated animate__slideOutLeft fast-animation" @after-leave="navigateToLogin">
			<div v-if="!transitioning" class="flex flex-col justify-center items-center overflow-hidden h-screen md:py-4 md:px-4 || transition-all duration-300">
				<div class="flex flex-col md:flex-row flex-shrink h-full rounded-lg overflow-hidden">
					<div class="flex flex-col md:flex-row flex-shrink h-full || bg-white overflow-y-auto fipu_vertical_scrollbar || transition-all duration-300 px-0 lg:px-6 xl:px-16 2xl:px-28 || xl:gap-4 2xl:gap-8">
						<CardBox has-table class="hidden xl:flex justify-center items-center flex-1 bg-opacity-0 grow p-16 xl:px-0 xl:py-16 2xl:py-24 || transition-all duration-300">
							<img :src="registerArt" alt="Register graphics" class="2xl:pr-8 aspect-square max-h-full" />
						</CardBox>

						<CardBox has-table class="flex flex-col flex-shrink flex-1 bg-opacity-0 p-8 sm:p-16 xl:pl-2 xl:px-0 xl:py-24 || transition-all duration-300" is-form @submit.prevent="onSubmit">
							<a href="https://fipu.unipu.hr/" target="_blank">
								<img :src="fipu_unipu" alt="fipu logo" class="h-20 xl:h-20 mb-6 object-contain transition-all duration-300" />
							</a>
							<h2 class="text-2xl lg:text-3xl 2xl:text-4xl text-fipu_gray font-bold xl:mb-1 mb-2 md:mb-0 2xl:mb-4">Molimo unesite vaše podatke</h2>
							<h2 class="md:text-sm lg:text-sm 2xl:text-base mb-2 2xl:mb-4 text-justify">
								Već imate račun ili želite samo pregledati zadatke? Povratak na prijavu
								<a class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue" @click.prevent="onPrijavaClick()">ovdje</a>.
							</h2>

							<div class="flex flex-col md:flex-row gap-6 md:gap-2">
								<div class="flex flex-col flex-1">
									<FormField label="Ime">
										<FormControl v-model="registerForm.ime" :icon-left="mdiAccount" :error="getFirstErrorForField(v$, 'ime')" name="ime" autocomplete="ime" />
									</FormField>

									<FormField label="Prezime">
										<FormControl v-model="registerForm.prezime" :icon-left="mdiAccount" :error="getFirstErrorForField(v$, 'prezime')" name="prezime" autocomplete="prezime" />
									</FormField>

									<FormField label="JMBAG">
										<FormControl v-model="registerForm.JMBAG" :icon-left="mdiCardAccountDetails" :error="getFirstErrorForField(v$, 'JMBAG')" name="JMBAG" autocomplete="JMBAG" />
									</FormField>

									<FormField label="UNIPU E-mail">
										<FormControl v-model="registerForm.email" :icon-left="mdiEmail" :error="getFirstErrorForField(v$, 'email')" name="email" autocomplete="username" />
									</FormField>
								</div>
								<div class="flex flex-col flex-1">
									<FormField label="Godina studija">
										<FormControl v-model="registerForm.godina_studija" :icon-left="mdiSchool" :error="getFirstErrorForField(v$, 'godina_studija')" :options="StudentMappings.GodinaStudijaMappings" />
									</FormField>

									<FormField label="Lozinka">
										<FormControl v-model="registerForm.password" :icon-left="mdiLock" :error="getFirstErrorForField(v$, 'password')" type="password" name="password" autocomplete="current-password" />
									</FormField>

									<FormField label="Potvrda lozinke">
										<FormControl v-model="registerForm.passwordConfirm" :icon-left="mdiLock" :error="getFirstErrorForField(v$, 'passwordConfirm')" type="password" name="passwordConfirm" />
									</FormField>

									<div class="mt-2 lg:mt-8 flex items-center">
										<FormCheckRadio v-model="data_confirmed" name="data_confirmed" type="checkbox" label="Potvrđujem ispravnost podataka." :input-value="true" />
									</div>
								</div>
							</div>

							<BaseButtons class="space-y-2 mt-4 lg:mt-8">
								<BaseButton :disabled="!data_confirmed" type="submit" color="fipu_light_blue" label="Registriraj se" :loading="isLoading" class="w-full" />
							</BaseButtons>

							<NotificationBar ref="notificationBar" class="animate__animated animate__fadeInUp mt-2" :outline="notificationsOutline">
								<b>{{ notificationStatus }}</b> {{ notificationMessage }}
								<template #right>
									<BaseButton :icon="mdiClose" :color="notificationsOutline ? 'success' : 'white'" :outline="notificationsOutline" rounded-full small />
								</template>
							</NotificationBar>
						</CardBox>
					</div>
				</div>
			</div>
		</Transition>
	</SectionSplitRegister>
</template>

<style scoped>
html,
body {
	overflow-y: auto;
}

.fast-animation {
	animation-duration: 0.4s;
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
</style>
