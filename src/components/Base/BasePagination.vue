<script setup>
import { watchEffect } from "vue";
import { PaginationRoot, PaginationList, PaginationListItem, PaginationEllipsis, PaginationFirst, PaginationPrev, PaginationNext, PaginationLast } from "reka-ui";
import { mdiChevronDoubleLeft, mdiChevronLeft, mdiChevronRight, mdiChevronDoubleRight } from "@mdi/js";
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
	page: { type: Number, required: true },
	total: { type: Number, required: true },
	itemsPerPage: { type: Number, required: true },
});
const emit = defineEmits(["update:page"]);

watchEffect(() => {
	const page = Math.max(1, Math.min(props.page, Math.ceil(props.total / props.itemsPerPage)));
	if (page !== props.page) emit("update:page", page);
});
</script>

<template>
	<PaginationRoot :page="page" :total="total" :items-per-page="itemsPerPage" :sibling-count="1" :disabled="total === 0" show-edges aria-label="Navigacija po stranicama" @update:page="emit('update:page', $event)">
		<PaginationList v-slot="{ items }" class="pagination flex flex-wrap items-center justify-center gap-1">
			<PaginationFirst aria-label="Prva stranica"><BaseIcon :path="mdiChevronDoubleLeft" aria-hidden="true" /></PaginationFirst>
			<PaginationPrev aria-label="Prethodna stranica"><BaseIcon :path="mdiChevronLeft" aria-hidden="true" /></PaginationPrev>
			<template v-for="(item, index) in items" :key="index">
				<PaginationListItem v-if="item.type === 'page'" :value="item.value" :aria-label="`Stranica ${item.value}`">{{ item.value }}</PaginationListItem>
				<PaginationEllipsis v-else :index="index" class="px-1">&#8230;</PaginationEllipsis>
			</template>
			<PaginationNext aria-label="Sljedeća stranica"><BaseIcon :path="mdiChevronRight" aria-hidden="true" /></PaginationNext>
			<PaginationLast aria-label="Posljednja stranica"><BaseIcon :path="mdiChevronDoubleRight" aria-hidden="true" /></PaginationLast>
		</PaginationList>
	</PaginationRoot>
</template>

<style scoped>
.pagination :deep(button) {
	@apply inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded border border-gray-200 bg-white px-2 text-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fipu_blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800;
}
.pagination :deep(button[data-selected]) {
	@apply border-fipu_blue bg-fipu_blue text-white hover:bg-fipu_blue dark:border-fipu_blue dark:bg-fipu_blue dark:hover:bg-fipu_blue;
}
</style>
