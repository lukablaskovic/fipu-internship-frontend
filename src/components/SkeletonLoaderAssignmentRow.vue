<template>
	<tr>
		<td v-if="checkable" class="border-b-0 before:hidden lg:w-6">
			<div class="h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td class="border-b-0 before:hidden lg:w-6">
			<div class="mx-auto h-6 w-6 animate-pulse rounded-full bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td>
			<div class="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td v-if="isAdmin">
			<div class="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td v-if="isAdmin">
			<div class="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
		<td class="whitespace-nowrap before:hidden lg:w-1">
			<div class="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-slate-700"></div>
		</td>
	</tr>
</template>

<script setup>
defineProps({
	checkable: {
		type: Boolean,
		default: false,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});
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
