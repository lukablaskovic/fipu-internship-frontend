<script setup>
import BaseButton from "../../components/Base/BaseButton.vue";
import { router } from "@/router";
</script>

<template>
	<section class="bg-white dark:bg-gray-900">
		<div class="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
			<div class="mx-auto max-w-screen-sm text-center">
				<h1 class="dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight text-fipu_blue lg:text-9xl">404</h1>
				<p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">Stranica ne postoji.</p>
				<p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Stranica koju ste zatražili ne postoji, vjerojatno je greška u URL-u!</p>
				<BaseButton label="Vrati me na početnu" color="fipu_blue" outline @click="router.push('/')" />
			</div>
		</div>
	</section>
</template>
