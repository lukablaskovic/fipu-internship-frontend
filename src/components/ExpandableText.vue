<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";

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
		<p :id="id" ref="content" class="whitespace-pre-line break-words leading-7" :class="{ 'text-preview': !expanded }">{{ text }}</p>
		<button
			v-if="overflowing"
			type="button"
			class="inline-flex min-h-11 items-center rounded text-sm font-semibold text-sky-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fipu_blue dark:text-sky-300"
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
