<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiChevronDown } from "@mdi/js";
import { computed } from "vue";

// Define component props
const props = defineProps({
	icon: {
		type: String,
		default: null,
	},
	iconRight: {
		type: String,
		default: null,
	},
	label: {
		type: String,
		default: null,
	},
	options: {
		type: Array,
		required: true,
	},
	modelValue: {
		type: Object,
		default: null,
	},
	left: Boolean,
	iconW: {
		type: String,
		default: null,
	},
	iconH: {
		type: String,
		default: null,
	},
	iconSize: {
		type: [String, Number],
		default: null,
	},
	small: Boolean,
	color: {
		type: String,
		default: "lightDark",
	},
	outline: Boolean,
	disabled: Boolean,
});

const emit = defineEmits(["update:modelValue"]);

const iconRightComputed = computed(() => (props.label && !props.icon && !props.iconRight ? mdiChevronDown : props.iconRight));

function handleOptionSelect(option) {
	emit("update:modelValue", option); // Emit the selected option when clicked
}
</script>

<template>
	<Menu as="div" class="relative inline-block text-left">
		<div>
			<MenuButton v-slot="{ open }" :disabled="disabled">
				<BaseButton :label="label" :icon="icon" :icon-right="iconRightComputed" :active="open" :small="small" :icon-w="iconW" :icon-h="iconH" :icon-size="iconSize" :color="color" :outline="outline" :disabled="disabled" />
			</MenuButton>
		</div>

		<transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
			<MenuItems :class="left ? 'left-0' : 'right-0'" class="absolute z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-gray-700 dark:bg-slate-800">
				<!-- Iterate over options and emit selected value when clicked -->
				<div v-for="(optionsGroup, index) in options" :key="index" class="px-1 py-1">
					<MenuItem v-for="option in optionsGroup" :key="option.id" v-slot="{ active }">
						<button :class="{ 'bg-gray-100 dark:bg-slate-700': active }" class="group flex w-full items-center rounded-md px-2 py-2 text-sm" @click="handleOptionSelect(option)">
							<BaseIcon :path="option.icon" class="mr-3" />
							<span>{{ option.label }}</span>
						</button>
					</MenuItem>
				</div>
			</MenuItems>
		</transition>
	</Menu>
</template>
