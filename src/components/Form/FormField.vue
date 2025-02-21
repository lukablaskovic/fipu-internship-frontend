<script setup>
import FormFieldHelp from "@/components/Premium/FormFieldHelp.vue";
import { controlTextColor } from "@/colorsPremium.js";
import { computed, useSlots } from "vue";

const props = defineProps({
	label: {
		type: String,
		default: null,
	},
	help: {
		type: String,
		default: null,
	},
	horizontal: Boolean,
	addons: Boolean,
	grouped: Boolean,
	multiline: Boolean,
	error: {
		type: [Boolean, String],
		default: null,
	},
	success: {
		type: [Boolean, String],
		default: null,
	},
});

const slots = useSlots();

const upperWrapperClass = computed(() => {
	const base = [props.multiline ? "-mb-3" : "mb-6"];

	if (props.horizontal) {
		base.push("lg:gap-6 lg:grid-cols-5");
	}

	return base;
});

const wrapperClass = computed(() => {
	const base = [];
	const slotsLength = slots.default().length;

	if (props.horizontal) {
		base.push("lg:col-span-4");

		if (!props.label) {
			base.push("lg:col-start-2");
		}
	}

	if (props.addons || props.grouped || props.multiline) {
		base.push("flex justify-start");
	} else {
		if (slotsLength > 1) {
			base.push("grid grid-cols-1 gap-3");
		}

		if (slotsLength === 2) {
			base.push("md:grid-cols-2");
		}

		if (slotsLength >= 3) {
			base.push("md:grid-cols-3");
		}
	}

	if (props.grouped) {
		base.push("space-x-3");
	}

	if (props.multiline) {
		base.push("flex-wrap");
	}

	return base;
});

const labelClass = computed(() => {
	const base = [];

	if (props.horizontal) {
		base.push("lg:mb-0");
	}

	const textColor = controlTextColor(props.error, props.success);

	if (textColor) {
		base.push(textColor);
	}

	return base;
});

const formattedLabel = computed(() => {
	if (!props.label) return "";
	// Replace * with a red-colored span
	return props.label.replace(/\*/g, '<span class="text-red-500">*</span>');
});
</script>

<template>
	<div class="grid grid-cols-1 last:mb-0" :class="upperWrapperClass">
		<label v-if="label" class="mb-2 block font-bold" :class="labelClass" v-html="formattedLabel"></label>
		<div :class="wrapperClass">
			<slot />
		</div>
		<FormFieldHelp class="mt-1" :class="{ 'lg:col-span-4 lg:col-start-2 lg:-mt-5': horizontal }" :help="help" :error="error" :success="success" />
	</div>
</template>
