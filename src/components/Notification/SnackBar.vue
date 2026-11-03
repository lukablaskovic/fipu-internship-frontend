<script setup>
import { Toast } from "reka-ui/namespaced";
import SnackBarItem from "@/components/Notification/SnackBarItem.vue";
import { useSnackBarStore } from "@/stores/snackbar_store";

const snackBarStore = useSnackBarStore();

</script>

<template>
	<Toast.Provider label="Obavijest">
		<SnackBarItem v-for="message in snackBarStore.messages" :key="message.timestamp" :timestamp="message.timestamp" :lifetime="message.lifetime" :text="message.text" :color="message.color" @cancel="snackBarStore.cancelMessage" />
		<Teleport to="body">
			<Toast.Viewport label="Obavijesti ({hotkey})" class="pointer-events-none fixed bottom-0 right-0 z-[6000] flex max-h-screen w-full flex-col-reverse gap-6 overflow-y-auto p-9 md:w-auto md:max-w-full" />
		</Teleport>
	</Toast.Provider>
</template>
