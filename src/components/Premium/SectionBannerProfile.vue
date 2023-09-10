<script setup>
import { mdiLaptop, mdiAccountMultiple } from "@mdi/js";
import BaseButton from "@/components/Base/BaseButton.vue";
import SectionBanner from "@/components/Section/SectionBanner.vue";
import { mainStore } from "@/main.js";
</script>

<template>
  <SectionBanner
    v-if="mainStore.userAdmin"
    class="bg-gradient-to-tr from-green-300 via-fipu_blue to-blue-500"
  >
    <h1 class="text-3xl text-white mb-6">Pogledajte aktivne prakse</h1>
    <div>
      <router-link to="/studenti">
        <BaseButton
          :icon="mdiAccountMultiple"
          label="Studenti"
          target="_blank"
          rounded-full
        />
      </router-link>
    </div>
  </SectionBanner>
  <SectionBanner
    v-else
    class="bg-gradient-to-tr from-green-300 via-fipu_blue to-blue-500"
  >
    <h1 class="text-3xl text-white mb-6">Provjerite stanje vaše prakse</h1>
    <div>
      <router-link to="/moja-praksa">
        <BaseButton
          :icon="mdiLaptop"
          label="Moja praksa"
          target="_blank"
          rounded-full
        />
      </router-link>
    </div>
  </SectionBanner>
</template>
