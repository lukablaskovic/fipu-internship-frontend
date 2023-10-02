<script setup>
import BaseIcon from "@/components/Base/BaseIcon.vue";
import { mdiSend } from '@mdi/js';
import { chatStore } from "@/main.js";
</script>
<template>
    <div class="flex flex-row items-center px-3 py-3 bg-gray-200 dark:bg-slate-900/50">
        <input v-if="chatStore.c.status != 'archived'" @input="checkNewMessage()" v-model="chatStore.content" type="text" class="border-none bg-transparent focus:outline-none text-sm items-center w-full border text-fipu_gray dark:text-gray-300
         bg-white hover:bg-gray-50 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-700/40 dark:focus:bg-slate-800 rounded-3xl h-12 px-6" 
        placeholder="Type your message....">
        <div v-if="chatStore.c.status != 'archived'" class="ml-3">
            <button @click="chatStore.sendMessage()" class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 hover:bg-white text-fipu_gray
                dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:text-gray-300">
                <BaseIcon :path="mdiSend" :size="20"></BaseIcon>
            </button>
        </div>
        <div v-else class="h-10 w-full flex items-center justify-center font-medium">
            This conversation is archived.
        </div>  
    </div>
</template>

<script>
import { chatStore } from "@/main.js";

export default {
    methods: {
        async checkNewMessage() {
            if (chatStore.content.length == 1)
                await chatStore.updateUserActivity(true);
            if (chatStore.content.length == 0)
                await chatStore.updateUserActivity(false);
        }
    }
}
</script>
<style scoped>
[type='text']:focus, input:where(:not([type])):focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus {
    box-shadow: none !important;
}
</style>