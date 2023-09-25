<script setup>
import { ref, reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  sameAs,
  helpers,
  numeric,
} from "@vuelidate/validators";
import { useRouter } from "vue-router";
import {
  croatianAlpha,
  getFirstErrorForField,
  isUnipuEmail,
  exactLength,
  containsAlpha,
  containsNumeric,
} from "@/helpers/validators";

import {
  mdiAccount,
  mdiAsterisk,
  mdiCheckCircle,
  mdiAlert,
  mdiAlertCircle,
} from "@mdi/js";

import SectionSplitRegister from "@/components/Section/SectionSplitRegister.vue";

import CardBox from "@/components/Cardbox/CardBox.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import { StudentMappings } from "@/helpers/maps";
import { guestStore } from "@/main";

import Utils from "@/helpers/utils";
const router = useRouter();

const transitioning = ref(false);

let data_confirmed = ref(false);

const registerForm = reactive({
  ime: "Luka",
  prezime: "Blašković",
  email: "lblaskovi@unipu.hr",
  JMBAG: "0303088177",
  godina_studija: StudentMappings.GodinaStudijaMappings[1],
  password: "",
  passwordConfirm: "",
});
const password = computed(() => registerForm.password);

const rules = {
  ime: {
    required: helpers.withMessage("Polje je obavezno", required),
    croatianAlpha: helpers.withMessage(
      "Polje smije sadržavati samo slova",
      croatianAlpha
    ),
  },
  prezime: {
    required: helpers.withMessage("Polje je obavezno", required),
    croatianAlpha: helpers.withMessage(
      "Polje smije sadržavati samo slova",
      croatianAlpha
    ),
  },
  JMBAG: {
    required: helpers.withMessage("Polje je obavezno", required),
    numeric: helpers.withMessage(
      "Polje smije sadržavati samo brojeve",
      numeric
    ),
    exactLength: helpers.withMessage(
      "JMBAG mora sadržavati točno 10 znamenki",
      exactLength(10)
    ),
  },
  godina_studija: {
    required: helpers.withMessage("Polje je obavezno", required),
  },
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

    containsAlpha: helpers.withMessage(
      "Lozinka mora sadržavati barem jedno slovo",
      containsAlpha
    ),
    containsNumeric: helpers.withMessage(
      "Lozinka mora sadržavati barem jedan broj",
      containsNumeric
    ),
  },

  passwordConfirm: {
    required: helpers.withMessage("Polje je obavezno", required),
    sameAs: helpers.withMessage("Lozinke se ne podudaraju", sameAs(password)),
  },
};

const v$ = useVuelidate(rules, registerForm);

async function onSubmit() {
  console.log("Submitting form...");

  v$.value.$touch();
  if (v$.value.$invalid) return;

  let postData = {
    ...registerForm,
    godina_studija: registerForm.godina_studija.dbLabel,
  };
  delete postData.passwordConfirm;

  let registrationResult = await guestStore.registerStudent(postData);
  if (
    registrationResult.response &&
    registrationResult.response.status === 400
  ) {
    showNotificationBar("warning");
  } else if (
    registrationResult.response &&
    registrationResult.response.status === 500
  ) {
    showNotificationBar("danger");
  } else {
    let instanceCreationResult = await guestStore.createInternshipInstance();
    if (instanceCreationResult.status !== 500) {
      await guestStore.update_process_instance(
        registrationResult.data.id,
        instanceCreationResult.id
      );
      showNotificationBar("success");
      await Utils.wait(2);
      router.push("/login");
    } else {
      //Bpmn engine je pao
      //Treba izbrisati podatek o studentu ako se ovo dogodi, ili bolje provjeriti postoje li vec i samo dodati instancu
      showNotificationBar("danger");
      return;
    }
  }
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
      notificationMessage.value = " Uspješna registracija!";
      break;
    case "warning":
      notificationBar.value.color = "warning";
      notificationBar.value.icon = mdiAlert;
      notificationStatus.value = "Upozorenje.";
      notificationMessage.value = " Račun s ovim podacima već postoji.";
      break;
    case "danger":
      notificationBar.value.color = "danger";
      notificationBar.value.icon = mdiAlertCircle;
      notificationStatus.value = "Greška!";
      notificationMessage.value =
        "Sustav ne radi. Nije do vas, molimo pokušajte opet ili kontaktirajte profesora.";
      break;
  }
  notificationBar.value.show();
}

function onPrijavaClick() {
  transitioning.value = true;
}
function navigateToLogin() {
  router.push("/login");
}
</script>

