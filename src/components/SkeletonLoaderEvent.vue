<template>
	<BaseLevel full-width>
		<div class="mx-auto w-full rounded-md p-6 shadow">
			<div class="flex-1 space-y-6 py-1">
				<div class="h-2 animate-pulse rounded"></div>
				<div class="space-y-3">
					<div class="grid grid-cols-4 gap-4">
						<div class="col-span-3 h-2 animate-pulse rounded"></div>
					</div>
					<div class="h-2 animate-pulse rounded"></div>
				</div>
			</div>
		</div>
	</BaseLevel>
</template>

<script setup>
import BaseLevel from "./Base/BaseLevel.vue";
</script>

<style>
@keyframes pulse {
	0% {
		background-color: #f0f0f0;
	}
	50% {
		background-color: #e0e0e0;
	}
	100% {
		background-color: #f0f0f0;
	}
}
</style>
