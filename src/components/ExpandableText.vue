<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "reka-ui";

const props = defineProps({ text: { type: String, default: "" } });
const id = useId();
const content = ref(null);
const expanded = ref(false);
const overflowing = ref(false);
let observer;

function measure() {
	if (!expanded.value && content.value) {
		overflowing.value = content.value.scrollHeight > content.value.clientHeight + 1;
	}
}

onMounted(() => {
	observer = new ResizeObserver(measure);
	observer.observe(content.value);
	measure();
});
onBeforeUnmount(() => observer?.disconnect());
watch(expanded, measure, { flush: "post" });
watch(() => props.text, async () => {
	expanded.value = false;
	await nextTick();
	measure();
});
</script>

<template>
	<div class="min-w-0">
		<div :id="id" class="whitespace-pre-line wrap-break-word leading-7">
			<p v-show="!expanded" ref="content" class="text-preview">{{ text }}</p>
			<ScrollAreaRoot v-if="expanded" type="auto" class="relative">
				<ScrollAreaViewport class="max-h-35 overscroll-contain pr-4 focus-visible:outline-fipu_blue">
					<p>{{ text }}</p>
				</ScrollAreaViewport>
				<ScrollAreaScrollbar orientation="vertical" class="flex w-2.5 touch-none select-none rounded-full bg-slate-100 p-0.5 dark:bg-slate-700">
					<ScrollAreaThumb class="flex-1 rounded-full bg-fipu_blue" />
				</ScrollAreaScrollbar>
			</ScrollAreaRoot>
		</div>
		<button
			v-if="overflowing"
			type="button"
			class="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-fipu_blue underline-offset-4 hover:underline focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fipu_blue"
			:aria-expanded="expanded"
			:aria-controls="id"
			@click="expanded = !expanded">
			{{ expanded ? "Prikaži manje" : "Pročitaj više..." }}
		</button>
	</div>
</template>

<style scoped>
.text-preview {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 5;
	overflow: hidden;
}
</style>
