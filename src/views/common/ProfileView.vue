<script setup>
import { reactive, ref, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { mainStore } from "@/main.js";
import Utils from "@/helpers/utils";

import { required, minLength, sameAs, helpers, not } from "@vuelidate/validators";

import { containsAlpha, containsNumeric, getFirstErrorForField } from "@/helpers/validators";

import { mdiAccount, mdiAccountCircle, mdiEmail, mdiAsterisk, mdiFormTextboxPassword, mdiCardAccountDetails, mdiSchool, mdiCheckDecagram, mdiPencil, mdiDomain, mdiAlert, mdiCheckCircle } from "@mdi/js";

import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import FormFilePicker from "@/components/Form/FormFilePicker.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import { StudentMappings } from "@/helpers/maps.js";
import UserAvatarCurrentUserWithUpload from "@/components/Premium/UserAvatarCurrentUserWithUpload.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import SectionBannerProfile from "@/components/Premium/SectionBannerProfile.vue";
import PillTagPlain from "@/components/PillTag/PillTagPlain.vue";

const profileForm = reactive({
	username: mainStore.currentUser.username,
	ime: mainStore.currentUser.ime,
	prezime: mainStore.currentUser.prezime,
	JMBAG: mainStore.currentUser.JMBAG,
	account_type: mainStore.currentUser.account_type,
	godina_studija: mainStore.currentUser.godina_studija,
	email: mainStore.currentUser.email,
});

const passwordForm = reactive({
	password_current: "",
	password: "",
	password_confirmation: "",
});
const password = computed(() => passwordForm.password);
const password_current = computed(() => passwordForm.password_current);
const rules = {
	password_current: {
		required: helpers.withMessage("Polje je obavezno", required),
	},
	password: {
		sameAs: helpers.withMessage("Nova lozinka ne smije biti identična staroj", not(sameAs(password_current))),
		required: helpers.withMessage("Polje je obavezno", required),
		minLength: helpers.withMessage("Lozinka mora sadržavati minimalno 6 znakova", minLength(6)),
		containsAlpha: helpers.withMessage("Lozinka mora sadržavati barem jedno slovo", containsAlpha),
		containsNumeric: helpers.withMessage("Lozinka mora sadržavati barem jedan broj", containsNumeric),
	},
	password_confirmation: {
		required: helpers.withMessage("Polje je obavezno", required),
		sameAs: helpers.withMessage("Lozinke se ne podudaraju", sameAs(password)),
	},
};
const v$ = useVuelidate(rules, passwordForm);

const isLoading = ref(false);
async function onSubmit() {
	isLoading.value = true;
	v$.value.$touch();
	if (v$.value.$invalid) {
		isLoading.value = false;
		return;
	}
	let response = await mainStore.updatePassword(passwordForm.password_current, passwordForm.password);
	if (response.message == "Invalid old password. Please try again.") showNotificationBar("warning");
	else showNotificationBar("success");
	await Utils.wait(3);
	isLoading.value = false;
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
			notificationMessage.value = " Uspješno promijenjena lozinka!";
			break;
		case "warning":
			notificationBar.value.color = "warning";
			notificationBar.value.icon = mdiAlert;
			notificationBar.value.duration = 1;
			notificationStatus.value = "Upozorenje.";
			notificationMessage.value = " Pogrešna stara lozinka. Molimo pokušajte ponovno.";
			break;
	}
	notificationBar.value.show();
}
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiAccount" title="Korisnički Profil" main />

			<div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
				<CardBox flex="flex-row" class="items-center rounded">
					<div class="flex justify-start items-start">
						<UserAvatarCurrentUserWithUpload class="w-24 h-24 md:w-36 md:h-36 mr-6" />

						<div class="flex-1">
							<div class="flex justify-between items-center">
								<div class="flex justify-start items-center mb-3">
									<h1 class="text-2xl mr-1.5">
										{{ mainStore.currentUser.ime }}
										{{ mainStore.currentUser.prezime }}
									</h1>
									<BaseIcon :path="mdiCheckDecagram" :size="22" class="text-blue-400" />
								</div>
								<BaseButton :icon="mdiPencil" color="lightDark" small rounded-full />
							</div>

							<BaseButtons class="text-fipu_gray dark:text-gray-300">
								<PillTagPlain :reverse-dark="true" v-if="mainStore.userAdmin" label="Admin" :icon="mdiAccountCircle" />
								<PillTagPlain :reverse-dark="true" v-else label="Student" :icon="mdiAccountCircle" />
								<PillTagPlain :reverse-dark="true" label="FIPU" :icon="mdiDomain" />
							</BaseButtons>

							<BaseButtons class="mt-6" class-addon="mr-9 last:mr-0 mb-3">
								<!-- <UserCardProfileNumber :number="499" label="Likes" /> -->
							</BaseButtons>
						</div>
					</div>
				</CardBox>
				<SectionBannerProfile />
			</div>

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<CardBox is-form class="rounded">
					<FormField label="Avatar" help="Max 500kb">
						<FormFilePicker label="Prenesi" color="fipu_blue" />
					</FormField>

					<FormField v-if="profileForm.account_type != 'student'" label="Korisničko ime">
						<FormControl v-model="profileForm.username" :icon="mdiAccount" readonly name="userName" autocomplete="userName" />
					</FormField>

					<FormField label="Ime">
						<FormControl v-model="profileForm.ime" :icon="mdiAccount" name="ime" readonly autocomplete="ime" />
					</FormField>

					<FormField label="Prezime">
						<FormControl v-model="profileForm.prezime" :icon="mdiAccount" name="prezime" readonly autocomplete="prezime" />
					</FormField>

					<FormField label="E-mail">
						<FormControl v-model="profileForm.email" :icon="mdiEmail" type="email" name="email" readonly autocomplete="email" />
					</FormField>

					<div v-if="!mainStore.userAdmin">
						<FormField label="JMBAG">
							<FormControl v-model="profileForm.JMBAG" :icon="mdiCardAccountDetails" type="JMBAG" name="JMBAG" readonly autocomplete="JMBAG" />
						</FormField>

						<FormField label="Godina studija">
							<FormControl :modelValue="StudentMappings.getGodinaStudija(profileForm.godina_studija)" :icon="mdiSchool" type="JMBAG" name="JMBAG" readonly autocomplete="JMBAG" />
						</FormField>
					</div>
				</CardBox>

				<CardBox is-form class="rounded" @submit.prevent="onSubmit">
					<FormField label="Trenutna lozinka" help="Obavezno. Vaša trenutna lozinka">
						<FormControl v-model="passwordForm.password_current" :icon="mdiAsterisk" :error="getFirstErrorForField('password_current')" name="password_current" type="password" required autocomplete="password_current" />
					</FormField>

					<BaseDivider />

					<FormField label="Nova lozinka" help="Obavezno. Vaša nova lozinka">
						<FormControl v-model="passwordForm.password" :icon="mdiFormTextboxPassword" required :error="getFirstErrorForField('password')" type="password" name="password" autocomplete="password" />
					</FormField>

					<FormField label="Potvrdi lozinku" help="Obavezno. Nova lozinka još jednom">
						<FormControl v-model="passwordForm.password_confirmation" :icon="mdiFormTextboxPassword" required :error="getFirstErrorForField('password_confirmation')" type="password" name="password_confirmation" autocomplete="password_confirmation" />
					</FormField>

					<BaseButtons>
						<BaseButton :disabled="isLoading" :loading="isLoading" type="submit" color="fipu_blue" label="Ažuriraj!" />
					</BaseButtons>

					<NotificationBar ref="notificationBar" class="animate__animated animate__fadeInUp mt-2" :outline="notificationsOutline">
						<b>{{ notificationStatus }}</b> {{ notificationMessage }}
						<template #right>
							<BaseButton :icon="mdiClose" :color="notificationsOutline ? 'success' : 'white'" :outline="notificationsOutline" rounded-full small />
						</template>
					</NotificationBar>
				</CardBox>
			</div>
		</SectionMain>
	</LayoutAuthenticated>
</template>
