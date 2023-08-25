<script setup>
import { containerMaxW } from "@/config.js";
import BaseLevel from "@/components/Base/BaseLevel.vue";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="py-2 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <b
          >&copy;{{ year }},
          <a href="https://fipu.unipu.hr/fipu" target="_blank"
            >Fakultet informatike u Puli</a
          ></b
        >
        <slot />
      </div>
      <div class="md:py-2">
        <p>FiPU Praksa v1.0</p>
      </div>
    </BaseLevel>
  </footer>
</template>
