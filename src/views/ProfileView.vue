<script setup>
import { reactive } from "vue";
import { mainStore } from "@/main.js";

import {
  mdiAccount,
  mdiMail,
  mdiAsterisk,
  mdiFormTextboxPassword,
  mdiCardAccountDetails,
  mdiSchool,
} from "@mdi/js";

import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import FormFilePicker from "@/components/FormFilePicker.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import UserCard from "@/components/UserCard.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

const profileForm = reactive({
  username: mainStore.currentUser.username,
  name: mainStore.currentUser.name,
  surname: mainStore.currentUser.surname,
  jmbag: mainStore.currentUser.jmbag,
  type: mainStore.currentUser.type,
  year_of_study: mainStore.currentUser.year_of_study,
  email: mainStore.currentUser.email,
});

const passwordForm = reactive({
  password_current: "",
  password: "",
  password_confirmation: "",
});

const submitProfile = () => {
  mainStore.setUser(profileForm);
};

const submitPass = () => {
  //
};
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

      <UserCard class="mb-6" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardBox is-form @submit.prevent="submitProfile">
          <FormField label="Avatar" help="Max 500kb">
            <FormFilePicker label="Prenesi" />
          </FormField>
          <FormField
            v-if="profileForm.type != 'student'"
            label="Korisničko ime"
            help="Obavezno. Vaše korisničko ime"
          >
            <FormControl
              v-model="profileForm.username"
              :icon="mdiAccount"
              name="userName"
              required
              autocomplete="userName"
            />
          </FormField>
          <FormField label="Ime" help="Obavezno. Vaše ime">
            <FormControl
              v-model="profileForm.name"
              :icon="mdiAccount"
              name="name"
              required
              autocomplete="name"
            />
          </FormField>
          <FormField label="Prezime" help="Obavezno. Vaše prezime">
            <FormControl
              v-model="profileForm.surname"
              :icon="mdiAccount"
              name="prezime"
              required
              autocomplete="prezime"
            />
          </FormField>
          <FormField label="E-mail" help="Obavezno. Vaša e-mail adresa">
            <FormControl
              v-model="profileForm.email"
              :icon="mdiMail"
              type="email"
              name="email"
              required
              autocomplete="email"
            />
          </FormField>

          <FormField label="JMBAG" help="Obavezno. Vaš JMBAG">
            <FormControl
              v-model="profileForm.jmbag"
              :icon="mdiCardAccountDetails"
              type="jmbag"
              name="jmbag"
              required
              autocomplete="jmbag"
            />
          </FormField>

          <FormField label="Godina studija" help="Obavezno. Godina studija">
            <FormControl
              v-model="profileForm.year_of_study"
              :icon="mdiSchool"
              type="year_of_study"
              name="year_of_study"
              required
              autocomplete="year_of_study"
            />
          </FormField>

          <BaseButtons>
            <BaseButton color="info" type="submit" label="Ažuriraj!" />
            <BaseButton color="info" label="Dodatno" outline />
          </BaseButtons>
        </CardBox>

        <CardBox is-form @submit.prevent="submitPass">
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
            <BaseButton type="submit" color="info" label="Ažuriraj!" />
            <BaseButton color="info" label="Dodatno" outline />
          </BaseButtons>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
