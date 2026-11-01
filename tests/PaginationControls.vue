<script setup>
import { computed, ref } from "vue";
import BasePagination from "../src/components/Base/BasePagination.vue";
import "../src/css/main.css";
const currentPage = ref(0);
const total = ref(95);
const perPage = ref(10);
const rows = computed(() => Array.from({ length: total.value }, (_, i) => i + 1).slice(currentPage.value * perPage.value, (currentPage.value + 1) * perPage.value));
</script>
<template>
	<main class="p-3">
		<BasePagination :page="currentPage + 1" :total="total" :items-per-page="perPage" @update:page="currentPage = $event - 1" />
		<output data-testid="rows">{{ rows.join(',') }}</output>
		<button @click="total = 12">Filter</button>
		<button @click="total = 0">Empty</button>
		<button @click="perPage = 5; currentPage = 0">Page size</button>
		<button @click="currentPage = 4">Highlight row 41</button>
	</main>
</template>
