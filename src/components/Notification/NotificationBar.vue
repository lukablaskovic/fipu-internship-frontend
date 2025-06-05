<script setup>
import { colorsBgLight, colorsOutline } from "@/colors.js";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { ref, computed, nextTick } from "vue";
import Utils from "@/helpers/utils.js";

const color = ref("");
const icon = ref(null);
const isDismissed = ref(true);
const notificationElement = ref(null);

const props = defineProps({
	outline: Boolean,
	duration: {
		type: Number,
		default: 3,
	},
});

const componentClass = computed(() => {
	return props.outline ? colorsOutline[color.value] : colorsBgLight[color.value];
});

const dismiss = () => {
	isDismissed.value = true;
};

async function show() {
	isDismissed.value = false;

	await nextTick();

	await new Promise((resolve) => setTimeout(resolve, 100));

	notificationElement.value.scrollIntoView({
		behavior: "smooth",
		block: "nearest",
		inline: "start",
	});

	await Utils.wait(props.duration);

	dismiss();
}

defineExpose({
	color,
	icon,
	show,
	dismiss,
});
</script>

<template>
	<div v-if="!isDismissed" :ref="(el) => (notificationElement = el)" :class="componentClass" class="mb-6 rounded-lg border px-3 transition-colors duration-150 last:mb-0 md:py-3">
		<BaseLevel>
			<div class="flex flex-col items-center md:flex-row">
				<BaseIcon v-if="icon" :path="icon" w="w-10 md:w-5" h="h-10 md:h-5" size="24" class="md:mr-2" />
				<span class="py-1 text-center md:text-left 2xl:py-2"><slot /></span>
			</div>
		</BaseLevel>
	</div>
</template>
