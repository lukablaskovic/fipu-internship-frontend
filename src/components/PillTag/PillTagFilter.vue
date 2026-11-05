<script setup>
import { mdiChevronUp, mdiChevronDown, mdiAlertCircleOutline, mdiFilter, mdiFilterCheck, mdiRestore } from "@mdi/js";
import { computed, ref, onMounted } from "vue";

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { useAdminStore } from "@/stores/admin_store";


import Utils from "@/helpers/utils.js";

import { ActivityEventMappings } from "@/helpers/maps";

const adminStore = useAdminStore();

const props = defineProps({
	trend: {
		type: String,
		required: true,
	},
	trendType: {
		type: String,
		default: null,
	},
	small: Boolean,

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
		type: String,
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
	color: {
		type: String,
		default: "lightDark",
	},
	outline: Boolean,
	disabled: Boolean,
});

onMounted(() => {
	if (props.trendType === "filter") {
		if (adminStore.selectedEvents == null) {
			setDefaultFilters();
		}
	}
});

const defualtEventsSet = computed(() => {
	const defaultEvents = ActivityEventMappings.events.filter((event) => !ActivityEventMappings.skipEvents.includes(event.activity_id) && !ActivityEventMappings.isGatewayEvent(event.activity_id)).map((event) => event.activity_id);

	return Utils.arraysEqual(adminStore.selectedEvents ?? defaultEvents, defaultEvents);
});

const trendStyle = computed(() => {
	if (props.trendType === "up") {
		return {
			icon: mdiChevronUp,
			style: "success",
		};
	}

	if (props.trendType === "down") {
		return {
			icon: mdiChevronDown,
			style: "danger",
		};
	}

	if (props.trendType === "alert") {
		return {
			icon: mdiAlertCircleOutline,
			style: "warning",
		};
	}

	if (props.trendType === "filter") {
		return {
			icon: defualtEventsSet.value ? mdiFilter : mdiFilterCheck,
			style: defualtEventsSet.value ? "fipu_blue" : "success",
		};
	}

	return {
		style: "info",
	};
});

const selectedOptions = computed(() => adminStore.selectedEvents ?? []);
const open = ref(false);

const setDefaultFilters = () => {
	const defaultEvents = ActivityEventMappings.events.filter((event) => !ActivityEventMappings.skipEvents.includes(event.activity_id) && !ActivityEventMappings.isGatewayEvent(event.activity_id)).map((event) => event.activity_id);

	adminStore.selectedEvents = defaultEvents;
};

const toggleSelection = (option) => {
	const index = selectedOptions.value.indexOf(option.id);
	if (index === -1) {
		selectedOptions.value.push(option.id);
	} else {
		selectedOptions.value.splice(index, 1);
	}
};
</script>

<template>
	<div class="relative inline-block text-left">
		<DropdownMenu v-model:open="open">
			<DropdownMenuTrigger :disabled="disabled" class="flex items-center gap-2 rounded-[10px] border border-fipu_blue bg-white px-3 py-2 text-left focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-fipu_blue disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800" :aria-label="trend">
				<BaseIcon :path="trendStyle.icon" w="w-4" h="h-4" :size="16" class="text-fipu_blue" aria-hidden="true" />
				<span>{{ trend }}</span>
				<BaseIcon :path="mdiChevronDown" w="w-4" h="h-4" :size="16" class="shrink-0 text-gray-500 dark:text-slate-400" aria-hidden="true" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				:align="left ? 'start' : 'end'"
				:side-offset="8"
				class="z-10000 flex max-h-[min(24rem,var(--reka-dropdown-menu-content-available-height))] w-96 max-w-[calc(100vw-2rem)] flex-col overflow-hidden">
				<DropdownMenuLabel class="shrink-0 px-3 py-2 text-sm">Odaberite događaje koje želite prikazivati</DropdownMenuLabel>
				<div class="fipu_vertical_scrollbar min-h-0 overflow-y-auto">
					<DropdownMenuGroup v-for="(optionsGroup, index) in options" :key="index" class="px-1 py-1">
						<DropdownMenuCheckboxItem
							v-for="option in optionsGroup"
							:key="option.id"
							:model-value="selectedOptions.includes(option.id)"
							:text-value="option.label"
							:disabled="option.disabled"
							class="w-full gap-2 py-2"
							@select.prevent="toggleSelection(option)">
							<BaseIcon v-if="option.icon" :path="option.icon" class="shrink-0" aria-hidden="true" />
							<span class="flex grow items-center justify-start text-left">{{ option.label }}</span>
						</DropdownMenuCheckboxItem>
					</DropdownMenuGroup>
				</div>
				<div class="flex shrink-0 justify-end px-2 py-1.5">
					<DropdownMenuItem class="cursor-pointer gap-1.5" @select.prevent="setDefaultFilters">
						<BaseIcon :path="mdiRestore" w="w-4" h="h-4" :size="16" aria-hidden="true" />
						<span>Resetiraj</span>
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</template>
