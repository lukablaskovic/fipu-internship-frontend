<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";

import SectionSplitHorizontally from "@/components/SectionSplitHorizontally.vue";

import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";

import { mainStore } from "@/main";

const form = reactive({
  email: "admin@fipu.hr",
  password: "123456",
  remember: true,
});
const router = useRouter();

async function onSubmit() {
  let result = await mainStore.login(form.email, form.password);
  if (result) router.push("/dashboard");
}
</script>

<template>
  <SectionSplitHorizontally bg="blue">
    <div class="flex flex-row overflow-hidden rounded-lg p-12 h-screen">
      <CardBox class="flex-1 rounded-l-lg justify-center items-center">
        <div>
          <img
            src="login_art.jpg"
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
          Molimo prijavite se kako biste pregledali stanje vaše prakse ili
          prijavili zadatke. Ukoliko želite samo pregledati dostupne zadatke i
          poduzeća, molimo nastavite kao gost
          <a
            class="text-fipu_blue cursor-pointer"
            @click="router.push('/dostupni-zadaci')"
            >ovdje</a
          >.
        </h2>

        <div class="w-full px-4">
          <FormField label="E-mail" help="Molimo unesite vašu e-mail adresu">
            <FormControl
              v-model="form.email"
              :icon="mdiAccount"
              name="email"
              autocomplete="username"
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

          <div class="text-right mb-2">
            <a href="#" class="text-sm">Zaboravili ste lozinku?</a>
          </div>

          <FormCheckRadio
            v-model="form.remember"
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
