<script setup>
import { mdiHelpCircleOutline } from "@mdi/js";
import { useSlots, computed } from "vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import IconRounded from "@/components/IconRounded.vue";

defineProps({
	icon: {
		type: String,
		default: null,
	},
	title: {
		type: String,
		required: true,
	},
	main: Boolean,
	buttonEnabled: Boolean,
	buttonIcon: {
		type: String,
		default: mdiHelpCircleOutline,
	},
});

const hasSlot = computed(() => useSlots().default);

const emit = defineEmits(["click"]);

const emitClick = () => {
	emit("click");
};
</script>

<template>
	<section :class="{ 'pt-6': !main }" class="mb-6 flex items-center justify-between">
		<div class="flex items-center justify-start">
			<IconRounded v-if="icon && main" :icon="icon" color="fipu_blue" class="mr-3" bg />
			<BaseIcon v-else-if="icon" :path="icon" class="mr-2" size="20" />
			<h1 :class="main ? 'text-3xl' : 'text-2xl'" class="leading-tight">
				{{ title }}
			</h1>
		</div>
		<slot v-if="hasSlot" />
		<BaseButton v-if="buttonEnabled" :icon="buttonIcon" color="whiteDark" @click="emitClick" />
	</section>
</template>
