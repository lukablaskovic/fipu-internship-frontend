<template>
	<button type="button" class="select-process-button" :aria-pressed="selectedProcess === button">
		<span class="option-heading">
			<span class="option-title">{{ button === "A" ? "Nemam poduzeće" : "Imam već dogovoreno" }}</span>
			<span class="option-model">Model {{ button }}</span>
			<BaseIcon :path="selectedProcess === button ? mdiCheckCircle : mdiCircleOutline" class="option-check" size="22" aria-hidden="true" />
		</span>
		<span class="option-steps">
			<span v-for="(text, index) in steps" :key="index" class="option-step"><span class="step-number" aria-hidden="true">{{ index + 1 }}.</span>{{ text }}</span>
		</span>
	</button>
</template>

<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiCheckCircle, mdiCircleOutline } from "@mdi/js";

defineProps({
	button: { type: String, default: "" },
	selectedProcess: { type: String, default: "" },
	steps: { type: Array, default: () => [] },
});
</script>

<style scoped>
.select-process-button {
	width: 100%;
	padding: 24px;
	border: 1px solid #d1d5db;
	border-radius: 12px;
	background: white;
	color: #212529;
	text-align: left;
	transition: background-color 150ms ease-out, border-color 150ms ease-out;
}
.select-process-button:hover { border-color: theme("colors.fipu_blue"); background: #f9fafb; }
.select-process-button[aria-pressed="true"] { border-color: theme("colors.fipu_blue"); background: theme("colors.fipu_blue / 10%"); }
.select-process-button:focus-visible { outline: 3px solid theme("colors.fipu_blue"); outline-offset: 4px; }
.option-heading { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.option-title { flex: 1; font-size: 18px; font-weight: 600; line-height: 1.4; }
.option-model { color: #4b5563; font-size: 13px; white-space: nowrap; }
.option-check { flex-shrink: 0; color: #6b7280; }
[aria-pressed="true"] .option-check { color: theme("colors.fipu_blue"); }
.option-steps { display: grid; gap: 8px; margin-top: 20px; color: #4b5563; font-size: 14px; line-height: 1.6; }
.option-step { display: flex; gap: 10px; }
.step-number { color: #6b7280; font-variant-numeric: tabular-nums; }
@media (max-width: 640px) {
	.select-process-button { padding: 20px; }
	.option-heading { gap: 8px; }
	.option-title { flex-basis: 100%; }
	.option-check { margin-left: auto; }
}
@media (prefers-reduced-motion: reduce) {
	.select-process-button { transition: none; }
}
</style>
