<script setup>
import { containerMaxW } from "@/config.js";
</script>

<template>
	<section class="w-full bg-gray-100 p-6 dark:bg-slate-800" :class="containerMaxW">
		<slot />
	</section>
</template>
