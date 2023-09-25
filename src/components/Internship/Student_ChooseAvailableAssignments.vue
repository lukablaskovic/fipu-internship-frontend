<script setup>
import { ref, computed, watch, nextTick } from "vue";
import draggable from "vuedraggable";
import {
  mdiClipboardCheckOutline,
  mdiClipboardTextOutline,
  mdiLaptop,
  mdiAlertCircle,
  mdiCheckCircle,
  mdiAlert,
  mdiClose,
  mdiConsoleNetworkOutline,
} from "@mdi/js";

import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import CardBoxModal from "@/components/Cardbox/CardBoxModal.vue";

import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import BaseButtons from "@/components/Base/BaseButtons.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import TableAvailableAssignments from "@/components/Tables/TableAvailableAssignments.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";

import { router } from "@/router";
import Utils from "@/helpers/utils.js";
import { mainStore, guestStore, studentStore } from "@/main.js";

const Layout = computed(() => {
  if (mainStore.userAuthenticated) {
    return LayoutAuthenticated;
  } else {
    return LayoutGuest;
  }
});

let napomena = ref(null);

const checkedAssignments = computed(() => guestStore.checkedAssignments);
const modalConfirmPreferences = ref(false);
const enabled = ref(true);
const vueDraggableDragging = ref(false);

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
    case "danger":
      notificationBar.value.color = "danger";
      notificationBar.value.icon = mdiAlertCircle;
      notificationStatus.value = "Greška!";
      notificationMessage.value =
        "Preferencije nisu prijavljene. Molimo pokušajte ponovno ili kontaktirajte profesora.";
      break;
  }
  console.log("notificationBar", notificationBar.value);
  notificationBar.value.show();
}
const registerPreferences = async () => {
  if (!mainStore.userAuthenticated) {
    showNotificationBar("warning");
    return;
  } else {
    let result = await studentStore.registerPreferences(
      checkedAssignments.value,
      napomena.value
    );
    if (result && result.status == "OK") {
      showNotificationBar("success");
    } else {
      showNotificationBar("danger");
    }
    await Utils.wait(3);
    router.go();
  }
};

const vas_odabir = ref(null);
const scrollToSelection = () => {
  nextTick(() => {
    vas_odabir.value.$el.scrollIntoView({ behavior: "smooth" });
  });
};

let wiggleEnabled = ref(true);

const isFadedOut = ref(false);
function fadeOutAnimation() {
  isFadedOut.value = true;
  wiggleEnabled.value = false;
}
const isDraggableEnabled = computed(
  () => checkedAssignments.value.length === 3
);
</script>

<template>
  <component :is="Layout">
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiLaptop" title="Moja praksa" main>
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
        <b>Napomena:</b> Da biste prijavili preferencije, morate biti
        prijavljeni u aplikaciji!
      </p>
      <br />
      <CardBox has-table>
        <TableAvailableAssignments checkable />
      </CardBox>
      <hr />
      <br />
      <SectionTitleLineWithButton
        ref="vas_odabir"
        :icon="mdiClipboardCheckOutline"
        main
        title="Vaš odabir"
      ></SectionTitleLineWithButton>
      <p v-if="checkedAssignments.length === 3" class="mb-4">
        Zadatke možete rasporediti po vašim preferencijama.
      </p>
      <div
        v-if="checkedAssignments.length"
        class="flex justify-center items-center"
      >
        <div class="flex flex-row text-center">
          <draggable
            :list="checkedAssignments"
            :disabled="!isDraggableEnabled"
            item-key="id"
            class="list-group flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
            ghost-class="ghost"
            @start="fadeOutAnimation"
            @end="vueDraggableDragging = false"
          >
            <template #item="{ element, index }">
              <div
                class="drag-handle list-group-item flex-shrink-0 w-60 h-30 text-white bg-fipu_light_blue dark:bg-fipu_blue rounded-lg shadow-lg flex flex-col items-center justify-center text-lg p-4"
                :class="{
                  wiggle: wiggleEnabled && isDraggableEnabled,
                  'not-draggable': !enabled,
                  'cursor-move': enabled,
                }"
              >
                <span class="mb-2 font-bold">{{ index + 1 }}. odabir</span>
                {{ element["id_zadatak"] }}
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div v-else>Niste odabrali ni jedan zadatak.</div>
      <div v-if="checkedAssignments.length == 3">
        <div
          class="animation bg-center bg-no-repeat bg-[url('../../../swipe-vertical.png')] md:bg-[url('../../../swipe-horizontal.png')]"
          :class="{ 'fade-out': isFadedOut }"
          @click="fadeOutAnimation"
        ></div>

        <FormField
          class="lg:mt-4"
          label="Napomena (nije obavezno)"
          help="Maksimalno 255 znakova"
        >
          <FormControl
            v-model="napomena"
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
        @confirm="registerPreferences()"
      >
        <p>Provjerite još jednom odabrane zadatke i njihov redoslijed:</p>
        <br />
        <p
          v-for="(assignment, index) in checkedAssignments"
          :key="assignment['id_zadatak']"
        >
          <b>Odabir {{ index + 1 }}: </b>{{ assignment["id_zadatak"] }}
        </p>
        <br />
        <p><b>Napomena:</b> {{ napomena }}</p></CardBoxModal
      >
    </SectionMain>
  </component>
</template>
<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.drag-handle {
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}
.drag-handle:hover {
  transform: scale(1.03);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
@keyframes wiggle {
  0% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
  100% {
    transform: rotate(-2deg);
  }
}

@keyframes up-down {
  0% {
    top: -30px;
  }
  50% {
    top: 30px;
  }
  100% {
    top: -30px;
  }
}

.drag-handle.wiggle {
  animation: wiggle 0.5s ease-in-out infinite;
}

@keyframes left-right {
  0% {
    left: -30px;
  }
  50% {
    left: 30px;
  }
  100% {
    left: -30px;
  }
}

div.animation {
  position: relative;
  width: 115px;
  height: 143px;
  margin: auto;

  animation: up-down 1.8s ease-out infinite;

  @media (min-width: 768px) {
    animation: left-right 1.8s ease-out infinite;
  }
}

@keyframes fade-out-anim {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

div.animation.fade-out {
  animation: fade-out-anim 0.5s ease 1;
  opacity: 0;
}
</style>
