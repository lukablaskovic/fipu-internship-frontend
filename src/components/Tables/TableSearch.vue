<script setup>
import { computed } from "vue";
import { mdiMagnify } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";

const props = defineProps({
	modelValue: { type: String, default: "" },
	label: { type: String, required: true },
	placeholder: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);
const search = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});
</script>

<template>
	<div class="relative">
		<BaseIcon :path="mdiMagnify" :size="20" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-slate-400" aria-hidden="true" />
		<input v-model="search" type="search" :aria-label="label" :placeholder="placeholder" class="table-filter-search w-full pl-10" />
	</div>
</template>
