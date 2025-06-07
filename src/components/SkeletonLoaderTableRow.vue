<template>
	<tr>
		<td class="border-b-0 before:hidden lg:w-6">
			<div class="mx-auto h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-12 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td class="lg:w-32">
			<div class="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td class="whitespace-nowrap before:hidden lg:w-1">
			<div class="flex space-x-2">
				<div class="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
				<div class="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
			</div>
		</td>
	</tr>
</template>

<script setup>
// No props or logic needed for this component
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
