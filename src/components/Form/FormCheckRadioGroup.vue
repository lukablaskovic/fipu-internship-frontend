<script setup>
import FormCheckRadio from "@/components/Form/FormCheckRadio.vue";
import { computed } from "vue";

const props = defineProps({
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
	<div class="m flex flex-wrap items-center" :class="{ 'flex-col': isColumn }">
		<FormCheckRadio v-for="(value, key) in options" :key="key" v-model="computedValue" :type="type" :name="name" :input-value="key" :label="value" :class="componentClass" class="mx-2 mb-3 mr-6 w-32 last:mr-0" />
	</div>
</template>
