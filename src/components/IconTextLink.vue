<template>
	<span class="inline-flex cursor-pointer items-center whitespace-normal text-fipu_blue" @click="router.push(to)">
		<BaseIcon :path="icon" class="flex-none align-middle" :size="18"></BaseIcon>
		{{ text }}
	</span>
</template>

<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { router } from "@/router";
import { defineProps } from "vue";

defineProps({
	icon: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	to: {
		type: String,
		required: true,
	},
});
</script>
