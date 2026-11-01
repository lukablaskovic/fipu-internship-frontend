<script setup>
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "reka-ui";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiChevronDown } from "@mdi/js";
import { computed, ref } from "vue";

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

const open = ref(false);

const emit = defineEmits(["update:modelValue"]);

const iconRightComputed = computed(() => (props.label && !props.icon && !props.iconRight ? mdiChevronDown : props.iconRight));

function handleOptionSelect(option) {
	emit("update:modelValue", option);
}
</script>

<template>
	<div class="relative inline-block text-left">
		<DropdownMenuRoot v-model:open="open">
			<DropdownMenuTrigger as-child :disabled="disabled">
				<BaseButton
					:label="label"
					:icon="icon"
					:aria-label="label || 'Otvori izbornik'"
					:icon-right="iconRightComputed"
					:active="open"
					:small="small"
					:icon-w="iconW"
					:icon-h="iconH"
					:icon-size="iconSize"
					:color="color"
					:outline="outline"
					:disabled="disabled" />
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent
					:align="left ? 'start' : 'end'"
					:side-offset="8"
					class="z-[99999] max-h-[var(--reka-dropdown-menu-content-available-height)] w-56 divide-y divide-gray-100 overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-gray-700 dark:bg-slate-800">
					<DropdownMenuGroup v-for="(optionsGroup, index) in options" :key="index" class="px-1 py-1">
						<DropdownMenuItem
							v-for="option in optionsGroup"
							:key="option.id"
							:disabled="option.disabled || option.unavailable"
							:text-value="option.label"
							class="group flex w-full cursor-pointer items-center rounded-md px-2 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 data-[disabled]:opacity-50 dark:data-[highlighted]:bg-slate-700"
							@select="handleOptionSelect(option)">
							<BaseIcon :path="option.icon" class="mr-3" />
							<span>{{ option.label }}</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenuRoot>
	</div>
</template>
