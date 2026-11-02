<script setup>
import { FieldDescription, FieldError, injectFieldRootContext } from "reka-ui";
import { controlTextColor } from "@/colors.js";
import { computed } from "vue";

const fieldContext = injectFieldRootContext(null);

const props = defineProps({
	help: {
		type: String,
		default: null,
	},
	error: {
		type: [Boolean, String],
		default: null,
	},
	success: {
		type: [Boolean, String],
		default: null,
	},
});

const computedHelp = computed(() => (props.error && typeof props.error === "string" ? props.error : props.help));

const textColor = computed(() => {
	const color = controlTextColor(props.error, props.success);

	return color ?? "text-gray-500 dark:text-gray-400";
});
</script>

<template>
	<component :is="fieldContext ? (error ? FieldError : FieldDescription) : 'div'" v-if="computedHelp" :role="error ? 'alert' : undefined" :match="fieldContext && error ? true : undefined" class="text-xs" :class="[textColor]">
		{{ computedHelp }}
	</component>
</template>
