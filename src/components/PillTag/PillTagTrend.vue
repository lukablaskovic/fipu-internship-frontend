<script setup>
import { computed } from "vue";
import { mdiFilter } from "@mdi/js";
import PillTag from "@/components/PillTag/PillTag.vue";

const props = defineProps({
	trend: {
		type: String,
		required: true,
	},
	trendType: {
		type: String,
		default: null,
	},
	small: Boolean,
});

const trendStyle = computed(() => {
	if (props.trendType === "filter") {
		return {
			icon: mdiFilter,
			style: "fipu_blue",
		};
	}

	return {
		style: "info",
	};
});
</script>

<template>
	<PillTag :label="trend" :color="trendStyle.style" :icon="trendStyle.icon" :small="false" />
</template>
