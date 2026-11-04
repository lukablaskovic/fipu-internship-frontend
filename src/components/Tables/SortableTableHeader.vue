<script setup>
import { mdiSort, mdiSortAscending, mdiSortDescending } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";

defineProps({
	label: { type: String, required: true },
	active: Boolean,
	direction: { type: String, default: "asc" },
});
const emit = defineEmits(["sort"]);
</script>

<template>
	<th scope="col" :aria-sort="active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'">
		<button type="button" class="flex items-center gap-2 rounded-sm text-left hover:text-fipu_blue focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-fipu_blue" @click="emit('sort')">
			{{ label }}
			<BaseIcon :path="!active ? mdiSort : direction === 'asc' ? mdiSortAscending : mdiSortDescending" w="w-4" h="h-4" :size="16" aria-hidden="true" />
		</button>
	</th>
</template>
