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
	<CardBox is-hoverable :class="{ 'hover:border hover:border-fipu_blue hover:ring': hoverable }">
		<BaseLevel v-if="trend" class="mb-3" mobile>
			<PillTagTrend :trend="trend" :trend-type="trendType" small />
			<BaseButton :icon="mdiCog" iconSize="18" color="lightDark" small />
		</BaseLevel>
		<BaseLevel mobile>
			<div>
				<h3 class="text-lg leading-tight text-gray-500 dark:text-slate-400">
					{{ label }}
				</h3>
				<h1 class="text-3xl font-semibold leading-tight">
					<NumberDynamic v-if="text != '' && number !== null && number !== undefined" :value="number" :prefix="prefix" :suffix="suffix" />

					<span v-else class="text-2xl dark:text-slate-400">
						{{ text }}
					</span>
				</h1>
			</div>
			<BaseIcon v-if="icon" :path="icon" size="48" w="" h="h-16" :class="color" />
			<BaseLogo v-if="logo" :src="logo" size="48" w="" h="h-16" :class="color" />
		</BaseLevel>
	</CardBox>
</template>
