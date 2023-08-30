<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";

import SectionSplitHorizontally from "@/components/Section/SectionSplitHorizontally.vue";

import CardBox from "@/components/Cardbox/CardBox.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";

import { mainStore } from "@/main";

const loginForm = reactive({
  email: "admin@fipu.hr",
  password: "123456",
  remember_me: false,
});
const router = useRouter();

async function onSubmit() {
  await mainStore.login(loginForm);
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
            src="login_art.jpg"
            alt="Login graphics"
            class="max-w-full h-auto"
          />
        </div>
      </CardBox>

      <CardBox
        class="flex-1 flex flex-col md:rounded-r-lg p-3 justify-center items-center space-y-4"
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
        <h2 class="text-2xl md:text-4xl text-center font-bold mb-4 mt-4">
          Dobrodošli na FIPU Internship Dashboard
        </h2>
        <h2 class="mb-4 text-center">
          Molimo prijavite se kako biste pregledali stanje vaše prakse ili
          prijavili zadatke. Ukoliko želite samo pregledati dostupne zadatke i
          poduzeća, molimo nastavite kao gost
          <a
            class="text-fipu_blue cursor-pointer"
            @click="router.push('/moja-praksa')"
            >ovdje</a
          >.
        </h2>

        <div class="w-full px-4">
          <FormField label="E-mail" help="Molimo unesite vašu e-mail adresu">
            <FormControl
              v-model="loginForm.email"
              :icon="mdiAccount"
              name="email"
              autocomplete="username"
            />
          </FormField>

          <FormField label="Lozinka" help="Molimo unesite vašu lozinku">
            <FormControl
              v-model="loginForm.password"
              :icon="mdiAsterisk"
              type="password"
              name="password"
              autocomplete="current-password"
            />
          </FormField>

          <div class="text-right mb-2">
            <a href="#" class="text-sm">Zaboravili ste lozinku?</a>
          </div>

          <FormCheckRadio
            v-model="loginForm.remember_me"
            name="remember"
            label="Zapamti me!"
            :input-value="true"
          />

          <BaseButtons class="space-y-2 mt-6">
            <BaseButton
              type="submit"
              color="fipu_blue"
              label="Prijavi se"
              class="w-full"
            />
          </BaseButtons>
          <!-- Separator between social media sign in and email/password sign in -->
          <div
            class="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300"
          >
            <p class="mx-4 mb-0 text-center dark:text-white">ili</p>
          </div>
          <BaseButtons class="space-y-2 mt-6">
            <BaseButton
              color="fipu_blue"
              outline
              to="/register"
              label="Registriraj se"
              class="w-full"
            />
          </BaseButtons>
        </div>
        <!-- Form Ends -->
      </CardBox>
    </div>
  </SectionSplitHorizontally>
</template>
