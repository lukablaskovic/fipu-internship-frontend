<script setup>
import PillTagTrend from "@/components/PillTag/PillTagTrend.vue";
import NumberDynamic from "@/components/NumberDynamic.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import BaseLevel from "@/components/Base/BaseLevel.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
import BaseIcon from "@/components/Base/BaseIcon.vue";
import BaseLogo from "@/components/Base/BaseLogo.vue";
import { mdiCog } from "@mdi/js";

defineProps({
	number: {
		type: Number,
		default: 0,
	},
	text: {
		type: String,
		default: null,
	},
	icon: {
		type: String,
		default: null,
	},
	logo: {
		type: String,
		default: null,
	},
	prefix: {
		type: String,
		default: null,
	},
	suffix: {
		type: String,
		default: null,
	},
	label: {
		type: String,
		default: null,
	},
	color: {
		type: String,
		default: null,
	},
	trend: {
		type: String,
		default: null,
	},
	trendType: {
		type: String,
		default: null,
	},
	hoverable: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<CardBox is-hoverable :class="{ 'stat-card': icon, 'hover:border hover:border-fipu_blue hover:ring': hoverable }">
		<BaseLevel v-if="trend" class="mb-3" mobile>
			<PillTagTrend :trend="trend" :trend-type="trendType" small />
			<BaseButton :icon="mdiCog" icon-size="18" color="lightDark" small />
		</BaseLevel>
		<BaseLevel mobile class="widget-content">
			<div>
				<h3 class="widget-label text-lg leading-tight text-gray-500 dark:text-slate-400">
					{{ label }}
				</h3>
				<div class="widget-value text-3xl font-semibold leading-tight">
					<NumberDynamic v-if="text != '' && number !== null && number !== undefined" :value="number" :prefix="prefix" :suffix="suffix" />

					<span v-else class="text-2xl dark:text-slate-400">
						{{ text }}
					</span>
				</div>
			</div>
			<BaseIcon v-if="icon" :path="icon" size="28" w="w-12" h="h-12" class="widget-icon" :class="color" aria-hidden="true" />
			<BaseLogo v-if="logo" :src="logo" size="48" w="" h="h-16" :class="color" />
		</BaseLevel>
	</CardBox>
</template>

<style scoped>
.stat-card {
	border: 1px solid #e2e8f0;
	border-radius: 16px;
	box-shadow: none;
}
.stat-card .widget-content {
	align-items: flex-start;
	gap: 20px;
}
.stat-card .widget-content :deep(> div:first-child) {
	min-width: 0;
	flex: 1;
	justify-content: flex-start;
}
.stat-card .widget-label {
	font-size: 14px;
	font-weight: 500;
	line-height: 1.5;
}
.stat-card .widget-value {
	margin-top: 12px;
	font-size: 36px;
	letter-spacing: -0.025em;
	font-variant-numeric: tabular-nums;
}
.widget-icon {
	position: relative;
	flex-shrink: 0;
}
.widget-icon::before {
	position: absolute;
	inset: 0;
	border-radius: 12px;
	background: currentColor;
	opacity: 0.1;
	content: "";
}
.dark .stat-card {
	border-color: #334155;
}
</style>
