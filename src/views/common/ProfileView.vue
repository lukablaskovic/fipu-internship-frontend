<script setup>
import { reactive } from "vue";
import { mainStore } from "@/main.js";

import {
  mdiAccount,
  mdiAccountCircle,
  mdiEmail,
  mdiAsterisk,
  mdiFormTextboxPassword,
  mdiCardAccountDetails,
  mdiSchool,
  mdiCheckDecagram,
  mdiPencil,
  mdiDomain,
} from "@mdi/js";

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
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiAccount"
        title="Korisnički profil"
        main
      >
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <CardBox flex="flex-row" class="items-center">
          <div class="flex justify-start items-start">
            <UserAvatarCurrentUserWithUpload
              class="w-24 h-24 md:w-36 md:h-36 mr-6"
            />
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <div class="flex justify-start items-center mb-3">
                  <h1 class="text-2xl mr-1.5">
                    {{ mainStore.currentUser.ime }}
                    {{ mainStore.currentUser.prezime }}
                  </h1>
                  <BaseIcon
                    :path="mdiCheckDecagram"
                    :size="22"
                    class="text-blue-400"
                  />
                </div>
                <BaseButton
                  :icon="mdiPencil"
                  color="lightDark"
                  small
                  rounded-full
                />
              </div>

              <BaseButtons class="text-gray-500">
                <PillTagPlain
                  v-if="mainStore.userAdmin"
                  label="Admin"
                  :icon="mdiAccountCircle"
                />
                <PillTagPlain v-else label="Student" :icon="mdiAccountCircle" />
                <PillTagPlain label="FIPU" :icon="mdiDomain" />
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
        <CardBox is-form>
          <FormField label="Avatar" help="Max 500kb">
            <FormFilePicker label="Prenesi" color="fipu_blue" />
          </FormField>
          <FormField
            v-if="profileForm.type != 'student'"
            label="Korisničko ime"
          >
            <FormControl
              v-model="profileForm.username"
              :icon="mdiAccount"
              readonly
              name="userName"
              autocomplete="userName"
            />
          </FormField>
          <FormField label="Ime">
            <FormControl
              v-model="profileForm.ime"
              :icon="mdiAccount"
              name="ime"
              readonly
              autocomplete="ime"
            />
          </FormField>
          <FormField label="Prezime">
            <FormControl
              v-model="profileForm.prezime"
              :icon="mdiAccount"
              name="prezime"
              readonly
              autocomplete="prezime"
            />
          </FormField>
          <FormField label="E-mail">
            <FormControl
              v-model="profileForm.email"
              :icon="mdiEmail"
              type="email"
              name="email"
              readonly
              autocomplete="email"
            />
          </FormField>
          <div v-if="!mainStore.userAdmin">
            <FormField label="JMBAG">
              <FormControl
                v-model="profileForm.JMBAG"
                :icon="mdiCardAccountDetails"
                type="JMBAG"
                name="JMBAG"
                readonly
                autocomplete="JMBAG"
              />
            </FormField>

            <FormField label="Godina studija">
              <FormControl
                :v-model="
                  StudentMappings.getGodinaStudija(profileForm.godina_studija)
                "
                :icon="mdiSchool"
                type="godina_studija"
                name="godina_studija"
                readonly
                autocomplete="godina_studija"
              />
            </FormField>
          </div>
        </CardBox>

        <CardBox is-form>
          <FormField
            label="Trenutna lozinka"
            help="Obavezno. Vaša trenutna lozinka"
          >
            <FormControl
              v-model="passwordForm.password_current"
              :icon="mdiAsterisk"
              name="password_current"
              type="password"
              required
              autocomplete="current-password"
            />
          </FormField>

          <BaseDivider />

          <FormField label="Nova lozinka" help="Obavezno. Vaša nova lozinka">
            <FormControl
              v-model="passwordForm.password"
              :icon="mdiFormTextboxPassword"
              name="password"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <FormField
            label="Potvrdi lozinku"
            help="Obavezno. Nova lozinka još jednom"
          >
            <FormControl
              v-model="passwordForm.password_confirmation"
              :icon="mdiFormTextboxPassword"
              name="password_confirmation"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <BaseButtons>
            <BaseButton type="submit" color="fipu_blue" label="Ažuriraj!" />
          </BaseButtons>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
