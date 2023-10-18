<script setup>
import { onMounted } from "vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import MessageInput from "@/components/Messages/MessageInput.vue";
import ConversationsSideBar from "@/components/Messages/ConversationsSideBar.vue";
import ConversationPanel from "@/components/Messages/ConversationPanel.vue";
import Conversation from "@/components/Messages/Conversation.vue";
import Message from "@/components/Messages/Message.vue";

import { chatStore } from "@/main.js";
chatStore.getAllUsers();

onMounted(() => {});
</script>

<template>
	<LayoutAuthenticated>
		<div class="xl:max-w-7xl xl:mx-auto flex flex-col absolute h-full w-full justify-center items-center left-1/2 -translate-x-1/2">
			<div class="bg-gray-100 dark:bg-slate-800 h-full w-full flex flex-col drop-shadow">
				<div class="grow flex flex-col justify-end">
					<div class="flex flex-row grow antialiased text-gray-800 dark:text-gray-300 rounded overflow-hidden">
						<ConversationsSideBar />
						<ConversationPanel v-if="chatStore.selectedConversation != ''">
							<div class="absolute w-full h-16 bg-gradient-to-b dark:from-fipu_gray2 dark:via-fipu_gray2 from-white via-white top-0 right-2 pointer-events-none z-10"></div>
							<Conversation>
								<Message v-for="m in chatStore.messages" :text="m.content" :user="chatStore.getUser(m)" :reverse="m.receiver_id == chatStore.selectedConversation" />
							</Conversation>
							<MessageInput />
						</ConversationPanel>
						<ConversationPanel v-else>
							<div class="w-full h-full flex justify-center items-center">Odaberi razgovor</div>
						</ConversationPanel>
					</div>
				</div>
			</div>
		</div>
	</LayoutAuthenticated>
</template>
<script>
import { chatStore } from "@/main.js";
import { mainStore } from "@/main.js";

export default {
	data() {
		return {
			intervalId: null,
			messageContainerRef: null,
		};
	},
	created() {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(async () => {
			await chatStore.updateConversations(mainStore.currentUser.id);
			await chatStore.getMessages(chatStore.selectedConversation);
		}, 1000);
	},
	unmounted() {
		clearInterval(this.intervalId);
	},
};
</script>
