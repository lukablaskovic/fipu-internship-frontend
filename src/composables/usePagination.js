import { computed, ref, watch } from "vue";

export function usePagination(items, initialPerPage = 10) {
	const perPage = ref(initialPerPage);
	const currentPage = ref(0);
	const numPages = computed(() => Math.ceil(items.value.length / perPage.value));
	const currentPageHuman = computed(() => numPages.value ? currentPage.value + 1 : 0);
	const itemsPaginated = computed(() => items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1)));

	watch([numPages, currentPage], () => {
		currentPage.value = Math.max(0, Math.min(currentPage.value, numPages.value - 1));
	});

	function handlePerPageChange(option) {
		perPage.value = option.value;
		currentPage.value = 0;
	}

	return { perPage, currentPage, itemsPaginated, numPages, currentPageHuman, handlePerPageChange };
}
