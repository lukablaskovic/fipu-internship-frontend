<script setup>
import { ref, reactive } from "vue";

import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";

import SectionSplitHorizontally from "@/components/SectionSplitHorizontally.vue";

import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";

import { mainStore, guestStore } from "@/main";

const router = useRouter();

const selectYearOfStudy = [
  { id: 1, label: "3. prijediplomski", dbLabel: "3_prijediplomski" },
  { id: 2, label: "1. diplomski", dbLabel: "1_diplomski" },
  { id: 3, label: "2. diplomski", dbLabel: "2_diplomski" },
];

let data_confirmed = ref(false);

const form = reactive({
  name: "",
  surname: "",
  email: "",
  jmbag: "",
  year_of_study: selectYearOfStudy[0],
  password: "",
});

let passwordConfirm = "";

async function onSubmit() {
  let postData = {
    ...form,
    year_of_study: form.year_of_study.dbLabel,
  };
  console.log("postData", postData);
  let result = await guestStore.registerStudent(postData);
  if (result) router.push("/login");
}
</script>

<template>
  <SectionSplitHorizontally bg="blue">
    <div class="flex flex-row overflow-hidden rounded-lg p-24 h-screen">
      <CardBox class="flex-1 rounded-l-lg justify-center items-center">
        <div>
          <img
            src="register_art.jpg"
            alt="Login graphics"
            class="max-w-full h-auto"
          />
        </div>
      </CardBox>

      <CardBox
        class="flex-1 flex flex-col justify-center items-center space-y-4 rounded-r-lg"
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
          Dobrodošli na FIPU Internship Dashboard
        </h2>
        <h2 class="mb-4 text-center">
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
              <FormField label="Godina studija">
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
