<script setup>
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
		<DropdownMenu v-model:open="open">
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
			<DropdownMenuContent
				:align="left ? 'start' : 'end'"
				:side-offset="8"
				:class="label ? 'w-(--reka-dropdown-menu-trigger-width)' : 'w-56'"
				class="z-99999 divide-y divide-border">
				<DropdownMenuGroup v-for="(optionsGroup, index) in options" :key="index" class="px-1 py-1">
					<DropdownMenuItem
						v-for="option in optionsGroup"
						:key="option.id"
						:disabled="option.disabled || option.unavailable"
						:text-value="option.label"
						class="w-full cursor-pointer"
						@select="handleOptionSelect(option)">
						<BaseIcon v-if="option.icon" :path="option.icon" class="mr-3 shrink-0" />
						<span>{{ option.label }}</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</template>
