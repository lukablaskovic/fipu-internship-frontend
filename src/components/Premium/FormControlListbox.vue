<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { injectFieldRootContext } from "reka-ui";
import { mdiChevronDown } from "@mdi/js";
const fieldContext = injectFieldRootContext(null);
import { Select } from "reka-ui/namespaced";
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
	<Select.Root name="" :model-value="selected" :disabled="!!isDisabled" :required="!!isRequired" @update:model-value="update">
		<Select.Trigger v-bind="$attrs" :id="id" ref="trigger" :class="buttonClass" class="form-select-trigger flex items-center justify-between gap-2 text-left" :aria-readonly="readonly || undefined">
			<BaseIcon v-if="icon" :path="icon" w="w-4" h="h-4" :size="16" class="shrink-0 text-fipu_blue" aria-hidden="true" />
			<Select.Value :placeholder="placeholder" /><Select.Icon aria-hidden="true" class="inline-flex shrink-0 items-center text-gray-500 dark:text-slate-400"><BaseIcon :path="mdiChevronDown" w="w-4" h="h-4" :size="16" /></Select.Icon>
		</Select.Trigger>
		<Select.Portal>
			<Select.Content position="popper" :side-offset="4" class="reka-animated z-[10000] max-h-60 min-w-[var(--reka-select-trigger-width)] overflow-auto rounded bg-white text-gray-700 shadow-lg ring-1 ring-black/10 dark:bg-slate-800 dark:text-white">
				<Select.Viewport>
					<Select.Item
						v-for="(option, index) in options"
						:key="index"
						:value="String(index)"
						:disabled="!!(option?.unavailable || option?.disabled)"
						:text-value="String(option?.label ?? option)"
						class="relative flex cursor-default select-none items-center gap-2 px-3 py-2 outline-none data-[highlighted]:bg-gray-100 data-[disabled]:opacity-50 dark:data-[highlighted]:bg-slate-700">
						<Select.ItemIndicator class="absolute left-2">✓</Select.ItemIndicator><Select.ItemText class="pl-5">{{ option?.label ?? option }}</Select.ItemText>
					</Select.Item>
				</Select.Viewport>
			</Select.Content>
		</Select.Portal>
	</Select.Root>
	<select :name="name ?? fieldContext?.name.value" :value="modelValue == null ? '' : String(modelValue)" :required="!!isRequired" :disabled="!!isDisabled" tabindex="-1" aria-hidden="true" class="sr-only" @invalid.prevent="trigger?.$el?.focus()">
		<option value="" />
		<option v-for="(option, index) in options" :key="index" :value="String(option)" :disabled="!!(option?.unavailable || option?.disabled)">{{ option?.label ?? option }}</option>
	</select>
</template>
