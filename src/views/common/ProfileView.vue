<script setup>
import { useVuelidate } from "@vuelidate/core";
import { reactive, ref, computed } from "vue";
import { mainStore } from "@/main.js";
import Utils from "@/helpers/utils";

import { required, minLength, sameAs, helpers, not } from "@vuelidate/validators";

import { containsAlpha, containsNumeric, getFirstErrorForField } from "@/helpers/validators";

import { mdiAccount, mdiAccountCircle, mdiEmail, mdiAsterisk, mdiFormTextboxPassword, mdiCardAccountDetails, mdiSchool, mdiCheckDecagram, mdiPencil, mdiDomain, mdiAlert, mdiCheckCircle, mdiCalendarAccount } from "@mdi/js";

import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import UserAvatarCurrentUser from "@/components/Premium/UserAvatarCurrentUser.vue";
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
</script>

<template>
	<LayoutAuthenticated>
		<SectionMain>
			<SectionTitleLineWithButton :icon="mdiAccount" title="Korisnički profil" main />

			<div class="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
				<CardBox flex="flex-row" class="items-center rounded">
					<div class="flex items-start justify-start">
						<UserAvatarCurrentUser class="mr-6 h-24 w-24 md:h-36 md:w-36" />

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
			</div>
		</SectionMain>
	</LayoutAuthenticated>
</template>
