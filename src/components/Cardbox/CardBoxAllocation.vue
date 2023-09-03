<template>
  <div class="relative block overflow-hidden rounded-lg py-4">
    <span
      class="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-fipu_blue to-blue-500"
    ></span>

    <div class="sm:flex sm:justify-between sm:gap-4">
      <div>
        <h1 class="text-lg font-bold sm:text-2xl">
          {{ props.data.id_zadatak }}
        </h1>
        <h3 class="text-lg font-bold sm:text-xl">
          {{ truncatedDescription }}
        </h3>

        <p class="mt-1 text-xs font-medium text-gray-600">
          {{ props.data["Poslodavac"][0]["value"] }}:
          {{ props.data.poslodavac_email }}
        </p>
      </div>

      <div class="hidden sm:block sm:shrink-0">
        <img
          alt="logo"
          :src="companyLogo"
          class="h-24 w-24 object-cover shadow-sm rounded-full block max-w-full bg-gray-100 dark:bg-slate-800"
        />
      </div>
    </div>

    <div>
      <p class="max-w-[40ch] text-sm text-gray-500">
        {{ props.data.opis_zadatka }}
      </p>
    </div>

    <div class="mt-4">
      <p class="max-w-[40ch] text-sm text-gray-500">
        <b>Potrebno imati:</b> {{ props.data.potrebno_imati }}
      </p>
      <p class="max-w-[40ch] text-sm text-gray-500">
        <b>Preferencije za studenta:</b>
        {{ props.data.preferencije_za_studenta }}
      </p>
      <p class="max-w-[40ch] text-sm text-gray-500">
        <b>Napomena:</b>
        {{ props.data.napomena }}
      </p>
    </div>

    <dl class="mt-6 flex gap-4 sm:gap-6">
      <div class="flex flex-col-reverse">
        <dt class="text-sm font-medium text-gray-600 dark:text-gray-200">
          Okviran početak
        </dt>
        <dd class="text-xs text-gray-500 dark:text-gray-100">
          {{ props.data.zeljeno_okvirno_vrijeme_pocetka }}
        </dd>
      </div>

      <div class="flex flex-col-reverse">
        <dt class="text-sm font-medium text-gray-600 dark:text-gray-200">
          Lokacija
        </dt>
        <dd class="text-xs text-gray-500 dark:text-gray-100">
          {{ props.data.lokacija }}
        </dd>
      </div>

      <div class="flex flex-col-reverse">
        <dt class="text-sm font-medium text-gray-600 dark:text-gray-200">
          Trajanje
        </dt>
        <dd class="text-xs text-gray-500 dark:text-gray-100">
          {{ props.data.trajanje_sati }} sati
        </dd>
      </div>

      <div v-if="props.data.selekcija === true" class="flex flex-col-reverse">
        <dt class="text-sm font-medium text-gray-600 dark:text-gray-200">
          Selekcija
        </dt>
        <dd class="text-xs text-gray-500 dark:text-gray-100">
          {{ props.data.proces_selekcije }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup>
import { mainStore } from "@/main";
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
let companyLogo = ref("");

const truncatedDescription = computed(() => {
  if (props.data.opis_zadatka.length > 50) {
    return props.data.opis_zadatka.substring(0, 50) + "...";
  }
  return props.data.opis_zadatka;
});

onMounted(async () => {
  let result = await mainStore.fetchCompanies(
    props.data["Poslodavac"][0]["value"]
  );
  companyLogo.value = result.data.results[0].logo[0].url;
});
</script>
<style></style>
