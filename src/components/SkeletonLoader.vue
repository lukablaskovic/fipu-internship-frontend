<template>
	<CardBox>
		<BaseLevel mobile>
			<div>
				<div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
				<div class="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
			</div>
			<div class="h-16 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-slate-700"></div>
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
