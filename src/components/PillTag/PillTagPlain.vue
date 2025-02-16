<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";

defineProps({
	label: {
		type: String,
		required: true,
	},
	icon: {
		type: String,
		default: null,
	},
	small: Boolean,
});
</script>

<template>
	<div class="inline-flex items-center capitalize hover:bg-opacity-80" :class="[small ? 'hover:bg text-xs' : 'px-3 py-0.5 text-sm sm:px-3']">
		<BaseIcon v-if="icon" :path="icon" h="h-4" w="w-4" :class="small ? 'mr-1' : 'mr-2'" :size="small ? 14 : null" />
		<span class="max-w-[150px] truncate whitespace-nowrap text-center drop-shadow">
			<abbr class="no-underline" :title="label">{{ label }}</abbr>
		</span>
	</div>
</template>
