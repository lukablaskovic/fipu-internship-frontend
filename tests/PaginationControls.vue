<script setup>
import { computed, ref } from "vue";
import ButtonMenu from "../src/components/Premium/ButtonMenu.vue";
import { tableButtonMenuOptions } from "../src/tableButtonMenuOptions.js";
import { mdiMenuDown } from "@mdi/js";
import BasePagination from "../src/components/Base/BasePagination.vue";
import { usePagination } from "../src/composables/usePagination.js";
import "../src/css/main.css";
const total = ref(95);
const items = computed(() => Array.from({ length: total.value }, (_, i) => i + 1));
const { currentPage, perPage, itemsPaginated: rows, numPages, currentPageHuman, handlePerPageChange } = usePagination(items);
const showPagination = ref(true);
</script>
<template>
	<main class="p-3">
		<ButtonMenu class="pagination-page-size" :options="tableButtonMenuOptions" :icon="mdiMenuDown" small left @update:model-value="handlePerPageChange" />
		<BasePagination v-if="showPagination && total" :page="currentPage + 1" :total="total" :items-per-page="perPage" @update:page="currentPage = $event - 1" />
		<output data-testid="rows">{{ rows.join(',') }}</output>
		<output data-testid="page">{{ currentPageHuman }} / {{ numPages }}</output>
		<button @click="total = 12">Filter</button>
		<button @click="total = 0">Empty</button>
		<button @click="total = 95">Restore</button>
		<button @click="showPagination = false">Hide pagination</button>
		<button @click="handlePerPageChange({ value: 5 })">Page size</button>
		<button @click="currentPage = 4">Highlight row 41</button>
	</main>
</template>
