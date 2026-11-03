<script setup>
import UserAvatar from "@/components/User/UserAvatar.vue";

defineProps({ contact: { type: Object, required: true } });
</script>

<template>
	<div class="mb-6 w-full shrink-0 grow-0 basis-auto md:w-6/12">
		<div class="flex items-start">
			<div class="shrink-0">
				<div class="bg-primary-100 text-primary inline-block h-24 w-24 items-center rounded-md p-4">
					<a :href="contact.profile" target="_blank" rel="noopener noreferrer"><UserAvatar class="h-16 w-16" :avatar="contact.avatar" :username="contact.name" /></a>
				</div>
			</div>
			<div class="ml-3 grow">
				<p class="mb-2 font-bold dark:text-white">{{ contact.name }} ({{ contact.role }})</p>
				<p class="text-neutral-500 dark:text-neutral-200"><a :href="'mailto:' + contact.email" class="underline underline-offset-2">{{ contact.email }}</a></p>
				<p v-if="contact.phone" class="text-neutral-500 dark:text-neutral-200">{{ contact.phone }}</p>
				<p class="text-neutral-500 dark:text-neutral-200">ili preko UNIPU Google Chata</p>
			</div>
		</div>
	</div>
</template>
