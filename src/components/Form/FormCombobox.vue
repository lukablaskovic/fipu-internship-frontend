<script setup>
import { FieldControl, Primitive, injectFieldRootContext } from "reka-ui";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxList, ComboboxTrigger, ComboboxViewport } from "@/components/ui/combobox";
import { mdiCheck, mdiChevronDown } from "@mdi/js";
const fieldContext = injectFieldRootContext(null);
import { computed, ref, useId } from "vue";

const props = defineProps({ labelName: { type: String, default: "" }, emitName: { type: String, default: "" }, list: { type: Array, default: () => [] }, l: Boolean, disabled: Boolean, important: Boolean, help: { type: String, default: "" } });
const model = defineModel({ type: [String, Number, Object], default: "" });
const search = ref("");
const helpId = useId();
const itemLabel = (item) => String((props.labelName ? item?.[props.labelName] : item) ?? "");
const itemValue = (item) => (props.emitName ? item[props.emitName] : item);
const displayValue = (value) => {
	const item = props.list.find((item) => itemValue(item) === value);
	return item !== undefined ? itemLabel(item) : itemLabel(value);
};
const normalize = (value) => String(value).toLocaleLowerCase("hr").replace(/\s+/g, "");
const filteredList = computed(() => {
	if (search.value === displayValue(model.value)) return props.list;
	return props.list.filter((item) => normalize(itemLabel(item)).includes(normalize(search.value)));
});
</script>

<template>
	<div class="flex flex-col gap-2" :class="disabled ? 'opacity-75 contrast-[0.9]' : ''">
		<Combobox :model-value="model" :disabled="disabled" :ignore-filter="true" open-on-focus open-on-click reset-model-value-on-clear @update:model-value="model = $event ?? ''">
			<ComboboxAnchor class="form-control-surface relative rounded-sm border" :class="important || fieldContext?.invalid.value ? 'border-red-500' : 'border-gray-700'">
				<component :is="fieldContext ? FieldControl : Primitive" as-child :model-value="fieldContext ? search : undefined">
					<ComboboxInput
						v-model="search"
						:display-value="displayValue"
						:disabled="disabled"
						:aria-invalid="important || fieldContext?.invalid.value || undefined"
						v-bind="important || help ? { 'aria-describedby': helpId } : {}"
						:aria-label="fieldContext ? undefined : 'Odaberi opciju'"
						class="peer relative block w-full max-w-full cursor-text overflow-hidden rounded-sm border-0 bg-white p-3 pr-10 text-left hover:border-fipu_blue focus:outline-hidden focus:ring-3 focus:ring-fipu_blue" />
				</component>
				<ComboboxTrigger class="absolute right-1.5 top-0 flex h-full items-center px-2 focus-visible:outline-solid focus-visible:outline-fipu_blue" aria-label="Prikaži opcije" :disabled="disabled">
					<BaseIcon :path="mdiChevronDown" w="w-4" h="h-4" :size="16" aria-hidden="true" class="shrink-0 text-gray-500 dark:text-slate-400" />
				</ComboboxTrigger>
			</ComboboxAnchor>
			<ComboboxList position="popper" :side-offset="8" class="z-10000 max-h-[min(24rem,var(--reka-combobox-content-available-height))] max-w-[calc(100vw-2rem)]">
				<ComboboxViewport class="max-h-[min(16rem,var(--reka-combobox-content-available-height))]">
					<ComboboxEmpty class="px-3 py-2 text-sm text-gray-500">Nema rezultata.</ComboboxEmpty>
					<ComboboxItem
						v-for="(item, index) in filteredList"
						:key="index"
						:value="itemValue(item)"
						:text-value="itemLabel(item)"
						:disabled="item?.disabled || item?.unavailable"
						class="whitespace-normal wrap-break-word"
						:class="l ? 'py-1' : 'py-2'">
						{{ itemLabel(item) }}
						<ComboboxItemIndicator><BaseIcon :path="mdiCheck" w="w-4" h="h-4" :size="16" aria-hidden="true" /></ComboboxItemIndicator>
					</ComboboxItem>
				</ComboboxViewport>
			</ComboboxList>
		</Combobox>
		<div v-if="important || help" :id="helpId" class="-mt-1 text-xs" :class="important ? 'text-red-500' : 'text-gray-500'">{{ important ? "Polje je obavezno" : help }}</div>
	</div>
</template>
