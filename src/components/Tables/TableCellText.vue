<script setup>
import { computed, toDisplayString } from "vue";
import { Popover } from "reka-ui/namespaced";
import BaseButton from "@/components/Base/BaseButton.vue";

const props = defineProps({ value: { type: [String, Number, Boolean, Array, Object], default: null } });
const text = computed(() => toDisplayString(props.value));
const words = computed(() => text.value.match(/\S+/g) || []);
</script>

<template>
	<span v-if="words.length <= 25"><slot>{{ text }}</slot></span>
	<span v-else class="block min-w-0 max-w-full whitespace-normal">
		<Popover.Root>
			<Popover.Trigger type="button" class="block max-w-full rounded text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-fipu_blue" @click.stop>
				<span class="preview break-words">{{ words.slice(0, 25).join(" ") }}…</span>
				<span class="mt-1 block text-sm font-medium text-fipu_blue underline dark:text-sky-300">Prikaži više<span class="sr-only"> — cijeli tekst</span></span>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content
					align="start"
					:side-offset="8"
					:collision-padding="16"
					aria-label="Cijeli tekst"
					class="reka-animated z-[10000] max-h-[min(70vh,var(--reka-popover-content-available-height))] w-96 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 text-left text-sm text-gray-900 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-white"
					@click.stop>
					<div class="whitespace-pre-wrap [overflow-wrap:anywhere]"><slot>{{ text }}</slot></div>
					<Popover.Close as-child><BaseButton class="mt-3" label="Zatvori" small /></Popover.Close>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	</span>
</template>

<style scoped>
.preview {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
}
</style>
