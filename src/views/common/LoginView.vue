<script setup>
import { ref, computed, reactive } from "vue";

import {
  mdiAccount,
  mdiAsterisk,
  mdiAlertCircle,
  mdiCheckCircle,
  mdiAlert,
  mdiClose,
} from "@mdi/js";
import { useVuelidate } from "@vuelidate/core";
import { useRouter } from "vue-router";

import { required, email, minLength, helpers } from "@vuelidate/validators";

import SectionSplitLogin from "@/components/Section/SectionSplitLogin.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";

import Utils from "@/helpers/utils";
import { getFirstErrorForField, isUnipuEmail } from "@/helpers/validators";
import { mainStore } from "@/main";

//Public images
import loginArt from "/login_art.jpg";
import fipu_unipu from "/fipu_unipu.png";

const loginForm = reactive({
  email: "admin@fipu.hr",
  password: "123456",
  remember_me: false,
});

const rules = {
  email: {
    required: helpers.withMessage("Polje je obavezno", required),
    email: helpers.withMessage("Molimo unesite ispravnu e-mail adresu", email),
    isUnipuEmail: helpers.withMessage(
      "Molimo unesite vašu UNIPU e-mail adresu",
      isUnipuEmail
    ),
  },
  password: {
    required: helpers.withMessage("Polje je obavezno", required),
    minLength: helpers.withMessage(
      "Lozinka mora sadržavati minimalno 6 znakova",
      minLength(6)
    ),
  },
};
const v$ = useVuelidate(rules, loginForm);
const passShowHideClicked = ref(false);

const isLoading = ref(false);
async function onSubmit() {
  isLoading.value = true;
  v$.value.$touch();

  if (v$.value.$invalid) {
    isLoading.value = false;
    return;
  }

  let loginResult = await mainStore.login(loginForm);
  isLoading.value = false;

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

const transitioning = ref(false);
function onRegisterClick() {
  transitioning.value = true;
}

const router = useRouter();
function navigateToRegister() {
  router.push("/register");
}
</script>

<template>
  <SectionSplitLogin bg="blue" class="flex items-start min-h-screen">
    <Transition
      appear
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__slideOutRight fast-animation"
      @after-leave="navigateToRegister"
    >
      <div
        v-if="!transitioning"
        class="flex flex-col justify-center items-center overflow-hidden h-screen || md:py-16 md:px-4 || transition-all duration-300"
      >
        <div
          class="flex flex-col md:flex-row flex-shrink h-full || bg-white rounded-lg overflow-hidden || transition-all duration-300 px-0 lg:px-6 xl:px-16 2xl:pr-28 2xl:pl-20 || xl:gap-4 2xl:gap-8"
        >
          <CardBox
            class="hidden xl:block flex-1 bg-opacity-0 grow p-16 xl:px-0 xl:py-16 2xl:py-24 || transition-all duration-300"
            centered-content
          >
            <img :src="loginArt" alt="Login graphics" class="2xl:pr-8 w-full" />
          </CardBox>

          <CardBox
            class="flex flex-col flex-shrink flex-1 bg-opacity-0 p-8 sm:p-16 xl:pl-2 xl:px-0 xl:py-24 || transition-all duration-300"
            vertical-centered
            is-form
            @submit.prevent="onSubmit"
          >
            <a href="https://fipu.unipu.hr/" target="_blank">
              <img
                :src="fipu_unipu"
                alt="fipu logo"
                class="h-16 mb-6 object-contain"
              />
            </a>
            <h2
              class="text-2xl lg:text-3xl 2xl:text-4xl text-fipu_gray font-bold xl:mb-1 mb-2 md:mb-0 2xl:mb-4"
            >
              Dobrodošli u <span class="text-fipu_blue">FIPU Praksa</span>
            </h2>
            <h2
              class="md:text-sm lg:text-sm 2xl:text-base mb-2 2xl:mb-4 text-justify"
            >
              Molimo prijavite se kako biste pregledali stanje vaše prakse ili
              prijavili zadatke. Ukoliko želite samo pregledati dostupne zadatke
              i poduzeća, molimo nastavite kao gost
              <a
                class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue"
                @click="router.push('/moja-praksa')"
              >
                ovdje
              </a>
            </h2>

            <FormField label="E-mail">
              <FormControl
                v-model="loginForm.email"
                :icon="mdiAccount"
                name="email"
                autocomplete="email"
                :error="getFirstErrorForField('email')"
              >
              </FormControl>
            </FormField>

            <FormField label="Lozinka">
              <FormControl
                v-model="loginForm.password"
                :icon="mdiAsterisk"
                name="password"
                type="password"
                autocomplete="password"
                placeholder="Password"
                :error="getFirstErrorForField('password')"
                @right-icon-click="passShowHideClicked = true"
              >
              </FormControl>
            </FormField>

            <div class="text-right">
              <a
                href="#"
                class="text-sm text-fipu_gray hover:text-fipu_blue underline"
                >Zaboravili ste lozinku?</a
              >
            </div>
            <FormCheckRadio
              v-model="loginForm.remember_me"
              name="remember"
              label="Zapamti me!"
              class="mb-4 2xl:mb-4"
              :input-value="true"
            />

            <BaseButtons class="space-y-2">
              <BaseButton
                type="submit"
                color="fipu_blue"
                label="Prijavi se"
                :loading="isLoading"
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
                label="Registriraj se"
                class="w-full"
                @click.prevent="onRegisterClick"
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
          </CardBox>
        </div>
      </div>
    </Transition>
  </SectionSplitLogin>
</template>

<style scoped>
.fast-animation {
  animation-duration: 0.5s;
}
.hover-underline-animation:after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #9de0f7;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
.hover-underline-animation:hover:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}
</style>
