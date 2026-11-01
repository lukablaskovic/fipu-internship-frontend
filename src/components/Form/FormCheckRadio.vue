<script setup>
import { CheckboxRoot, SwitchRoot, RadioGroupItem } from "reka-ui";
import { computed } from "vue";

defineOptions({ inheritAttrs: false });
const props = defineProps({
	disabled: Boolean,
	readonly: Boolean,
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		default: "checkbox",
		validator: (value) => ["checkbox", "radio", "switch"].includes(value),
	},
	label: {
		type: String,
		default: null,
	},
	modelValue: {
		type: [Array, String, Number, Boolean],
		default: null,
	},
	inputValue: {
		type: [String, Number, Boolean],
		default: true,
	},
	required: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["update:modelValue"]);

const computedValue = computed({
	get: () => props.modelValue,
	set: (value) => {
		emit("update:modelValue", value);
	},
});

const checked = computed({
	get: () => (Array.isArray(props.modelValue) ? props.modelValue.includes(props.inputValue) : !!props.modelValue),
	set: (value) => {
		if (props.disabled || props.readonly) return;
		computedValue.value = Array.isArray(props.modelValue) ? (value ? [...new Set([...props.modelValue, props.inputValue])] : props.modelValue.filter((item) => item !== props.inputValue)) : value;
	},
});
</script>

<template>
	<label :class="[type, $attrs.class]" class="flex items-center">
		<RadioGroupItem v-if="type === 'radio'" v-bind="{ ...$attrs, class: undefined }" :value="inputValue" :disabled="disabled || readonly" :aria-label="label || name" class="check min-w-[20px]" />
		<component
			:is="type === 'switch' ? SwitchRoot : CheckboxRoot"
			v-else
			v-bind="{ ...$attrs, class: undefined }"
			v-model="checked"
			:name="name"
			:value="String(inputValue)"
			:required="required"
			:disabled="disabled || readonly"
			:aria-label="label || name"
			class="check min-w-[20px]" />
		<span class="break-words pl-2">{{ label }}</span>
	</label>
</template>
