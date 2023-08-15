<script setup>
import { computed, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { mdiCheckDecagram } from "@mdi/js";
import BaseLevel from "@/components/BaseLevel.vue";
import UserAvatarCurrentUser from "@/components/UserAvatarCurrentUser.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import PillTag from "@/components/PillTag.vue";

const userStore = useUserStore();

const userName = computed(() => userStore.currentUser.username);

const userSwitchVal = ref(false);
</script>

<template>
  <CardBox>
    <BaseLevel type="justify-around lg:justify-center">
      <UserAvatarCurrentUser class="lg:mx-12" />
      <div class="space-y-3 text-center md:text-left lg:mx-12">
        <div class="flex justify-center md:block">
          <FormCheckRadio
            v-model="userSwitchVal"
            name="notifications-switch"
            type="switch"
            label="Obavijesti"
            :input-value="true"
          />
        </div>
        <h1 class="text-2xl">
          Hej, <b>{{ userName }}</b
          >!
        </h1>
        <p>Zadnja prijava <b>12 mins ago</b> s IP adrese <b>127.0.0.1</b></p>
        <div class="flex justify-center md:block">
          <PillTag label="Admin" color="danger" :icon="mdiCheckDecagram" />
          <PillTag label="Verified" color="info" :icon="mdiCheckDecagram" />
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>
