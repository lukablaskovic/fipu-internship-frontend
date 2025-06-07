<template>
	<CardBox class="mb-6 last:mb-0" is-hoverable>
		<BaseLevel>
			<BaseLevel type="justify-start">
				<div class="h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-slate-700 md:mr-6"></div>
				<div class="space-y-2 text-center md:mr-6 md:text-left">
					<div class="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
					<div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
					<div class="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
					<div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
				</div>
			</BaseLevel>
			<div class="space-y-2 text-center md:text-right">
				<div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
				<div class="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
			</div>
		</BaseLevel>
	</CardBox>
</template>

<script setup>
import BaseLevel from "@/components/Base/BaseLevel.vue";
import CardBox from "@/components/Cardbox/CardBox.vue";
</script>

<style>
@keyframes pulse {
	0% {
		opacity: 0.6;
	}
	50% {
		opacity: 0.8;
	}
	100% {
		opacity: 0.6;
	}
}
</style>