<template>
  <SectionSplitRegister bg="blue">
    <Transition
      appear
      enter-active-class="animate__animated animate__slideInLeft fast-animation"
      leave-active-class="animate__animated animate__slideOutLeft fast-animation"
      @after-leave="navigateToLogin"
    >
      <div
        v-if="!transitioning"
        class="flex flex-col flex-shrink md:flex-row overflow-hidden md:rounded-lg md:p-4 2xl:p-16 md:h-screen lg:px-12"
      >
        <!--This is graphics image cardbox-->
        <CardBox
          class="hidden md:block flex-1 md:rounded-l-lg justify-center items-center"
          centered-content
        >
          <img
            src="register_art.jpg"
            alt="Register graphics"
            class="w-3/4 object-contain mx-auto"
          />
        </CardBox>
        <!--This is cardbox with register form-->

        <CardBox
          class="flex flex-col flex-shrink flex-1 space-y-4 lg:pr-32 md:rounded-r-lg"
          is-form
          vertical-centered
          @submit.prevent="onSubmit"
        >
          <div>
            <a href="https://fipu.unipu.hr/" target="_blank">
              <img
                src="fipu_unipu.png"
                alt="fipu logo"
                class="lg:w-1/2 2xl:1/6 mb-6 object-contain"
              />
            </a>
          </div>

          <h2
            class="text-2xl lg:text-3xl 2xl:text-4xl text-fipu_gray font-bold xl:mb-1 mb-2 md:mb-0 2xl:mb-4"
          >
            Molimo unesite vaše podatke
          </h2>
          <h2 class="mb-4 text-fipu_gray">
            Već imate račun ili želite samo pregledati zadatke? Povratak na
            prijavu
            <a
              class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue"
              @click.prevent="onPrijavaClick()"
              >ovdje</a
            >.
          </h2>

          <div class="w-full lg:flex lg:flex-wrap lg:items-stretch">
            <!-- Column 1 -->
            <div
              class="lg:w-1/2 md:pr-4 lg:flex lg:flex-col lg:justify-between"
            >
              <div>
                <FormField label="Ime">
                  <FormControl
                    v-model="registerForm.ime"
                    :icon="mdiAccount"
                    :error="getFirstErrorForField('ime')"
                    name="ime"
                    autocomplete="ime"
                  />
                </FormField>

                <FormField label="Prezime">
                  <FormControl
                    v-model="registerForm.prezime"
                    :icon="mdiAccount"
                    :error="getFirstErrorForField('prezime')"
                    name="prezime"
                    autocomplete="prezime"
                  />
                </FormField>

                <FormField label="JMBAG">
                  <FormControl
                    v-model="registerForm.JMBAG"
                    :icon="mdiAccount"
                    :error="getFirstErrorForField('JMBAG')"
                    name="JMBAG"
                    autocomplete="JMBAG"
                  />
                </FormField>

                <FormField label="UNIPU E-mail">
                  <FormControl
                    v-model="registerForm.email"
                    :icon="mdiAccount"
                    :error="getFirstErrorForField('email')"
                    name="email"
                    autocomplete="username"
                  />
                </FormField>
              </div>
            </div>

            <!-- Column 2 -->
            <div
              class="lg:w-1/2 mt-2 md:mt-0 lg:flex lg:flex-col lg:justify-between"
            >
              <div>
                <FormField label="Godina studija">
                  <FormControl
                    v-model="registerForm.godina_studija"
                    :error="getFirstErrorForField('godina_studija')"
                    :options="StudentMappings.GodinaStudijaMappings"
                  />
                </FormField>

                <FormField label="Lozinka">
                  <FormControl
                    v-model="registerForm.password"
                    :icon="mdiAsterisk"
                    :error="getFirstErrorForField('password')"
                    type="password"
                    name="password"
                    autocomplete="current-password"
                  />
                </FormField>

                <FormField label="Potvrda lozinke">
                  <FormControl
                    v-model="registerForm.passwordConfirm"
                    :icon="mdiAsterisk"
                    :error="getFirstErrorForField('passwordConfirm')"
                    type="password"
                    name="passwordConfirm"
                  />
                </FormField>

                <FormCheckRadio
                  v-model="data_confirmed"
                  name="data_confirmed"
                  type="checkbox"
                  label="Potvrđujem ispravnost podataka."
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
          <NotificationBar
            ref="notificationBar"
            class="animate__animated animate__fadeInUp mt-4 w-full"
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
          <!-- Form Ends -->
        </CardBox>
      </div>
    </Transition>
  </SectionSplitRegister>
</template>

<style>
.fast-animation {
  animation-duration: 0.4s;
}
.hover-underline-animation {
  position: relative;
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
