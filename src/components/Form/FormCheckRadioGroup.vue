<script setup>
import { inject } from "vue";
const fieldLabelId = inject("formFieldLabelId", undefined);
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import { RadioGroup } from "reka-ui/namespaced";
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

const emit = defineEmits(["update:modelValue"]);

const computedValue = computed({
	get: () => props.modelValue,
	set: (value) => {
		emit("update:modelValue", value);
	},
});
</script>

<template>
	<component
		:is="type === 'radio' ? RadioGroup.Root : 'div'"
		:aria-labelledby="fieldLabelId"
		:model-value="type === 'radio' ? computedValue : undefined"
		:name="name"
		:disabled="disabled || readonly"
		:required="required"
		:orientation="isColumn ? 'vertical' : 'horizontal'"
		class="flex flex-wrap items-center"
		:class="{ 'flex-col': isColumn }"
		@update:model-value="computedValue = $event">
		<FormCheckRadio
			v-for="(value, key) in options"
			:key="key"
			v-model="computedValue"
			:type="type"
			:disabled="disabled"
			:readonly="readonly"
			:required="required"
			:name="name"
			:input-value="key"
			:label="value"
			:class="componentClass"
			class="mx-2 mb-3 mr-6 last:mr-0" />
	</component>
</template>
