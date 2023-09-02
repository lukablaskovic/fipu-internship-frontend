<script setup>
import { ref, reactive, computed } from "vue";

import { useRouter } from "vue-router";
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

let data_confirmed = ref(false);

const form = reactive({
  ime: "Luka",
  prezime: "Blašković",
  email: "lblaskovi@unipu.hr",
  JMBAG: "0303088177",
  godina_studija: StudentMappings.GodinaStudijaMappings[1],
  password: "123456",
});

let passwordConfirm = "";

async function onSubmit() {
  let postData = {
    ...form,
    godina_studija: form.godina_studija.dbLabel,
  };

  let registrationResult = await guestStore.registerStudent(postData);
  console.log(registrationResult);
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
    console.log(instanceCreationResult);
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
</script>

<template>
  <SectionSplitRegister bg="blue">
    <div
      class="flex flex-col flex-shrink md:flex-row overflow-hidden md:rounded-lg md:p-4 2xl:p-16 md:h-screen 2xl:px-12"
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
        class="flex flex-col flex-shrink flex-1 justify-center items-center space-y-4 md:rounded-r-lg"
        is-form
        centered-content
        @submit.prevent="onSubmit"
      >
        <div>
          <img
            src="fipu_hr.png"
            alt=""
            class="w-1/4 lg:w-1/5 2xl:1/6 object-contain mx-auto"
          />
        </div>
        <h2
          class="text-2xl lg:text-3xl 2xl:text-4xl text-center text-fipu_gray font-bold xl:mb-1 md:mb-0 2xl:mb-4"
        >
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

        <div class="w-full 2xl:px-4 lg:flex lg:flex-wrap lg:items-stretch">
          <!-- Column 1 -->
          <div class="lg:w-1/2 md:px-4 lg:flex lg:flex-col lg:justify-between">
            <div>
              <FormField label="Ime">
                <FormControl
                  v-model="form.ime"
                  :icon="mdiAccount"
                  name="ime"
                  autocomplete="ime"
                />
              </FormField>

              <FormField label="Prezime">
                <FormControl
                  v-model="form.prezime"
                  :icon="mdiAccount"
                  name="prezime"
                  autocomplete="prezime"
                />
              </FormField>

              <FormField label="JMBAG">
                <FormControl
                  v-model="form.JMBAG"
                  :icon="mdiAccount"
                  name="JMBAG"
                  autocomplete="JMBAG"
                />
              </FormField>

              <FormField label="UNIPU E-mail">
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
          <div
            class="lg:w-1/2 mt-2 md:mt-0 lg:flex lg:flex-col lg:justify-between"
          >
            <div>
              <FormField label="Godina studija">
                <FormControl
                  v-model="form.godina_studija"
                  :options="StudentMappings.GodinaStudijaMappings"
                />
              </FormField>

              <FormField label="Lozinka">
                <FormControl
                  v-model="form.password"
                  :icon="mdiAsterisk"
                  type="password"
                  name="password"
                  autocomplete="current-password"
                />
              </FormField>

              <FormField label="Potvrda lozinke">
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
  </SectionSplitRegister>
</template>
