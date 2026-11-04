<script setup>
import { FieldControl, Primitive, injectFieldRootContext } from "reka-ui";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { Combobox } from "reka-ui/namespaced";
import { mdiChevronDown } from "@mdi/js";
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
		<Combobox.Root :model-value="model" :disabled="disabled" :ignore-filter="true" open-on-focus open-on-click reset-model-value-on-clear @update:model-value="model = $event ?? ''">
			<Combobox.Anchor class="form-control-surface relative rounded-sm border" :class="important || fieldContext?.invalid.value ? 'border-red-500' : 'border-gray-700'">
				<component :is="fieldContext ? FieldControl : Primitive" as-child :model-value="fieldContext ? search : undefined">
					<Combobox.Input
						v-model="search"
						:display-value="displayValue"
						:disabled="disabled"
						:aria-invalid="important || fieldContext?.invalid.value || undefined"
						v-bind="important || help ? { 'aria-describedby': helpId } : {}"
						:aria-label="fieldContext ? undefined : 'Odaberi opciju'"
						class="peer relative block w-full max-w-full cursor-text overflow-hidden rounded-sm border-0 bg-white p-3 pr-10 text-left hover:border-fipu_blue focus:outline-hidden focus:ring-3 focus:ring-fipu_blue" />
				</component>
				<Combobox.Trigger class="absolute right-1.5 top-0 flex h-full items-center px-2 focus-visible:outline-solid focus-visible:outline-fipu_blue" aria-label="Prikaži opcije" :disabled="disabled">
					<BaseIcon :path="mdiChevronDown" w="w-4" h="h-4" :size="16" aria-hidden="true" class="shrink-0 text-gray-500 dark:text-slate-400" />
				</Combobox.Trigger>
			</Combobox.Anchor>
			<Combobox.Portal>
				<Combobox.Content position="popper" :side-offset="8" class="reka-animated fipu_vertical_scrollbar z-10000 max-h-64 w-(--reka-combobox-trigger-width) overflow-y-auto rounded-sm bg-gray-50 drop-shadow-lg">
					<Combobox.Viewport>
						<Combobox.Empty class="px-3 py-2 text-sm text-gray-500">Nema rezultata.</Combobox.Empty>
						<Combobox.Item
							v-for="(item, index) in filteredList"
							:key="index"
							:value="itemValue(item)"
							:text-value="itemLabel(item)"
							:disabled="item?.disabled || item?.unavailable"
							class="block cursor-pointer px-2 text-left text-gray-950 outline-hidden data-disabled:pointer-events-none data-highlighted:bg-gray-200 data-[state=checked]:bg-fipu_blue data-[state=checked]:font-bold data-highlighted:text-gray-700 data-[state=checked]:text-gray-50 data-disabled:opacity-50"
							:class="l ? 'py-2 text-sm' : 'py-4'">
							{{ itemLabel(item) }}
						</Combobox.Item>
					</Combobox.Viewport>
				</Combobox.Content>
			</Combobox.Portal>
		</Combobox.Root>
		<div v-if="important || help" :id="helpId" class="-mt-1 text-xs" :class="important ? 'text-red-500' : 'text-gray-500'">{{ important ? "Polje je obavezno" : help }}</div>
	</div>
</template>
