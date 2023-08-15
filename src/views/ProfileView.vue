<script setup>
import { reactive } from "vue";
import { useMainStore } from "@/stores/main";
import { useUserStore } from "@/stores/user";

import {
  mdiAccount,
  mdiMail,
  mdiAsterisk,
  mdiFormTextboxPassword,
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

const mainStore = useMainStore();
const userStore = useUserStore();

const profileForm = reactive({
  userName: userStore.currentUser.username,
  realName: userStore.currentUser.ime_prezime,
  email: userStore.currentUser.email,
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
          <FormField label="Slika profila" help="Max 500kb">
            <FormFilePicker label="Prenesi" />
          </FormField>
          <FormField
            label="Korisničko ime"
            help="Obavezno. Vaše korisničko ime"
          >
            <FormControl
              v-model="profileForm.userName"
              :icon="mdiAccount"
              name="userName"
              required
              autocomplete="userName"
            />
          </FormField>
          <FormField label="Ime i prezime" help="Obavezno. Vaše ime i prezime">
            <FormControl
              v-model="profileForm.realName"
              :icon="mdiAccount"
              name="realName"
              required
              autocomplete="realName"
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

          <template #footer>
            <BaseButtons>
              <BaseButton color="info" type="submit" label="Ažuriraj!" />
              <BaseButton color="info" label="Dodatno" outline />
            </BaseButtons>
          </template>
        </CardBox>

        <CardBox is-form @submit.prevent="submitPass">
          <FormField
            label="Trenutna lozinka"
            help="Required. Vaša trenutna lozinka"
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

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Ažuriraj!" />
              <BaseButton color="info" label="Dodatno" outline />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
