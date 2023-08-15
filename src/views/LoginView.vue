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
import LayoutGuest from "@/layouts/LayoutGuest.vue";

import { useMainStore } from "@/stores/main";

const form = reactive({
  email: "lukablaskovic2000@gmail.com",
  password: "lel",
  remember: true,
});

async function onSubmit() {
  const mainStore = useMainStore();
  let result = await mainStore.login(form.email, form.password);
  if (result) router.push("/dashboard");
}

const router = useRouter();
</script>

<template>
  <LayoutGuest>
    <SectionSplitHorizontally bg="blue">
      <div class="flex flex-row overflow-hidden rounded-lg p-36">
        <CardBox class="flex-1 rounded-l-lg justify-center items-center">
          <div>
            <img src="login_art.jpg" alt="" class="" />
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
          <h2 class="text-4xl font-bold mb-4 mt-4">
            Dobrodošli na FIPU Internship Dashboard
          </h2>
          <h2 class="mb-4 text-center">
            Molimo prijavite se kako biste pregledali stanje vaše prakse ili
            prijavili zadatke. Ukoliko želite samo pregledati dostupne zadatke i
            poduzeća, molimo nastavite kao gost <a href="">ovdje</a>.
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
              <a href="#" class="text-sm">Forgot Password?</a>
            </div>

            <FormCheckRadio
              v-model="form.remember"
              name="remember"
              label="Zapamti me!"
              :input-value="true"
            />

            <BaseButtons class="space-y-2">
              <BaseButton
                type="submit"
                color="info"
                label="Prijavi se"
                class="w-full"
              />
            </BaseButtons>
          </div>
          <!-- Form Ends -->
        </CardBox>
      </div>
    </SectionSplitHorizontally>
  </LayoutGuest>
</template>
