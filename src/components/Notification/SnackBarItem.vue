<script setup>
import { Toast } from "reka-ui/namespaced";
import { getButtonColor } from "@/colors.js";

defineProps({
	lifetime: {
		type: Number,
		required: true,
		validator: (value) => value >= 0,
	},
	timestamp: {
		type: Number,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true,
		validator: (value) => ["contrast", "info", "success", "warning", "danger", "error"].includes(value),
	},
});

const emit = defineEmits(["cancel"]);
</script>

<template>
	<Toast.Root
		:duration="lifetime"
		:class="getButtonColor(color === 'error' ? 'danger' : color, false, true)"
		class="reka-animated pointer-events-auto flex w-full items-center gap-4 self-end overflow-hidden px-6 py-4 shadow-sm md:w-auto md:max-w-full md:rounded-xl"
		@update:open="!$event && emit('cancel', timestamp)"
	>
		<Toast.Description class="min-w-0 wrap-break-word">{{ text }}</Toast.Description>
		<Toast.Close aria-label="Zatvori obavijest" class="shrink-0 rounded-sm px-2 py-1 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2">×</Toast.Close>
	</Toast.Root>
</template>
