<script setup>
import { inject } from "vue";
const fieldLabelId = inject("formFieldLabelId", undefined);
import { SelectRoot, SelectTrigger, SelectValue, SelectIcon, SelectPortal, SelectContent, SelectViewport, SelectItem, SelectItemText, SelectItemIndicator } from "reka-ui";
import { computed, ref } from "vue";
const props = defineProps({
	options: { type: Array, default: () => [] },
	modelValue: { type: [Object, String, Number, Boolean], default: null },
	buttonClass: { type: [String, Array], default: null },
	id: { type: String, default: undefined },
	name: { type: String, default: undefined },
	placeholder: { type: String, default: "Odaberite" },
	disabled: Boolean,
	readonly: Boolean,
	required: Boolean,
});
defineOptions({ inheritAttrs: false });
const trigger = ref(null);
const emit = defineEmits(["update:modelValue"]);
// Index values support empty-string options while keeping original objects in the public API.
const selected = computed(() => {
	const index = props.options.findIndex((option) => sameOption(option, props.modelValue));
	return index < 0 ? undefined : String(index);
});
function sameOption(a, b) {
	if (a === b) return true;
	if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
	return a.id != null && b.id != null ? a.id === b.id : a.label === b.label;
}
function update(value) {
	if (value !== undefined && !props.readonly) emit("update:modelValue", props.options[Number(value)]);
}
</script>
<template>
	<SelectRoot :model-value="selected" :disabled="disabled || readonly" :required="required" @update:model-value="update">
		<SelectTrigger v-bind="$attrs" :id="id" ref="trigger" :aria-labelledby="fieldLabelId" :class="buttonClass" class="flex items-center justify-between gap-2 text-left" :aria-readonly="readonly || undefined">
			<SelectValue :placeholder="placeholder" /><SelectIcon aria-hidden="true">⌄</SelectIcon>
		</SelectTrigger>
		<SelectPortal>
			<SelectContent position="popper" :side-offset="4" class="z-[10000] max-h-60 min-w-[var(--reka-select-trigger-width)] overflow-auto rounded bg-white text-gray-700 shadow-lg ring-1 ring-black/10 dark:bg-slate-800 dark:text-white">
				<SelectViewport>
					<SelectItem
						v-for="(option, index) in options"
						:key="index"
						:value="String(index)"
						:disabled="!!(option?.unavailable || option?.disabled)"
						:text-value="String(option?.label ?? option)"
						class="relative flex cursor-default select-none items-center gap-2 px-3 py-2 outline-none data-[highlighted]:bg-gray-100 data-[disabled]:opacity-50 dark:data-[highlighted]:bg-slate-700">
						<SelectItemIndicator class="absolute left-2">✓</SelectItemIndicator><SelectItemText class="pl-5">{{ option?.label ?? option }}</SelectItemText>
					</SelectItem>
				</SelectViewport>
			</SelectContent>
		</SelectPortal>
	</SelectRoot>
	<select :name="name" :value="modelValue == null ? '' : String(modelValue)" :required="required" :disabled="disabled || readonly" tabindex="-1" aria-hidden="true" class="sr-only" @invalid.prevent="trigger?.$el?.focus()">
		<option value="" />
		<option v-for="(option, index) in options" :key="index" :value="String(option)" :disabled="!!(option?.unavailable || option?.disabled)">{{ option?.label ?? option }}</option>
	</select>
</template>
