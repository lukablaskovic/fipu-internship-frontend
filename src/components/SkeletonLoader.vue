<template>
	<CardBox class="rounded-2xl border border-slate-200 dark:border-slate-700" role="status" aria-label="Učitavanje statistike...">
		<div class="flex items-start justify-between gap-5 motion-safe:animate-pulse" aria-hidden="true">
			<div class="min-w-0 flex-1">
				<div class="h-[21px] w-4/5 rounded-sm bg-gray-200 dark:bg-slate-700"></div>
				<div class="mt-3 h-[45px] w-16 rounded-sm bg-gray-200 dark:bg-slate-700"></div>
			</div>
			<div class="h-12 w-12 shrink-0 rounded-xl bg-gray-200 dark:bg-slate-700"></div>
		</div>
	</CardBox>
</template>

<script setup>
import CardBox from "@/components/Cardbox/CardBox.vue";
</script>
