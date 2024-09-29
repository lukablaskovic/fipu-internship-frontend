<template>
	<Combobox v-model="selected">
		<div class="relative z-50">
			<div class="relative w-full cursor-default overflow-hidden rounded border border-black bg-white text-left sm:text-sm">
				<ComboboxInput class="h-12 w-full max-w-full px-3 py-2 focus:outline-none focus:ring dark:bg-slate-800 dark:placeholder-gray-400" :display-value="(company) => company.label" :placeholder="props.placeholder" @change="query = $event.target.value" />
				<ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
					<MdiUnfoldMoreHorizontal class="h-5 w-5 text-gray-700 hover:text-fipu_blue" aria-hidden="true" />
				</ComboboxButton>
			</div>
			<TransitionRoot leave="transition ease-in duration-100" leave-from="opacity-100" leave-to="opacity-0" @after-leave="query = ''">
				<ComboboxOptions class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
					<div v-if="companies.length === 0 && query !== ''" class="relative cursor-default select-none px-4 py-2 text-gray-700">Nema rezultata.</div>

					<ComboboxOption v-for="company in companies" v-slot="{ selected, active }" :key="company.id" as="template" :value="company">
						<li
							class="relative cursor-default select-none py-2 pl-10 pr-4"
							:class="{
								'bg-fipu_blue text-white': active,
								'text-gray-900': !active,
							}">
							<span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
								{{ company.label }}
							</span>
							<span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3" :class="{ 'text-white': active, 'text-fipu_blue': !active }">
								<mdiCheck class="h-5 w-5 text-fipu_blue" aria-hidden="true" />
							</span>
						</li>
					</ComboboxOption>
				</ComboboxOptions>
			</TransitionRoot>
		</div>
	</Combobox>
</template>

<script setup>
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption, TransitionRoot } from "@headlessui/vue";
import { ref, computed, onMounted, watch } from "vue";

import MdiUnfoldMoreHorizontal from "vue-material-design-icons/UnfoldMoreHorizontal.vue";
import mdiCheck from "vue-material-design-icons/Check.vue";
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
	options: {
		type: Array,
		default: () => [],
	},
	placeholder: {
		type: String,
		default: "",
	},
});

let query = ref("");

let companies = computed(() => (query.value === "" ? props.options : props.options.filter((company) => company.label.toLowerCase().replace(/\s+/g, "").includes(query.value.toLowerCase().replace(/\s+/g, "")))));
let selected = ref(companies.value[0]);

watch(
	() => selected.value,
	(newVal) => {
		emit("update:modelValue", newVal);
	},
);

watch(
	() => query.value,
	(newQuery) => {
		if (!newQuery) {
			selected.value = ref();
		}
	},
);
</script>
