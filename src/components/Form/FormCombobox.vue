<script setup>
import { ComboboxRoot, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxViewport, ComboboxItem, ComboboxEmpty } from "reka-ui";
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
		<ComboboxRoot :model-value="model" :disabled="disabled" :ignore-filter="true" open-on-focus open-on-click reset-model-value-on-clear @update:model-value="model = $event ?? ''">
			<ComboboxAnchor class="relative rounded border" :class="important ? 'border-red-500' : 'border-gray-700'">
				<ComboboxInput
					v-model="search"
					:display-value="displayValue"
					:disabled="disabled"
					:aria-invalid="important || undefined"
					:aria-describedby="helpId"
					aria-label="Odaberi opciju"
					class="peer relative block w-full max-w-full cursor-text overflow-hidden rounded border-0 bg-white p-3 pr-10 text-left hover:border-cyan-700 focus:outline-none focus:ring focus:ring-fipu_blue" />
				<ComboboxTrigger class="absolute right-1.5 top-0 flex h-full items-center px-2 focus-visible:outline focus-visible:outline-fipu_blue" aria-label="Prikaži opcije" :disabled="disabled">
					<svg aria-hidden="true" viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor"><path d="m5 7 5 5 5-5H5Z" /></svg>
				</ComboboxTrigger>
			</ComboboxAnchor>
			<ComboboxPortal>
				<ComboboxContent position="popper" :side-offset="8" class="fipu_vertical_scrollbar z-[10000] max-h-64 w-[var(--reka-combobox-trigger-width)] overflow-y-auto rounded bg-gray-50 drop-shadow-lg">
					<ComboboxViewport>
						<ComboboxEmpty class="px-3 py-2 text-sm text-gray-500">Nema rezultata.</ComboboxEmpty>
						<ComboboxItem
							v-for="(item, index) in filteredList"
							:key="index"
							:value="itemValue(item)"
							:text-value="itemLabel(item)"
							:disabled="item?.disabled || item?.unavailable"
							class="block cursor-pointer px-2 text-left text-gray-950 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[state=checked]:bg-fipu_blue data-[state=checked]:font-bold data-[highlighted]:text-gray-700 data-[state=checked]:text-gray-50 data-[disabled]:opacity-50"
							:class="l ? 'py-2 text-sm' : 'py-4'">
							{{ itemLabel(item) }}
						</ComboboxItem>
					</ComboboxViewport>
				</ComboboxContent>
			</ComboboxPortal>
		</ComboboxRoot>
		<div :id="helpId" class="-mt-1 text-xs" :class="important ? 'text-red-500' : 'text-gray-500'">{{ important ? "Polje je obavezno" : help }}</div>
	</div>
</template>
