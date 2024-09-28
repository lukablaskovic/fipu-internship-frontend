<script setup>
import SnackBarItem from "@/components/Premium/SnackBarItem.vue";
import { snackBarStore } from "@/main";

const cancelMessage = (timestamp) => {
	snackBarStore.cancelMessage(timestamp);
};
</script>

<template>
	<div class="pointer-events-none fixed inset-0 z-100 flex flex-col-reverse overflow-hidden p-9">
		<SnackBarItem v-for="message in snackBarStore.messages" :key="message.timestamp" :timestamp="message.timestamp" :lifetime="message.lifetime" :text="message.text" :color="message.color" @cancel="cancelMessage" />
	</div>
</template>
