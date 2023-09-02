<script setup>
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import { mdiAlertCircle, mdiCheckCircle, mdiAlert, mdiClose } from "@mdi/js";
import SectionSplitLogin from "@/components/Section/SectionSplitLogin.vue";

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
  <SectionSplitLogin bg="blue" class="flex items-start min-h-screen">
    <div
      class="flex flex-col flex-shrink md:flex-row overflow-hidden md:rounded-lg md:p-4 2xl:p-16 md:h-screen lg:px-12"
    >
      <!--This is graphics image cardbox-->
      <CardBox
        class="hidden md:block flex-1 md:rounded-l-lg justify-center items-center"
        centered-content
      >
        <img
          src="login_art.jpg"
          alt="Login graphics"
          class="w-3/4 object-contain mx-auto"
        />
      </CardBox>
      <!--This is cardbox with form-->
      <CardBox
        class="flex flex-col flex-shrink flex-1 justify-center items-center space-y-4 md:rounded-r-lg"
        is-form
        centered-content
        @submit.prevent="onSubmit"
      >
        <img
          src="fipu_hr.png"
          alt="fipu logo"
          class="w-1/4 lg:w-1/5 2xl:1/6 object-contain mx-auto"
        />

        <h2
          class="text-2xl lg:text-3xl 2xl:text-4xl text-center text-fipu_gray font-bold xl:mb-1 mb-4 md:mb-0 2xl:mb-4"
        >
          Dobrodošli u <span class="text-fipu_blue">FIPU Praksa</span>
        </h2>
        <h2 class="md:text-sm lg:text-sm 2xl:text-base text-center 2xl:mb-4">
          Molimo prijavite se kako biste pregledali stanje vaše prakse ili
          prijavili zadatke. Ukoliko želite samo pregledati dostupne zadatke i
          poduzeća, molimo nastavite kao gost
          <a
            class="text-fipu_blue cursor-pointer"
            @click="router.push('/moja-praksa')"
            >ovdje</a
          >.
        </h2>

        <div class="w-full px-2 lg:px-12">
          <FormField label="E-mail">
            <FormControl
              v-model="loginForm.email"
              :icon="mdiAccount"
              name="email"
              autocomplete="username"
            />
          </FormField>

          <FormField label="Lozinka">
            <FormControl
              v-model="loginForm.password"
              :icon="mdiAsterisk"
              type="password"
              name="password"
              autocomplete="current-password"
            />
          </FormField>

          <div class="text-right">
            <a href="#" class="text-sm">Zaboravili ste lozinku?</a>
          </div>

          <FormCheckRadio
            v-model="loginForm.remember_me"
            name="remember"
            label="Zapamti me!"
            class="mb-1 2xl:mb-4"
            :input-value="true"
          />

          <BaseButtons class="space-y-2">
            <BaseButton
              type="submit"
              color="fipu_blue"
              label="Prijavi se"
              class="w-full"
            />
          </BaseButtons>
          <div
            class="my-2 2xl:my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300"
          >
            <p class="mx-4 mb-0 text-center dark:text-white">ili</p>
          </div>
          <BaseButtons class="space-y-2">
            <BaseButton
              color="fipu_blue"
              outline
              to="/register"
              label="Registriraj se"
              class="w-full"
            />
          </BaseButtons>

          <!-- Form Ends -->
          <NotificationBar
            ref="notificationBar"
            class="animate__animated animate__fadeInUp mt-2"
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
        </div>
      </CardBox>
    </div>
  </SectionSplitLogin>
</template>
