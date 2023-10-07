<template>
	<component :is="tableComponent"></component>
</template>
<script setup>
import TableStudentPreferences from "@/components/Tables/TableStudentPreferences.vue";
import { computed } from "vue";
const props = defineProps({
	data: {
		type: String,
		required: true,
	},
});

const tableComponent = computed(() => {
	if (props.data == "userPreferences") {
		return TableStudentPreferences;
	}
	return TableStudentPreferences;
});
</script>
