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
				<b>&copy;{{ year }}, <a href="https://fipu.unipu.hr/fipu" target="_blank">Fakultet informatike u Puli</a></b>
				<slot />
			</div>
			<div class="md:py-2">
				<p>FIPU Praksa {{ mainstore.praksa_version }}</p>
			</div>
		</BaseLevel>
	</footer>
</template>
