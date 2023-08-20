<script setup>
import { ref, computed } from "vue";
import draggable from "vuedraggable";
import {
  mdiClipboardCheckOutline,
  mdiClipboardTextOutline,
  mdiLaptop,
  mdiAlertCircle,
  mdiCheckCircle,
  mdiAlert,
  mdiClose,
} from "@mdi/js";

import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

import TableDostupniZadaci from "@/components/TableDostupniZadaci.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";

import router from "@/router";
import Utils from "@/utils.js";
import { useGuestStore } from "@/stores/guest_store.js";
import { useStudentStore } from "@/stores/student_store.js";
import { useMainStore } from "@/stores/main_store.js";

const Layout = computed(() => {
  if (userAuthenticated.value) {
    return LayoutAuthenticated;
  } else {
    return LayoutGuest;
  }
});

const guestStore = useGuestStore();
const studentStore = useStudentStore();
const mainStore = useMainStore();

const userAuthenticated = computed(() => mainStore.userAuthenticated);

const checkedAssignments = computed(() => guestStore.checkedAssignments);
const modalConfirmPreferences = ref(false);
let note = ref(null);
const enabled = ref(true);
const dragging = ref(false);

const registerAssignments = async () => {
  if (!userAuthenticated.value) {
    showNotificationBar("warning");
    return;
  } else {
    let result = await studentStore.registerAssignments(
      checkedAssignments.value,
      note.value
    );
    if (result && result.status_code == 200) {
      showNotificationBar("success");
    } else {
      showNotificationBar("error");
    }
    await Utils.wait(3);
    router.go();
  }
};
const notificationBar = ref({
  color: "success",
  icon: mdiCheckCircle,
});
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
      notificationStatus.value = "To je to!";
      notificationMessage.value = " Uspješno ste prijavili svoje preferencije.";
      break;
    case "warning":
      notificationBar.value.color = "warning";
      notificationBar.value.icon = mdiAlert;

      notificationStatus.value = "Upozorenje.";
      notificationMessage.value =
        "Morate biti prijavljeni da biste prijavili preferencije.";
      break;
    case "error":
      notificationBar.value.color = "danger";
      notificationBar.value.icon = mdiAlertCircle;
      notificationStatus.value = "Greška!";
      notificationMessage.value =
        "Preferencije nisu prijavljene. Molimo pokušajte ponovno ili kontaktirajte profesora.";
      break;
  }
  notificationBar.value.show();
}
</script>

<template>
  <component :is="Layout">
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiLaptop" title="Stručna praksa" main>
      </SectionTitleLineWithButton>
      <p><b>Akademska godina:</b> 2023/2024</p>
      <p><b>Voditelj:</b> doc. dr. sc. Nikola Tanković</p>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardTextOutline"
        main
        title="Dostupni zadaci za praksu"
      ></SectionTitleLineWithButton>
      <p>
        Pogledajte zanimljive slobodne zadatke te odaberite i rasporedite 3
        najdraža - (1. odabir | 2. odabir | 3. odabir).
      </p>
      <p>
        <b>Napomena:</b> Da biste prijavili preferencije, morate se prijaviti u
        aplikaciji.
      </p>
      <br />
      <CardBox has-table>
        <TableDostupniZadaci checkable />
      </CardBox>
      <hr />
      <br />
      <SectionTitleLineWithButton
        :icon="mdiClipboardCheckOutline"
        main
        title="Vaš odabir"
      ></SectionTitleLineWithButton>
      <div
        v-if="checkedAssignments.length"
        class="flex justify-center items-center"
      >
        <div class="flex flex-row text-center">
          <draggable
            :list="checkedAssignments"
            :disabled="!enabled"
            item-key="id"
            class="list-group flex flex-row space-x-4"
            ghost-class="ghost"
            @start="dragging = true"
            @end="dragging = false"
          >
            <template #item="{ element, index }">
              <div
                class="list-group-item flex-shrink-0 w-60 h-30 text-white bg-fipu_light_blue dark:bg-fipu_blue rounded-lg shadow-lg flex flex-col items-center justify-center text-lg p-4"
                :class="{ 'not-draggable': !enabled, 'cursor-move': enabled }"
              >
                <span class="mb-2 font-bold">{{ index + 1 }}. odabir</span>
                {{ element["ID Zadatka"] }}
              </div>
            </template>
          </draggable>
        </div>
      </div>
      <div v-else>Niste odabrali ni jedan zadatak.</div>
      <div v-if="checkedAssignments.length == 3">
        <FormField
          class="mt-6"
          label="Napomena (nije obavezno)"
          help="Maksimalno 255 znakova"
        >
          <FormControl
            v-model="note"
            type="textarea"
            placeholder="Slobodno dodaj napomenu za voditelja prakse."
          />
        </FormField>
        <BaseButtons class="space-y-2 mt-6 mb-16 justify-center items-center">
          <BaseButton
            type="submit"
            color="fipu_light_blue"
            label="Prijavi preferencije"
            @click="modalConfirmPreferences = true"
          />
        </BaseButtons>
      </div>
      <div>
        <NotificationBar
          ref="notificationBar"
          :color="notificationBar.color"
          :icon="notificationBar.icon"
          class="animate__animated animate__fadeInUp"
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
      <CardBoxModal
        v-model="modalConfirmPreferences"
        title="Molimo potvrdite vaš odabir"
        button-label="Potvrđujem"
        has-cancel
        @confirm="registerAssignments()"
      >
        <p>Provjerite još jednom odabrane zadatke i njihov redoslijed:</p>
        <br />
        <p
          v-for="(assignment, index) in checkedAssignments"
          :key="assignment['ID Zadatka']"
        >
          <b>Odabir {{ index + 1 }}: </b>{{ assignment["ID Zadatka"] }}
        </p>
        <br />
      </CardBoxModal>
    </SectionMain>
  </component>
</template>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
