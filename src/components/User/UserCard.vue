<script setup>
import { computed, ref } from "vue";
import { mainStore } from "@/main.js";
import { mdiCheckDecagram, mdiSchool, mdiShieldAccount } from "@mdi/js";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import UserAvatarCurrentUser from "@/components/User/UserAvatarCurrentUser.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import PillTag from "@/components/PillTag/PillTag.vue";

import moment from "@/moment-setup";

const accountType = computed(() => mainStore.currentUser.type);
const loggeddTimeAgo = computed(() =>
  moment(mainStore.currentUser.loggedAt).fromNow()
);
const username = computed(() => mainStore.currentUser.username);
const name = computed(() => mainStore.currentUser.name);

const userSwitchVal = ref(false);
</script>

<template>
  <CardBox>
    <BaseLevel type="justify-around lg:justify-center">
      <UserAvatarCurrentUser class="lg:mx-12 h-64 w-64" />
      <div class="space-y-3 text-center md:text-left lg:mx-12">
        <div class="flex justify-center md:block">
          <FormCheckRadio
            v-model="userSwitchVal"
            name="notifications-switch"
            type="switch"
            label="Slack obavijesti"
            :input-value="true"
          />
        </div>
        <h1 class="text-2xl">
          Hej, <b>{{ username || name }}</b
          >!
        </h1>
        <p>
          Zadnja prijava <b>{{ loggeddTimeAgo }}</b> s IP adrese
          <b>127.0.0.1</b>
        </p>
        <div class="flex justify-center md:block">
          <PillTag
            v-if="accountType == 'admin'"
            label="Admin"
            color="danger"
            :icon="mdiShieldAccount"
          />
          <PillTag
            v-if="accountType == 'student'"
            label="Student"
            color="success"
            :icon="mdiSchool"
          />
          <PillTag label="Verified" color="info" :icon="mdiCheckDecagram" />
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>
