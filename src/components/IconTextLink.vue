<template>
	<RouterLink :to="to" class="inline-flex items-center whitespace-normal text-fipu_blue hover:underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fipu_blue">
		<BaseIcon :path="icon" class="flex-none align-middle" :size="18" aria-hidden="true"></BaseIcon>
		{{ text }}
	</RouterLink>
</template>

<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { RouterLink } from "vue-router";

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
