<script setup>
import { useVuelidate } from "@vuelidate/core";
import { reactive, ref, computed } from "vue";
import { mainStore } from "@/main.js";
import Utils from "@/helpers/utils";

import { required, minLength, sameAs, helpers, not } from "@vuelidate/validators";

import { containsAlpha, containsNumeric, getFirstErrorForField } from "@/helpers/validators";

import { mdiAccount, mdiAccountCircle, mdiEmail, mdiAsterisk, mdiFormTextboxPassword, mdiCardAccountDetails, mdiSchool, mdiCheckDecagram, mdiPencil, mdiDomain, mdiAlert, mdiCheckCircle, mdiCalendarAccount } from "@mdi/js";

import UserAvatarCurrentUserWithUpload from "@/components/Premium/UserAvatarCurrentUserWithUpload.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import SectionBannerProfile from "@/components/Premium/SectionBannerProfile.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import PillTagPlain from "@/components/PillTag/PillTagPlain.vue";
import SectionMain from "@/components/Section/SectionMain.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { StudentMappings } from "@/helpers/maps.js";

import moment from "@/moment-setup";

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

const notificationBar = ref(null);
let notificationStatus = ref();
let notificationMessage = ref();

const notificationSettingsModel = ref([]);
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf("outline") > -1);
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiAccount" title="Korisnički profil" main />

			<div class="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
				<CardBox flex="flex-row" class="items-center rounded">
					<div class="flex items-start justify-start">
						<UserAvatarCurrentUserWithUpload class="mr-6 h-24 w-24 md:h-36 md:w-36" />

						<div class="flex-1">
							<div class="flex items-center justify-between">
								<div class="mb-3 flex items-center justify-start">
									<h1 class="mr-1.5 text-2xl">
										{{ mainStore.currentUser.ime }}
										{{ mainStore.currentUser.prezime }}
									</h1>
									<BaseIcon :path="mdiCheckDecagram" :size="22" class="text-blue-400" />
								</div>
							</div>

							<BaseButtons class="text-fipu_gray dark:text-gray-300">
								<PillTagPlain v-if="mainStore.userAdmin" :reverse-dark="true" label="Admin" :icon="mdiAccountCircle" />
								<PillTagPlain v-else :reverse-dark="true" label="Student" :icon="mdiAccountCircle" />
								<PillTagPlain :reverse-dark="true" label="FIPU" :icon="mdiDomain" />
								<PillTagPlain :reverse-dark="true" :label="moment.parseZone(mainStore.currentUser.created_at).format('D. MMMM YYYY.')" :icon="mdiCalendarAccount" />
							</BaseButtons>
						</div>
					</div>
				</CardBox>
				<SectionBannerProfile />
			</div>

			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<CardBox is-form class="rounded">
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
							<FormControl :model-value="StudentMappings.getGodinaStudija(profileForm.godina_studija)" :icon="mdiSchool" type="JMBAG" name="JMBAG" readonly autocomplete="JMBAG" />
						</FormField>
					</div>
				</CardBox>

				<CardBox is-form class="rounded" @submit.prevent="onSubmit">
					<FormField label="Trenutna lozinka" help="Obavezno. Vaša trenutna lozinka">
						<FormControl v-model="passwordForm.password_current" :icon="mdiAsterisk" :error="getFirstErrorForField(v$, 'password_current')" name="password_current" type="password" required autocomplete="password_current" />
					</FormField>

					<BaseDivider />

					<FormField label="Nova lozinka" help="Obavezno. Vaša nova lozinka">
						<FormControl v-model="passwordForm.password" :icon="mdiFormTextboxPassword" required :error="getFirstErrorForField(v$, 'password')" type="password" name="password" autocomplete="password" />
					</FormField>

					<FormField label="Potvrdi lozinku" help="Obavezno. Nova lozinka još jednom">
						<FormControl v-model="passwordForm.password_confirmation" :icon="mdiFormTextboxPassword" required :error="getFirstErrorForField(v$, 'password_confirmation')" type="password" name="password_confirmation" autocomplete="password_confirmation" />
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
