<script setup>
import BaseLevel from "@/components/Base/BaseLevel.vue";
import { containerMaxW } from "@/config.js";
import { mainStore } from "@/main.js";
import { ref } from "vue";
const year = new Date().getFullYear();

const mainstore = ref(mainStore);
</script>

<template>
	<footer class="px-6 py-2" :class="containerMaxW">
		<BaseLevel>
			<div class="text-center md:text-left">
				<b>&copy;{{ year }} - <a href="https://fipu.unipu.hr/fipu" target="_blank">Sveučilište Jurja Dobrile u Puli - Fakultet informatike</a></b>
				<slot />
			</div>
			<div class="flex items-center justify-center md:justify-end md:py-2">
				<p class="mr-4">FIPU Praksa {{ mainstore.praksa_version }}</p>
				<a href="https://fipu.unipu.hr/" target="_blank" class="flex-shrink-0">
					<img src="/fipu_unipu.png" alt="Fakultet informatike u Puli - Sveučilište Jurja Dobrile u Puli" class="h-8 w-auto transition-opacity hover:opacity-80" />
				</a>
			</div>
		</BaseLevel>
	</footer>
</template>
