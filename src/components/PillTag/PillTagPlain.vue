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
	<div class="inline-flex items-center capitalize hover:bg-opacity-80" :class="[small ? 'text-xs hover:bg' : 'text-sm  py-0.5 px-3 sm:px-3']">
		<BaseIcon v-if="icon" :path="icon" h="h-4" w="w-4" :class="small ? 'mr-1' : 'mr-2'" :size="small ? 14 : null" />
		<span class="drop-shadow truncate whitespace-nowrap text-center max-w-[128px]">
			<abbr class="no-underline" :title="label">{{ label }}</abbr>
		</span>
	</div>
</template>
