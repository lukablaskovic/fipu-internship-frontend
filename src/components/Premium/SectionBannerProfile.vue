<script setup>
import SectionBanner from "@/components/Section/SectionBanner.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { mdiLaptop, mdiAccountMultiple } from "@mdi/js";
import { mainStore } from "@/main.js";
</script>

<template>
	<SectionBanner v-if="mainStore.userAdmin" class="bg-gradient-to-tr from-green-300 via-fipu_blue to-blue-500">
		<h1 class="mb-6 text-3xl text-white">Pogledajte aktivne procese</h1>
		<router-link to="/studenti">
			<BaseButton :icon="mdiAccountMultiple" label="Studenti" target="_blank" rounded-full />
		</router-link>
	</SectionBanner>
	<SectionBanner v-else class="bg-gradient-to-tr from-green-300 via-fipu_blue to-blue-500">
		<h1 class="mb-6 text-3xl text-white">Provjerite stanje vaše prakse</h1>
		<router-link to="/moja-praksa">
			<BaseButton :icon="mdiLaptop" label="Moja praksa" target="_blank" rounded-full />
		</router-link>
	</SectionBanner>
</template>
