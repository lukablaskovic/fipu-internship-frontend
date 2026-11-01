<script setup>
import { Avatar } from "reka-ui/namespaced";
import { mdiAccount } from "@mdi/js";
import BaseIcon from "@/components/Base/BaseIcon.vue";

defineProps({
	username: {
		type: String,
		default: null,
	},
	avatar: {
		type: String,
		default: null,
	},
	referrerPolicy: {
		type: String,
		default: undefined,
	},
});

defineEmits(["loadingStatusChange"]);
</script>

<template>
	<Avatar.Root as="div" class="relative inline-block aspect-square shrink-0 rounded-full bg-gray-100 align-middle dark:bg-slate-800">
		<Avatar.Image :src="avatar || ''" :alt="username || 'Profilna slika'" :referrer-policy="referrerPolicy" class="block h-full w-full max-w-full rounded-full object-cover" @loading-status-change="$emit('loadingStatusChange', $event)" />
		<Avatar.Fallback role="img" :aria-label="username || 'Profilna slika'" class="flex h-full w-full items-center justify-center rounded-full text-gray-500 dark:text-gray-400">
			<BaseIcon :path="mdiAccount" w="w-full" h="h-full" size="60%" aria-hidden="true" />
		</Avatar.Fallback>
		<slot />
	</Avatar.Root>
</template>
