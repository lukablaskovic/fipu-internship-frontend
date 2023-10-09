<script setup>
import { ref, computed, nextTick } from "vue";
import { colorsBgLight, colorsOutline } from "@/colors.js";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
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
	<div v-if="!isDismissed" :ref="(el) => (notificationElement = el)" :class="componentClass" class="px-3 md:py-3 mb-6 last:mb-0 border rounded-lg transition-colors duration-150">
		<BaseLevel>
			<div class="flex flex-col md:flex-row items-center">
				<BaseIcon v-if="icon" :path="icon" w="w-10 md:w-5" h="h-10 md:h-5" size="24" class="md:mr-2" />
				<span class="text-center md:text-left py-1 2xl:py-2"><slot /></span>
			</div>
		</BaseLevel>
	</div>
</template>
