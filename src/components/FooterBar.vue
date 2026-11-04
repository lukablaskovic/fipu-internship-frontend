<script setup>
import BaseLevel from "@/components/Base/BaseLevel.vue";
import { appConfig, containerMaxW } from "@/config.js";
const year = new Date().getFullYear();
</script>

<template>
	<footer class="px-6 py-2" :class="containerMaxW">
		<BaseLevel>
			<div class="text-center md:text-left">
				<b>&copy;{{ year }} - <a href="https://fipu.unipu.hr/fipu" target="_blank">Sveučilište Jurja Dobrile u Puli - Fakultet informatike</a></b>
				<slot>
					<br />
					Made with <span style="color: #e25555">&#9829;</span> at <a :href="appConfig.fipulab_web" target="_blank" class="hover-underline-animation cursor-pointer text-fipu_text_blue hover:text-fipu_blue">FIPUlab</a>
				</slot>
			</div>
			<div class="flex items-center justify-center gap-4 md:justify-end md:py-2">
				<p>FIPU Praksa {{ appConfig.praksa_version }}</p>
				<img src="/FIPU_praksa_logo_transparent.svg" alt="" class="h-8 w-8 shrink-0" />
				<a href="https://fipu.unipu.hr/" target="_blank" class="shrink-0">
					<img src="/fipu_unipu.png" alt="Fakultet informatike u Puli - Sveučilište Jurja Dobrile u Puli" class="h-8 w-auto transition-opacity hover:opacity-80 dark:brightness-0 dark:invert" />
				</a>
			</div>
		</BaseLevel>
	</footer>
</template>
