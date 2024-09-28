<script setup>
import { ref, watch } from "vue";

const props = defineProps({
	value: Boolean,
	readonly: Boolean,
	type: {
		type: String,
		default: "td",
	},
	disabled: Boolean,
});

const emit = defineEmits(["checked", "update:value"]);

// Use the prop value if it's provided, otherwise, use the internal checked state
const checked = ref(props.value !== undefined ? props.value : false);

// Watch for internal checked state changes
watch(checked, (newVal) => {
	emit("checked", newVal);
	emit("update:value", newVal);
});

// Watch for external value changes (v-model)
watch(
	() => props.value,
	(newVal) => {
		checked.value = newVal;
	},
);
</script>

<template>
	<component :is="type" class="lg:w-1">
		<label :class="{ 'opacity-50': disabled }" class="checkbox">
			<!--
         Use 'readonly' prop to determine if the checkbox can be changed.
         The v-model now interacts with the 'checked' ref, which syncs with the external v-model
      -->
			<input v-model="checked" type="checkbox" :disabled="disabled || readonly" />
			<span class="check" />
		</label>
	</component>
</template>
