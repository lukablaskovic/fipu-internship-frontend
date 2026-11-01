<script setup>
import { appConfig } from "@/config";

import CardBox from "@/components/Cardbox/CardBox.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { colorsText } from "@/colors.js";
import { ActivityEventMappings } from "@/helpers/maps";
import { mdiCreditCardOutline } from "@mdi/js";

import { computed } from "vue";

const props = defineProps({
	student: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
	jmbag: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	model: {
		type: String,
		required: true,
	},
});

const icon = computed(() => {
	const eventMapping = ActivityEventMappings.getEvent(props.type);

	if (eventMapping) {
		return {
			icon: eventMapping.icon,
			type: eventMapping.type,
		};
	}

	return {
		icon: mdiCreditCardOutline,
		type: "info",
	};
});
</script>

<template>
	<CardBox class="mb-2 last:mb-0" is-hoverable has-component-layout>
		<div class="flex w-full min-w-0 items-start gap-3 px-4 py-3">
			<BaseIcon :path="icon.icon" :class="colorsText[icon.type]" class="mt-0.5 shrink-0" w="w-6" h="h-6" :size="24" />
			<div class="min-w-0 flex-1 space-y-1">
				<div class="flex flex-wrap items-center gap-x-2 gap-y-1">
					<h4 class="break-words text-sm font-semibold">{{ student }}</h4>
					<PillTag :color="model === appConfig.bpmn_process_name_A + '.bpmn' ? 'danger' : 'success'" :label="model === appConfig.bpmn_process_name_A + '.bpmn' ? 'Model A' : 'Model B'" small />
				</div>
				<div class="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 dark:text-slate-400">
					<p class="min-w-0 break-words">JMBAG: {{ jmbag }}</p>
					<p class="min-w-0 break-words">Email: {{ email }}</p>
				</div>
				<div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-1">
					<PillTag :color="icon.type" :label="ActivityEventMappings.getEvent(type).message" small />
					<p class="text-xs text-gray-500 dark:text-slate-400">{{ props.date }}</p>
				</div>
			</div>
		</div>
	</CardBox>
</template>
