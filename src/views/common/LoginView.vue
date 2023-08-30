<script setup>
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import { mdiAlertCircle, mdiCheckCircle, mdiAlert, mdiClose } from "@mdi/js";
import SectionSplitHorizontally from "@/components/Section/SectionSplitHorizontally.vue";

import CardBox from "@/components/Cardbox/CardBox.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";

import { mainStore } from "@/main";
import Utils from "@/helpers/utils";

const loginForm = reactive({
  email: "admin@fipu.hr",
  password: "123456",
  remember_me: false,
});
const router = useRouter();

async function onSubmit() {
  let loginResult = await mainStore.login(loginForm);
  if (mainStore.userAuthenticated) {
    showNotificationBar("success");
    await Utils.wait(1);
    mainStore.handleSuccessfulLogin();
  } else if (loginResult.response.status === 403)
    showNotificationBar("warning");
  else showNotificationBar("danger");
}

const notificationBar = ref(null);
let notificationStatus = ref();
let notificationMessage = ref();

const notificationSettingsModel = ref([]);
const notificationsOutline = computed(
  () => notificationSettingsModel.value.indexOf("outline") > -1
);
function showNotificationBar(type) {
  switch (type) {
    case "success":
      notificationBar.value.color = "success";
      notificationBar.value.icon = mdiCheckCircle;
      notificationBar.value.duration = 1;
      notificationStatus.value = "To je to!";
      notificationMessage.value = " Uspješna prijava!";
      break;
    case "warning":
      notificationBar.value.color = "warning";
      notificationBar.value.icon = mdiAlert;
      notificationStatus.value = "Upozorenje.";
      notificationMessage.value =
        "Unijeli ste krive podatke. Provjerite unos i pokušajte ponovno.";
      break;
    case "danger":
      notificationBar.value.color = "danger";
      notificationBar.value.icon = mdiAlertCircle;
      notificationStatus.value = "Greška!";
      notificationMessage.value =
        "Greška u sustavu. Nije do vas, molimo pokušajte opet ili kontaktirajte profesora.";
      break;
  }
  notificationBar.value.show();
}
</script>

<template>
  <SectionSplitHorizontally bg="blue">
    <div
      class="flex flex-col md:flex-row overflow-hidden md:rounded-lg md:p-8 md:h-screen"
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
        class="flex-1 flex flex-col md:rounded-r-lg pt-12 pb-12 justify-center items-center space-y-4"
        is-form
        @submit.prevent="onSubmit"
      >
        <div>
          <img
            src="fipu_hr.png"
            alt="fipu logo"
            class="w-36 h-36 object-cover mx-auto"
          />
        </div>
        <h2
          class="text-2xl md:text-4xl text-center text-fipu_gray font-bold mb-4 mt-4"
        >
          Dobrodošli na <span class="text-fipu_blue">FIPU Praksa</span>
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
        <NotificationBar
          ref="notificationBar"
          class="animate__animated animate__fadeInUp mt-4"
          :outline="notificationsOutline"
        >
          <b>{{ notificationStatus }}</b> {{ notificationMessage }}
          <template #right>
            <BaseButton
              :icon="mdiClose"
              :color="notificationsOutline ? 'success' : 'white'"
              :outline="notificationsOutline"
              rounded-full
              small
            />
          </template>
        </NotificationBar>
      </CardBox>
    </div>
  </SectionSplitHorizontally>
  <div></div>
</template>
