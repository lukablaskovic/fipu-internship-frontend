<script setup>
import { FieldControl, FieldRoot, Primitive, injectFieldRootContext } from "reka-ui";
import { Checkbox, Switch, RadioGroup } from "reka-ui/namespaced";
import { computed, useId } from "vue";
const fieldContext = injectFieldRootContext(null);
const labelId = useId();

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
	<component :is="fieldContext ? Primitive : FieldRoot" as-child>
		<label :class="[type, $attrs.class]" class="flex items-center">
			<RadioGroup.Item v-if="type === 'radio'" v-bind="{ ...$attrs, class: undefined }" :value="inputValue" :disabled="disabled || readonly || fieldContext?.disabled.value" :aria-label="label || name" class="check min-w-[20px]" />
			<component :is="type === 'switch' ? FieldControl : Primitive" v-else as-child :model-value="type === 'switch' ? (checked ? 'true' : '') : undefined">
				<component
					:is="type === 'switch' ? Switch.Root : Checkbox.Root"
					v-bind="{ ...$attrs, class: undefined }"
					v-model="checked"
					:name="name"
					:value="String(inputValue)"
					:required="required"
					:disabled="disabled || readonly || fieldContext?.disabled.value"
					:aria-label="label || name"
					:aria-labelledby="label ? labelId : undefined"
					class="check min-w-[20px]" />
			</component>
			<span :id="labelId" class="break-words pl-2">{{ label }}</span>
		</label>
	</component>
</template>
