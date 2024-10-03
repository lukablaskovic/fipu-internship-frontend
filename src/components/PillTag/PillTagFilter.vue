<script setup>
import { mdiChevronUp, mdiChevronDown, mdiAlertCircleOutline, mdiFilter, mdiFilterCheck } from "@mdi/js";
import PillTag from "@/components/PillTag/PillTag.vue";
import { computed, ref, onMounted } from "vue";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { adminStore, snackBarStore } from "@/main";

import Utils from "@/helpers/utils.js";

import { ActivityEventMappings } from "@/helpers/maps";

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
		const preSelectedEvents = adminStore.selectedEvents;
		selectedOptions.value = [...preSelectedEvents];
		if (Utils.isArrayEmpty(preSelectedEvents)) {
			setDefaultFilters();
		}
	}
});

const defualtEventsSet = computed(() => {
	const defaultEvents = ActivityEventMappings.events.filter((event) => !ActivityEventMappings.skipEvents.includes(event.activity_id) && !ActivityEventMappings.isGatewayEvent(event.activity_id)).map((event) => event.activity_id);

	return Utils.arraysEqual(adminStore.selectedEvents, defaultEvents);
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

	// eslint-disable-next-line no-undef
	const emit = defineEmits(["update:modelValue"]);

	computed({
		get: () => props.modelValue,
		set: (value) => {
			emit("update:modelValue", value);
		},
	});

	return {
		style: "info",
	};
});

const selectedOptions = ref([]);

const saveSelectedEvents = async () => {
	adminStore.selectedEvents = selectedOptions.value;

	snackBarStore.pushMessage("Event-Filteri ažurirani!", "success");
	await Utils.wait(0.5);
	location.reload();
};

const capitalizeAndReplace = (inputString) => {
	let replacedString = inputString.replace(/_/g, " ");
	let words = replacedString.split(" ");

	for (let i = 0; i < words.length; i++) {
		words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
	}

	return words.join(" ");
};

const setDefaultFilters = () => {
	const defaultEvents = ActivityEventMappings.events.filter((event) => !ActivityEventMappings.skipEvents.includes(event.activity_id) && !ActivityEventMappings.isGatewayEvent(event.activity_id)).map((event) => event.activity_id);

	selectedOptions.value = defaultEvents;

	adminStore.selectedEvents = defaultEvents;
};

const toggleSelection = (option) => {
	const index = selectedOptions.value.indexOf(option.label);
	if (index === -1) {
		selectedOptions.value.push(option.label);
	} else {
		selectedOptions.value.splice(index, 1);
	}
};

//snackBarStore.pushMessage("Event-Filteri resetirani!", "success");
</script>

<template>
	<Menu as="div" class="relative inline-block text-left">
		<div>
			<MenuButton v-slot="{ open }" :disabled="disabled">
				<PillTag :label="trend" :color="trendStyle.style" :icon="trendStyle.icon" :small="small" :active="open" :disabled="disabled" />
			</MenuButton>
		</div>

		<transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
			<MenuItems :class="left ? 'left-0' : 'right-0'" class="fipu_vertical_scrollbar absolute z-50 mt-2 h-96 w-64 origin-top-right divide-y divide-gray-100 overflow-y-auto overflow-x-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 drop-shadow focus:outline-none dark:divide-gray-700 dark:bg-slate-950 md:w-96">
				<div class="p-2">Odaberite događaje za koje želite da se prikazuju</div>
				<div v-for="(optionsGroup, index) in options" :key="index" class="px-1 py-1">
					<MenuItem v-for="option in optionsGroup" :key="option.id" v-slot="{ active }">
						<button
							:class="[
								option.label === 'Spremi' ? 'hover:bg-emerald-600 hover:font-bold hover:text-slate-100 dark:hover:bg-emerald-500 dark:hover:text-gray-950' : active && option.label != 'Resetiraj' ? 'bg-gray-300 dark:bg-gray-900' : '',
								selectedOptions.includes(option.label) ? 'bg-fipu_blue font-medium text-gray-950 hover:bg-fipu_light_blue hover:text-slate-800 dark:hover:bg-fipu_dark_blue dark:hover:text-gray-950' : '',
								option.label === 'Resetiraj' ? 'hover:bg-rose-500 hover:font-bold hover:text-slate-100 dark:hover:bg-rose-600 dark:hover:text-slate-950' : '',
								'group my-1 flex w-full items-center gap-2 rounded-md px-1 py-1 text-sm transition-all md:gap-3 md:px-2 md:py-2',
							]"
							:disabled="option.label === 'Spremi'"
							@click.prevent="option.label === 'Spremi' ? saveSelectedEvents() : option.label === 'Resetiraj' ? setDefaultFilters() : toggleSelection(option)">
							<BaseIcon :path="option.icon" class="" />
							<div class="flex grow items-center justify-start text-left">
								{{ capitalizeAndReplace(option.label) }}
							</div>
						</button>
					</MenuItem>
				</div>
			</MenuItems>
		</transition>
	</Menu>
</template>
