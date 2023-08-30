<script setup>
import { ref, reactive } from "vue";

import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";

import SectionSplitHorizontally from "@/components/Section/SectionSplitHorizontally.vue";

import CardBox from "@/components/Cardbox/CardBox.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";

import { StudentMappings } from "@/helpers/maps";

import { guestStore } from "@/main";

const router = useRouter();

const selectYearOfStudy = [
  { id: 1, label: "3. prijediplomski", dbLabel: "3_prijediplomski" },
  { id: 2, label: "1. diplomski", dbLabel: "1_diplomski" },
  { id: 3, label: "2. diplomski", dbLabel: "2_diplomski" },
];

let data_confirmed = ref(false);

const form = reactive({
  name: "Pero",
  surname: "Peric",
  email: "peric@unipu.hr",
  jmbag: "0303088177",
  year_of_study: selectYearOfStudy[0],
  password: "123456",
});

let passwordConfirm = "";

async function onSubmit() {
  let instanceCreationResult = await guestStore.createInternshipInstance();
  let postData = {
    ...form,
    year_of_study: form.year_of_study.dbLabel,
    process_instance_id: instanceCreationResult.id,
  };

  let registrationResult = await guestStore.registerStudent(postData);

  if (instanceCreationResult && registrationResult) {
    router.push("/login");
  }
}
</script>

<template>
  <SectionSplitHorizontally bg="blue">
    <div
      class="flex flex-col md:flex-row overflow-hidden md:rounded-lg md:p-12 md:h-screen"
    >
      <CardBox
        class="hidden md:block flex-1 md:rounded-l-lg justify-center items-center"
      >
        <div>
          <img
            src="register_art.jpg"
            alt="Login graphics"
            class="max-w-full h-auto"
          />
        </div>
      </CardBox>

      <CardBox
        class="flex-1 flex flex-col justify-center items-center space-y-4 md:rounded-r-lg"
        is-form
        @submit.prevent="onSubmit"
      >
        <div>
          <img
            src="fipu_hr.png"
            alt=""
            class="w-36 h-36 object-cover mx-auto"
          />
        </div>
        <h2 class="text-4xl text-center font-bold mb-4 mt-4">
          Molimo unesite vaše podatke
        </h2>
        <h2 class="mb-4 text-center text-fipu_gray">
          Već imate račun ili želite samo pregledati zadatke? Povratak na
          prijavu
          <a
            class="text-fipu_blue cursor-pointer"
            @click="router.push('/login')"
            >ovdje</a
          >.
        </h2>

        <div class="w-full px-4 lg:flex lg:flex-wrap lg:items-stretch">
          <!-- Column 1 -->
          <div class="lg:w-1/2 px-2 lg:flex lg:flex-col lg:justify-between">
            <div>
              <FormField label="Ime" help="Molimo unesite vaše ime">
                <FormControl
                  v-model="form.name"
                  :icon="mdiAccount"
                  name="name"
                  autocomplete="name"
                />
              </FormField>

              <FormField label="Prezime" help="Molimo unesite vaše prezime">
                <FormControl
                  v-model="form.surname"
                  :icon="mdiAccount"
                  name="surname"
                  autocomplete="surname"
                />
              </FormField>

              <FormField label="JMBAG" help="Molimo unesite vaš JMBAG">
                <FormControl
                  v-model="form.jmbag"
                  :icon="mdiAccount"
                  name="jmbag"
                  autocomplete="jmbag"
                />
              </FormField>

              <FormField
                label="UNIPU E-mail"
                help="Molimo unesite vašu UNIPU e-mail adresu"
              >
                <FormControl
                  v-model="form.email"
                  :icon="mdiAccount"
                  name="email"
                  autocomplete="username"
                />
              </FormField>
            </div>
          </div>

          <!-- Column 2 -->
          <div class="lg:w-1/2 px-2 lg:flex lg:flex-col lg:justify-between">
            <div>
              <FormField
                label="Godina studija"
                help="Odaberite vašu nastavnu godinu"
              >
                <FormControl
                  v-model="form.year_of_study"
                  :options="selectYearOfStudy"
                />
              </FormField>

              <FormField label="Lozinka" help="Molimo unesite vašu lozinku">
                <FormControl
                  v-model="form.password"
                  :icon="mdiAsterisk"
                  type="password"
                  name="password"
                  autocomplete="current-password"
                />
              </FormField>

              <FormField
                label="Potvrda lozinke"
                help="Molimo potvrdite vašu lozinku"
              >
                <FormControl
                  v-model="passwordConfirm"
                  :icon="mdiAsterisk"
                  type="password"
                  name="password-confirmation"
                  autocomplete="current-password"
                />
              </FormField>
              <FormCheckRadio
                v-model="data_confirmed"
                name="data_confirmed"
                type="checkbox"
                label="Potvrđujem ispravnost korisničkih podataka."
                :input-value="true"
              />
            </div>

            <BaseButtons class="space-y-2 mt-4 lg:mt-0">
              <BaseButton
                :disabled="!data_confirmed"
                type="submit"
                color="fipu_light_blue"
                label="Registriraj se"
                class="w-full"
              />
            </BaseButtons>
          </div>
        </div>

        <!-- Form Ends -->
      </CardBox>
    </div>
  </SectionSplitHorizontally>
</template>
