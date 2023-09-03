<script setup>
import { mdiLaptop } from "@mdi/js";
import BaseButton from "@/components/Base/BaseButton.vue";
import SectionBanner from "@/components/Section/SectionBanner.vue";
</script>

<template>
  <SectionBanner
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
