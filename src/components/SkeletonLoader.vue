<template>
	<div class="mx-auto w-full max-w-sm rounded-md p-3 shadow">
		<div class="flex-1 space-y-6 py-1">
			<div class="h-2 animate-pulse rounded"></div>
			<div class="space-y-2">
				<div class="grid grid-cols-4 gap-4">
					<div class="col-span-3 h-2 animate-pulse rounded"></div>
					<div class="col-span-1 h-10 w-10 animate-pulse rounded-full"></div>
				</div>
				<div class="h-2 animate-pulse rounded"></div>
			</div>
		</div>
	</div>
</template>
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
