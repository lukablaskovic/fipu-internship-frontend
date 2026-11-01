<script setup>
import { FieldControl, FieldRoot, Primitive, injectFieldRootContext } from "reka-ui";
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import { RadioGroup } from "reka-ui/namespaced";
const fieldContext = injectFieldRootContext(null);
import { computed } from "vue";

const props = defineProps({
	disabled: Boolean,
	readonly: Boolean,
	required: Boolean,
	options: {
		type: Object,
		default: () => {},
	},
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		default: "checkbox",
		validator: (value) => ["checkbox", "radio", "switch"].includes(value),
	},
	componentClass: {
		type: String,
		default: null,
	},
	isColumn: Boolean,
	modelValue: {
		type: [Array, String, Number, Boolean],
		default: null,
	},
});

const groupDisabled = computed(() => props.disabled || props.readonly || fieldContext?.disabled.value);

const emit = defineEmits(["update:modelValue"]);

const computedValue = computed({
	get: () => props.modelValue,
	set: (value) => {
		emit("update:modelValue", value);
	},
});
</script>

<template>
	<component :is="fieldContext ? FieldControl : Primitive" as-child :model-value="fieldContext ? String(computedValue ?? '') : undefined">
		<component
			:is="type === 'radio' ? RadioGroup.Root : 'div'"
			v-bind="type !== 'radio' ? { role: 'group', tabindex: fieldContext ? -1 : undefined } : {}"
			:model-value="type === 'radio' ? computedValue : undefined"
			:name="name"
			:disabled="!!groupDisabled"
			:required="required"
			:orientation="isColumn ? 'vertical' : 'horizontal'"
			class="flex flex-wrap items-center"
			:class="{ 'flex-col': isColumn }"
			@update:model-value="computedValue = $event">
			<component :is="fieldContext && type !== 'radio' ? FieldRoot : Primitive" v-for="(value, key) in options" :key="key" as-child>
				<FormCheckRadio v-model="computedValue" :type="type" :disabled="!!groupDisabled" :readonly="readonly" :required="required" :name="name" :input-value="key" :label="value" :class="componentClass" class="mx-2 mb-3 mr-6 last:mr-0" />
			</component>
		</component>
	</component>
</template>
