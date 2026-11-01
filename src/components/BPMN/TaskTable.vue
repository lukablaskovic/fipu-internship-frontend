<template>
	<component :is="tableComponent" :preferences-id="variables.id_preferencije"></component>
</template>
<script setup>
import TableStudentPreferences from "@/components/Tables/TableStudentPreferences.vue";
import { computed } from "vue";
const props = defineProps({
	variables: { type: Object, default: () => ({}) },
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
