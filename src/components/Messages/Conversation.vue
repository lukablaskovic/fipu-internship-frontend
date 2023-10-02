<script setup>
import { chatStore, mainStore } from "@/main.js";
</script>
<template>
<div class="flex flex-col grow h-[200px] overflow-y-auto bg-white dark:bg-slate-900/25 px-4 py-3 gap-1
    scrollbar-none" id="messageContainer">
    <div class="flex flex-col h-full gap-1">

        <div class="grow opacity-0">&nbsp</div>
        <slot></slot>
        <div :class="(chatStore.c.user_1_id == mainStore.currentUser.id ? chatStore.c.user_2_active : chatStore.c.user_1_active) ? 'h-16 opacity-100' : 'h-0 opacity-0'"
            class="flex gap-1 items-end transition-all duration-300">
            <span>Typing</span> 
            <div class="w-0 h-0 overflow-hidden" v-if="chatStore.c.user_1_id == mainStore.currentUser.id ? chatStore.c.user_2_active : chatStore.c.user_1_active">{{ chatStore.scrollToBottom() }}</div>
            <span class="loading-dots flex gap-2">
                <span> . </span>
                <span> . </span>
                <span> . </span>
            </span>
        </div>
        <div class="min-h-[4px]"></div>
    </div>
    
</div>
</template>
<script>
import { chatStore } from "@/main.js";
import { mainStore } from "@/main.js";

export default {
    data() {
        return {
            intervalId: null,
            messageContainerRef: null
        }
    },
    created() {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(async () => {
            await chatStore.updateConversations(mainStore.currentUser.id);
            await chatStore.getMessages(chatStore.selectedConversation);
        }, 1000);
    },
    beforeDestroy() {
        console.log("destroy");
        clearInterval(this.intervalId);
    },
}
</script>

<style scoped>
@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.loading-dots span {
    display: inline-block;
    animation: bounce 1s infinite;
}

.loading-dots span:nth-child(2) {
    animation-delay: 0.1s;
}

.loading-dots span:nth-child(3) {
    animation-delay: 0.2s;
}

</style>