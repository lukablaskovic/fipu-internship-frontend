<script setup>
import { mdiGithub } from "@mdi/js";
import BaseButton from "@/components/Base/BaseButton.vue";
import SectionBanner from "@/components/Section/SectionBanner.vue";
import { gradientBgBlue } from "@/colors";
</script>

<template>
	<SectionBanner :class="gradientBgBlue">
		<h1 class="text-3xl text-white mb-6">Like the project? Please star on <b>GitHub</b> ;-)</h1>
		<div>
			<BaseButton href="https://github.com/justboil/admin-one-vue-tailwind" :icon="mdiGithub" label="GitHub" target="_blank" rounded-full />
		</div>
	</SectionBanner>
</template>
