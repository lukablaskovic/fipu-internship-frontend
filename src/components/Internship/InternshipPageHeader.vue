<script setup>
import { mdiLaptop } from "@mdi/js";
import { appConfig } from "@/config";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
</script>

<template>
	<header>
		<SectionTitleLineWithButton :icon="mdiLaptop" title="Moja Praksa" main />
		<p><b>Akademska godina:</b> {{ appConfig.academicYear }}</p>
		<p><b>Voditelj:</b> {{ appConfig.voditelj_prakse }}</p>
	</header>
</template>
