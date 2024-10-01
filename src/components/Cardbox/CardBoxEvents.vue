<script setup>
import BaseLevel from "@/components/Base/BaseLevel.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import PillTag from "@/components/PillTag/PillTag.vue";
import IconRounded from "@/components/IconRounded.vue";
import { ActivityEventMappings } from "@/helpers/maps";
import { mdiCreditCardOutline } from "@mdi/js";
import { mainStore } from "@/main.js";
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
	<CardBox class="mb-6 last:mb-0" is-hoverable>
		<BaseLevel>
			<BaseLevel type="justify-start">
				<IconRounded :icon="icon.icon" :color="icon.type" class="md:mr-6" />
				<div class="space-y-1 text-center md:mr-6 md:text-left">
					<h4 class="text-xl">{{ student }}</h4>
					<p class="text-gray-500 dark:text-slate-400">
						<b>JMBAG: {{ jmbag }}</b>
					</p>
					<p class="text-gray-500 dark:text-slate-400">
						<em>Email: {{ email }}</em>
					</p>
					<p class="text-gray-500 dark:text-slate-400">
						<em>Model: <PillTag :color="model === mainStore.bpmn_process_name_A + '.bpmn' ? 'danger' : 'success'" :label="model === mainStore.bpmn_process_name_A + '.bpmn' ? 'A' : 'B'" /></em>
					</p>
				</div>
			</BaseLevel>
			<div class="space-y-2 text-center md:text-right">
				<p class="text-sm text-gray-500">
					{{ props.date }}
				</p>
				<div>
					<PillTag :color="icon.type" :label="ActivityEventMappings.getEvent(type).message" small />
				</div>
			</div>
		</BaseLevel>
	</CardBox>
</template>
