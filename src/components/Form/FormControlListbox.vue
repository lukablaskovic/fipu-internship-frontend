<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { injectFieldRootContext } from "reka-ui";
const fieldContext = injectFieldRootContext(null);
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { computed, ref } from "vue";
const props = defineProps({
	options: { type: Array, default: () => [] },
	modelValue: { type: [Object, String, Number, Boolean], default: null },
	buttonClass: { type: [String, Array], default: null },
	icon: { type: String, default: null },
	id: { type: String, default: undefined },
	name: { type: String, default: undefined },
	placeholder: { type: String, default: "Odaberite" },
	disabled: Boolean,
	readonly: Boolean,
	required: Boolean,
});
const isDisabled = computed(() => props.disabled || props.readonly || fieldContext?.disabled.value);
const isRequired = computed(() => props.required || fieldContext?.required.value);

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
	<!-- Only the native select below submits the public value, rather than an internal option index. -->
	<Select name="" :model-value="selected" :disabled="!!isDisabled" :required="!!isRequired" @update:model-value="update">
		<SelectTrigger v-bind="$attrs" :id="id" ref="trigger" :class="buttonClass" class="form-select-trigger h-auto min-h-9 gap-2 text-left data-[size=default]:h-auto" :aria-readonly="readonly || undefined">
			<BaseIcon v-if="icon" :path="icon" w="w-4" h="h-4" :size="16" class="shrink-0 text-fipu_blue" aria-hidden="true" />
			<SelectValue :placeholder="placeholder" />
		</SelectTrigger>
		<SelectContent position="popper" :side-offset="4" class="z-10000 max-h-60 min-w-(--reka-select-trigger-width) max-w-[calc(100vw-2rem)]">
				<SelectItem
					v-for="(option, index) in options"
					:key="index"
					:value="String(index)"
					:disabled="!!(option?.unavailable || option?.disabled)"
					:text-value="String(option?.label ?? option)">
					<span class="min-w-0 whitespace-normal wrap-break-word">{{ option?.label ?? option }}</span>
				</SelectItem>
		</SelectContent>
	</Select>
	<select :name="name ?? fieldContext?.name.value" :value="modelValue == null ? '' : String(modelValue)" :required="!!isRequired" :disabled="!!isDisabled" tabindex="-1" aria-hidden="true" class="sr-only" @invalid.prevent="trigger?.$el?.focus()">
		<option value="" />
		<option v-for="(option, index) in options" :key="index" :value="String(option)" :disabled="!!(option?.unavailable || option?.disabled)">{{ option?.label ?? option }}</option>
	</select>
</template>
