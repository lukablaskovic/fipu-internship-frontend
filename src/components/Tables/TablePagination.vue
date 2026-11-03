<script setup>
import { mdiMenuDown } from "@mdi/js";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BasePagination from "@/components/Base/BasePagination.vue";
import ButtonMenu from "@/components/Base/ButtonMenu.vue";
import { tableButtonMenuOptions } from "@/composables/usePagination.js";

defineProps({
	page: { type: Number, required: true },
	perPage: { type: Number, required: true },
	total: { type: Number, required: true },
	showPerPage: { type: Boolean, default: true },
});
const emit = defineEmits(["update:page", "update:perPage"]);

function changePerPage(option) {
	emit("update:perPage", option.value);
	emit("update:page", 0);
}
</script>

<template>
	<div v-if="total > 0" class="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
		<BaseLevel>
			<div class="flex flex-wrap items-center justify-center gap-3">
				<ButtonMenu v-if="showPerPage" class="pagination-page-size" :options="tableButtonMenuOptions" :icon="mdiMenuDown" small left @update:model-value="changePerPage" />
				<BasePagination :page="page + 1" :total="total" :items-per-page="perPage" @update:page="emit('update:page', $event - 1)" />
			</div>
			<small><slot />Stranica {{ page + 1 }} od {{ Math.ceil(total / perPage) }}</small>
		</BaseLevel>
	</div>
</template>
