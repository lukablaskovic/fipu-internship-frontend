<script setup>
import { reactive } from "vue";
import { mainStore } from "@/main.js";

import {
  mdiAccount,
  mdiEmail,
  mdiAsterisk,
  mdiFormTextboxPassword,
  mdiCardAccountDetails,
  mdiSchool,
} from "@mdi/js";

import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import BaseDivider from "@/components/Base/BaseDivider.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import FormFilePicker from "@/components/Form/FormFilePicker.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import UserCard from "@/components/User/UserCard.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import { StudentMappings } from "@/helpers/maps.js";

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
              v-model="profileForm.name"
              :icon="mdiAccount"
              name="name"
              readonly
              autocomplete="name"
            />
          </FormField>
          <FormField label="Prezime">
            <FormControl
              v-model="profileForm.surname"
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
                v-model="profileForm.jmbag"
                :icon="mdiCardAccountDetails"
                type="jmbag"
                name="jmbag"
                readonly
                autocomplete="jmbag"
              />
            </FormField>

            <FormField label="Godina studija">
              <FormControl
                :v-model="
                  StudentMappings.getYearOfStudyLabel(profileForm.year_of_study)
                "
                :icon="mdiSchool"
                type="year_of_study"
                name="year_of_study"
                readonly
                autocomplete="year_of_study"
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
